const { getDB } = require('../connection');
const config = require('../../config/db.config');

class Question {
  static async createIndexes() {
    const db = getDB();
    const collection = db.collection(config.collections.questions);
    
    await collection.createIndexes([
      { key: { type: 1 }, name: 'type_idx' },
      { key: { anagramType: 1 }, name: 'anagram_type_idx' },
      { key: { siblingId: 1 }, name: 'sibling_idx' }
    ]);
    
    console.log('Indexes created successfully');
  }
  



  static async findByType(type, limit = 10, offset = 0) {
    const db = getDB();
    return db.collection(config.collections.questions)
      .find({ type })
      .skip(offset)
      .limit(limit)
      .toArray();
  }

  // Method to fetch all questions
  static async findAll(limit = 10, offset = 0) {
    const db = getDB();
    return db.collection(config.collections.questions)
      .find({})
      .skip(offset)
      .limit(limit)
      .toArray();
  }
  
  // Add more query methods as needed
}

module.exports = Question;