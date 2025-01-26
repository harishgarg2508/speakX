# SpeakX Search Application

## Overview
Advanced search application with support for MCQs, Reading Comprehension, and Anagrams. Features real-time search, filtering, and sorting capabilities.

## Tech Stack
- Frontend: React.js, Material-UI
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Additional: gRPC, Envoy Proxy

## Prerequisites
- Node.js v14+
- MongoDB Atlas account
- Envoy Proxy

## Installation

1. Clone repository:
```bash
git clone <repository-url>

# Server dependencies
cd server
npm install

# Client dependencies
cd client
npm install

Environment Setup: Create .env in server directory:
GRPC_SERVER_PORT=50051
MONGODB_URI=your_mongodb_connection_string



Running the Application
Start Backend:
cd server
npm start


Start Frontend:
cd client
npm start



Access application at: http://localhost:3000


Features
Search Functionality
Real-time search with debouncing
Filter by question types (MCQ, READ_ALONG, ANAGRAM)
Sort by title or type
Pagination support
Question Types
MCQ

Multiple choice questions
Correct answer highlighting
Color-coded cards
Reading Comprehension

Linked questions
Content preview
Anagrams

Word arrangement
Solution display
API Documentation
REST Endpoints
GET /api/search
Query params: query, page, limit, sortBy, sortOrder, types
GET /api/question-types
GET /api/suggestions
