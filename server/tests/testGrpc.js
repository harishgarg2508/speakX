const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const config = require('../config/db.config');
const quizService = require('../services/quizService');

const PROTO_PATH = path.join(__dirname, '../proto/quiz.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const QuizService = grpc.loadPackageDefinition(packageDefinition).quiz.QuizService;
const client = new QuizService(
    'localhost:50051',
    grpc.credentials.createInsecure()
);
const fetchQuestions = (limit, offset) => {
    client.getQuestions({ limit, offset }, (error, response) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        console.log('Questions:', JSON.stringify(response.questions, null, 2));
        
        // If there are more questions to fetch, fetch the next batch
        if (response.questions.length === limit) {
            fetchQuestions(limit, offset + limit);
        }
    });
};
fetchQuestions(1, 0);
// Test getQuestions
client.getQuestions({ limit: 20,offset: 0 }, (error, response) => {
    if (error) {
        console.error('Error:', error);
        return;
    }
    console.log('Questions:', response);
});