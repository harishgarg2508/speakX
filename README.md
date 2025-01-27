
# Advance Search Application

## **Overview**
Advanced search application with support for MCQs, Reading Comprehension, and Anagrams. Features real-time search, filtering, and sorting capabilities.

![mongo_db_data_fetching (1)](https://github.com/user-attachments/assets/1b386d5a-1128-47aa-baf1-8d8acc6e60a3) ![mongo_db_data_fetching (2)](https://github.com/user-attachments/assets/73f8b407-e2ff-4ff6-94a1-1209a8f228f5)
![mongo_db_data_fetching (3)](https://github.com/user-attachments/assets/70dd3299-1226-464f-beab-c098c7d8ade7)



# Watch the demo:

[Watch the demo on YouTube](https://www.youtube.com/watch?v=pBvrSaGC5aw)


![image](https://github.com/user-attachments/assets/b117b4c8-377b-4f72-8deb-247d7123d628)


## **Tech Stack**
- **Frontend**: React.js, Material-UI
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Additional**: gRPC, Envoy Proxy

## **Prerequisites**
- Node.js v14+
- MongoDB Atlas account
- Envoy Proxy

## **Installation**

1. **Clone repository**:
    ```bash
    git clone <repository-url>
    ```

2. **Server dependencies**:
    ```bash
    cd server
    npm install
    ```

3. **Client dependencies**:
    ```bash
    cd client
    npm install
    ```

4. **Environment Setup**: Create `.env` in the server directory:
    ```env
    GRPC_SERVER_PORT=50051
    MONGODB_URI=your_mongodb_connection_string
    ```

## **Running the Application**

1. **Start Backend**:
    ```bash
    cd server
    node server.js
    ```

2. **Start Frontend**:
    ```bash
    cd client
    npm start
    ```

3. **Access application at**: http://localhost:3000

## **Features**
- **Search Functionality**
    - Real-time search with debouncing
    - Filter by question types (MCQ, READ_ALONG, ANAGRAM)
    - Sort by title or type
    - Pagination support
- **Question Types**
    - **MCQ**
        - Multiple choice questions
        - Correct answer highlighting
        - Color-coded cards
    - **Reading Comprehension**
        - Linked questions
        - Content preview
    - **Anagrams**
        - Word arrangement
        - Solution display
- **API Documentation**
    - **REST Endpoints**
        - `GET /api/search`
            - Query params: query, page, limit, sortBy, sortOrder, types
        - `GET /api/question-types`
        - `GET /api/suggestions`

## **Flowchart**
![image](https://github.com/user-attachments/assets/98937d07-fa56-4c14-89bd-127e8fcfb959)
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
