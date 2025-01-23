const { connectDB } = require('../connection');
const Question = require('../models/question');

async function setup() {
  try {
    await connectDB();
    await Question.createIndexes();
    console.log('Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setup();
}

module.exports = setup;