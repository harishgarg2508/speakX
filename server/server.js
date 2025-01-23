// server/server.js
const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { connectDB } = require('./db/connection');
const { QuizService } = require('./services/quizService');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize gRPC server
const grpcServer = new grpc.Server();
const GRPC_PORT = process.env.GRPC_SERVER_PORT || 50051;

// Load proto file
const PROTO_PATH = path.join(__dirname, 'proto/quiz.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// Add the service to gRPC server
grpcServer.addService(protoDescriptor.quiz.QuizService.service, new QuizService());

// Start servers
async function startServers() {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start gRPC server
        grpcServer.bindAsync(
            `0.0.0.0:${GRPC_PORT}`,
            grpc.ServerCredentials.createInsecure(),
            (error, port) => {
                if (error) {
                    throw error;
                }
                grpcServer.start();
                console.log(`gRPC server running on port ${port}`);
            }
        );

        // Start Express server
        app.listen(PORT, () => {
            console.log(`Express server running on port ${PORT}`);
        });

        // Add a test endpoint
        app.get('/test', async (req, res) => {
            try {
                const db = require('./db/connection').getDB();
                const count = await db.collection('questions').countDocuments();
                res.json({ 
                    status: 'success',
                    message: 'Database connection working',
                    questionsCount: count
                });
            } catch (error) {
                res.status(500).json({ 
                    status: 'error',
                    message: error.message 
                });
            }
        });

    } catch (error) {
        console.error('Failed to start servers:', error);
        process.exit(1);
    }
}

startServers();