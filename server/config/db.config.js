const dotenv = require('dotenv');
dotenv.config();

const config = {
  uri: process.env.MONGODB_URI,
  dbName: 'speakx',
  collections: {
    questions: 'speakxdata'
  }
};

module.exports = config;
