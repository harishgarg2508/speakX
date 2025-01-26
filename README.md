Advanced Search Application
Overview
Advanced search application with support for MCQs, Reading Comprehension, and Anagrams. Features real-time search, filtering, and sorting capabilities.

Tech Stack
Frontend:
React.js
Material-UI
Backend:
Node.js
Express
Database:
MongoDB Atlas
Additional:
gRPC
Envoy Proxy
Prerequisites
Node.js: v14+ (Install from Node.js Official Website)
MongoDB Atlas: Create an account at MongoDB Atlas
Envoy Proxy: Installation guide available at Envoy Proxy Official Website
Installation
Clone the repository:

![image](https://github.com/user-attachments/assets/93ebf8a9-20f7-4cba-9fdb-fe4f08c3deb6)


bash
git clone https://github.com/harishgarg2508/speakX.git
Install Server Dependencies:

bash
cd speakX/server
npm install
Install Client Dependencies:

bash
cd ../client
npm install
Environment Setup:
Create a .env file in the server directory and add the following variables:

env
GRPC_SERVER_PORT=50051
MONGODB_URI=your_mongodb_connection_string
Running the Application
Start Backend:

bash
cd server
npm start
Start Frontend:

bash
cd ../client
npm start
Access the application:
Open your browser and go to http://localhost:3000

![image](https://github.com/user-attachments/assets/5ea4b863-a8e3-47b3-a2d4-91c9ab33aec4)



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
Flowchart
Data Flow Details
User Input → Frontend
Search input triggers handleInputChange
Debounced search prevents excessive API calls
Updates searchQuery state
Frontend → Backend
Creates URL with query parameters
Sends GET request to /api/search
Includes pagination, sorting, filtering
Backend → Database
Express receives request
Builds MongoDB query
Executes search on Atlas cluster
Database → Backend
Returns matching documents
Includes pagination data
Formats response
Backend → Frontend
Returns JSON response
Updates React state
Triggers re-render
Frontend → Display
Renders type-specific cards
Shows pagination controls
Displays loading states
Additional Commands
Client
Start Development Server:

bash
npm start
Runs the app in development mode. Open http://localhost:3000 to view it in your browser. The page will reload if you make edits. You will also see any lint errors in the console.

Run Tests:

bash
npm test
Launches the test runner in the interactive watch mode.

Build for Production:

bash
npm run build
Builds the app for production to the build folder. It correctly bundles React in production mode and optimizes the build for the best performance.
