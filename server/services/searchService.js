const { connectDB } = require('../db/connection');
const { ObjectId } = require('mongodb');

class SearchService {
  async search(call, callback) {
    try {
      // Extract request parameters
      const { query, limit = 10, filters = [] } = call.request;

      // Validate query
      if (!query || query.trim() === '') {
        return callback(null, { 
          results: [], 
          total_count: 0, 
          search_type: 'empty_query' 
        });
      }

      // Connect to database
      const db = await connectDB();
      
      // Prepare text search pipeline
      const pipeline = [
        // Text search stage
        {
          $search: {
            index: 'search_text_index', // Ensure this index exists
            text: {
              query: query,
              path: ['title', 'description', 'type'],
              fuzzy: { maxEdits: 1 }, // Allow slight misspellings
              score: { boost: { value: 2 } }
            }
          }
        },
        // Additional filtering if needed
        ...(filters.length > 0 ? [{
          $match: {
            type: { $in: filters }
          }
        }] : []),
        // Project and transform results
        {
          $project: {
            id: { $toString: '$_id' },
            title: 1,
            description: 1,
            type: 1,
            score: { $meta: 'searchScore' }
          }
        },
        // Sort by relevance
        { $sort: { score: -1 } },
        // Limit results
        { $limit: limit }
      ];

      // Execute search
      const results = await db.collection('speakxdata')
        .aggregate(pipeline)
        .toArray();

      // Fallback to regex if no results
      if (results.length === 0) {
        const fallbackResults = await db.collection('speakxdata')
          .find({
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
              { type: { $regex: query, $options: 'i' } }
            ],
            ...(filters.length > 0 ? { type: { $in: filters } } : {})
          })
          .limit(limit)
          .toArray();

        return callback(null, {
          results: fallbackResults.map(result => ({
            id: result._id.toString(),
            title: result.title,
            description: result.description,
            type: result.type,
            score: 0
          })),
          total_count: fallbackResults.length,
          search_type: 'fallback_regex'
        });
      }

      // Return successful results
      callback(null, {
        results: results.map(result => ({
          id: result.id,
          title: result.title,
          description: result.description,
          type: result.type,
          score: result.score
        })),
        total_count: results.length,
        search_type: 'text_index'
      });
    } catch (error) {
      console.error('Search Service Error:', error);
      callback({
        code: grpc.status.INTERNAL,
        details: 'Internal search error',
        metadata: error.toString()
      });
    }
  }

  async getSearchSuggestions(call, callback) {
    try {
      const { query, limit = 5 } = call.request;

      // Validate query
      if (!query || query.trim() === '') {
        return callback(null, { suggestions: [] });
      }

      // Connect to database
      const db = await connectDB();

      // Aggregation pipeline for suggestions
      const suggestions = await db.collection('speakxdata')
        .aggregate([
          {
            $search: {
              index: 'autocomplete_index', // Separate autocomplete index
              autocomplete: {
                query: query,
                path: 'title',
                fuzzy: { maxEdits: 1 }
              }
            }
          },
          {
            $group: {
              _id: '$type',
              suggestions: { $addToSet: '$title' }
            }
          },
          { $unwind: '$suggestions' },
          { $limit: limit }
        ])
        .toArray();

      // Transform suggestions
      const formattedSuggestions = suggestions.map(suggestion => ({
        text: suggestion.suggestions,
        type: suggestion._id
      }));

      callback(null, { suggestions: formattedSuggestions });
    } catch (error) {
      console.error('Suggestions Service Error:', error);
      callback({
        code: grpc.status.INTERNAL,
        details: 'Internal suggestions error',
        metadata: error.toString()
      });
    }
  }
}

module.exports = { SearchService };