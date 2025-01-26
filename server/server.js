const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { connectDB } = require('./db/connection');
const { SearchService } = require('./services/searchService');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize gRPC server
const grpcServer = new grpc.Server();
const GRPC_PORT = process.env.GRPC_SERVER_PORT || 50051;

// Load proto file
const PROTO_PATH = path.join(__dirname, 'proto/search.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// Middleware
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:8080',
        '*'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Add the search service to gRPC server
grpcServer.addService(protoDescriptor.search.SearchService.service, new SearchService());

// Comprehensive Index Creation Function
async function setupSearchIndexes(db) {
    try {
        console.log("Starting comprehensive index creation process...");

        // Drop existing indexes (optional, use carefully)
        await db.collection('speakxdata').dropIndexes();

        // Create comprehensive text search index
        const indexResults = await db.collection('speakxdata').createIndexes([
            {
                name: "search_text_index",
                key: { 
                    title: 'text', 
                    description: 'text', 
                    type: 'text' 
                },
                weights: {
                    title: 3,
                    description: 2,
                    type: 1
                },
                background: true
            },
            // Autocomplete Index
            {
                name: "autocomplete_index",
                key: { 
                    title: 1,
                    type: 1
                },
                background: true
            },
            // Supporting Indexes
            {
                name: "type_index",
                key: { type: 1 },
                background: true
            },
            {
                name: "title_search_index",
                key: { title: 1 },
                background: true
            }
        ]);

        console.log("Indexes created successfully:", indexResults);
        return true;
    } catch (error) {
        console.error("Index creation error:", error);
        throw error;
    }
}

// Comprehensive Search Endpoint
app.get('/api/search', async (req, res) => {
    try {
        const { 
            query = '', 
            page = 1, 
            limit = 10,
            sortBy = 'title',
            sortOrder = 'asc'
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const db = await connectDB();
        
        // Create the search query
        const searchQuery = {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { type: { $regex: query, $options: 'i' } }
            ]
        };

        // Get total count for pagination
        const totalCount = await db.collection('speakxdata')
            .countDocuments(searchQuery);

        // Get paginated results
        const results = await db.collection('speakxdata')
            .find(searchQuery)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();

        const totalPages = Math.ceil(totalCount / parseInt(limit));

        res.json({
            status: 'success',
            results: results.map(result => ({
                id: result._id.toString(),
                title: result.title,
                description: result.description,
                type: result.type
            })),
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: totalCount,
                itemsPerPage: parseInt(limit),
                hasNextPage: parseInt(page) < totalPages,
                hasPrevPage: parseInt(page) > 1
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Add a new endpoint for getting question types
app.get('/api/question-types', async (req, res) => {
    try {
        const db = await connectDB();
        const types = await db.collection('speakxdata')
            .distinct('type');
        
        res.json({
            status: 'success',
            types
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Modify the search endpoint to include type filtering
// Comprehensive Search Endpoint
app.get('/api/search', async (req, res) => {
    try {
        const { 
            query = '', 
            page = 1, 
            limit = 10,
            sortBy = 'title',
            sortOrder = 'asc',
            types = [] 
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const db = await connectDB();
        
        const searchQuery = {
            $and: [
                {
                    $or: [
                        { title: { $regex: query, $options: 'i' } },
                        { type: { $regex: query, $options: 'i' } }
                    ]
                }
            ]
        };

        if (types.length > 0) {
            const typeArray = Array.isArray(types) ? types : types.split(',');
            if (typeArray.length > 0) {
                searchQuery.$and.push({
                    type: { $in: typeArray }
                });
            }
        }

        // Get total count for pagination
        const totalCount = await db.collection('speakxdata')
            .countDocuments(searchQuery);

        // Get paginated results with all fields
        const results = await db.collection('speakxdata')
            .find(searchQuery)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();

        console.log('Raw results from DB:', results); // Debug log
        const formattedResults = results.map(item => {
            if (item.type === 'MCQ') {
                return {
                    ...item,
                    options: item.options.map(opt => ({
                        text: opt.text,
                        isCorrectAnswer: opt.isCorrectAnswer
                    }))
                };
            }
            return item;
        });

        // Map results to include all necessary fields based on type
        const mappedResults = results.map(result => {
            const baseResult = {
                id: result._id.toString(),
                title: result.title,
                type: result.type,
            };

            // Add type-specific fields
            switch (result.type) {
                case 'MCQ':
                    return {
                        ...baseResult,
                        options: result.options || [], // Array of {text, isCorrectAnswer}
                    };
                case 'ANAGRAM':
                    return {
                        ...baseResult,
                        anagramType: result.anagramType, // 'WORD' or 'SENTENCE'
                        blocks: result.blocks || [], // Array of {text, showInOption, isAnswer}
                        solution: result.solution
                    };
                case 'READ_ALONG':
                    return baseResult;
                default:
                    return baseResult;
            }
        });

        console.log('Mapped results:', mappedResults); // Debug log

        res.json({
            status: 'success',
            results: formattedResults,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / parseInt(limit)),
                totalItems: totalCount,
                itemsPerPage: parseInt(limit),
                hasNextPage: parseInt(page) < totalPages,
                hasPrevPage: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});
// Suggestions Endpoint
app.get('/api/suggestions', async (req, res) => {
    try {
        const { query = '', limit = 5 } = req.query;
        const db = await connectDB();
        
        const suggestions = await db.collection('speakxdata')
            .aggregate([
                {
                    $match: {
                        $or: [
                            { title: { $regex: query, $options: 'i' } },
                            { type: { $regex: query, $options: 'i' } }
                        ]
                    }
                },
                {
                    $group: {
                        _id: null,
                        suggestions: { $addToSet: '$title' }
                    }
                },
                { $unwind: '$suggestions' },
                { $limit: parseInt(limit) }
            ])
            .toArray();

        res.json({
            status: 'success',
            suggestions: suggestions.map(s => ({ 
                text: s.suggestions,
                type: 'suggestion'
            }))
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Health Check Endpoint
app.get('/health', async (req, res) => {
    try {
        const db = await connectDB();
        const count = await db.collection('speakxdata').countDocuments();
        
        // Check indexes
        const indexes = await db.collection('speakxdata').indexes();
        
        res.json({
            status: 'success',
            message: 'Server is healthy',
            databaseStatus: 'Connected',
            documentCount: count,
            indexCount: indexes.length,
            indexes: indexes.map(index => index.name)
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server health check failed',
            error: error.message
        });
    }
});

// Interactive Search Console
function setupInteractiveSearch() {
    const readline = require('readline');
    const fetch = require('node-fetch');  // Ensure you install node-fetch

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("Interactive Search Console");
    console.log("Commands:");
    console.log("- 'search <query>': Search data");
    console.log("- 'suggest <query>': Get suggestions");
    console.log("- 'exit': Close console");

    rl.on('line', async (input) => {
        const [command, ...queryParts] = input.split(' ');
        const query = queryParts.join(' ');

        try {
            switch(command) {
                case 'search':
                    const searchResponse = await fetch(`http://localhost:${PORT}/api/search?query=${query}`);
                    const searchResults = await searchResponse.json();
                    console.log('Search Results:', JSON.stringify(searchResults, null, 2));
                    break;
                case 'suggest':
                    const suggestResponse = await fetch(`http://localhost:${PORT}/api/suggestions?query=${query}`);
                    const suggestions = await suggestResponse.json();
                    console.log('Suggestions:', JSON.stringify(suggestions, null, 2));
                    break;
                case 'exit':
                    rl.close();
                    break;
                default:
                    console.log('Invalid command');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    });

    rl.on('close', () => {
        console.log('Interactive search console closed');
        process.exit(0);
    });
}

// Start servers
async function startServers() {
    try {
        // Connect to MongoDB
        const db = await connectDB();

        // Setup Search Indexes
        await setupSearchIndexes(db);

        // Start gRPC server
        grpcServer.bindAsync(
            `0.0.0.0:${GRPC_PORT}`,
            grpc.ServerCredentials.createInsecure(),
            (error, port) => {
                if (error) {
                    console.error('gRPC server binding failed:', error);
                    throw error;
                }
                
                grpcServer.start();
                console.log(`gRPC server running on port ${port}`);
            }
        );

        // Start Express server
        const server = app.listen(PORT, () => {
            console.log(`Express server running on port ${PORT}`);
            
            // Setup interactive search console
            setupInteractiveSearch();
        });

        // Graceful Shutdown
        const gracefulShutdown = (signal) => {
            console.log(`Received ${signal}. Starting graceful shutdown...`);
            
            server.close(() => {
                console.log('Express server closed');
                
                grpcServer.tryShutdown(() => {
                    console.log('gRPC server shutdown');
                    process.exit(0);
                });
            });
        };

        // Handle shutdown signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        console.error('Failed to start servers:', error);
        process.exit(1);
    }
}

// Catch any unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start the servers
startServers();