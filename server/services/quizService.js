const { connectDB } = require('../db/connection');
const config = require('../config/db.config');

class QuizService {
  async getQuestions(call, callback) {
    const db = await connectDB();
    const { limit, offset, typeFilter } = call.request;
    
    try {
      const query = typeFilter ? { type: typeFilter } : {};
      const questions = await db.collection(config.collections.questions)
        .find(query)
        .skip(offset)
        .limit(limit)
        .toArray();
      
      callback(null, { questions });
    } catch (err) {
      callback(err);
    }
  }
  
  // Implement other service methods...
}

module.exports = { QuizService };