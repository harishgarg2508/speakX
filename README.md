![image](https://github.com/user-attachments/assets/322691c6-c2c6-4f4b-b825-5e37b9a05d7a) ![image](https://github.com/user-attachments/assets/59db3dc8-7052-4702-bf9e-67aaca6de06c)




# SpeakX Search Application

## **Overview**
Advanced search application with support for MCQs, Reading Comprehension, and Anagrams. Features real-time search, filtering, and sorting capabilities.

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
    npm start
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
```
flowchart TD
    A[User types in search bar] -->|Triggers| B[handleInputChange]
    B -->|Debounced 300ms| C[handleSearch function]
    C -->|Creates URL params| D[API Request]
    D -->|Fetch to localhost:3000| E[Express Server]
    E -->|MongoDB Query| F[MongoDB Atlas]
    F -->|Returns Documents| E
    E -->|JSON Response| D
    D -->|Sets State| G[Update React State]
    G -->|Renders| H[Results Display]

    subgraph Frontend
    A
    B[handleInputChange<br/>- Updates searchQuery<br/>- Resets page to 1]
    C[handleSearch<br/>- Creates query params<br/>- Manages loading state]
    G[State Updates<br/>- results<br/>- pagination<br/>- loading]
    H[Display Components<br/>- MCQ Cards<br/>- Reading Cards<br/>- Anagram Cards]
    end

    subgraph Backend
    E[Express Server<br/>- Validates params<br/>- Builds query]
    end

    subgraph Database
    F[MongoDB Atlas<br/>- Executes query<br/>- Returns matching docs]
    end
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
