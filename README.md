flowchart TD
    A[User Interface] -->|Search Input| B[Frontend React Component]
    B -->|Debounce Input\n(300ms)| C{Input Validation}
    
    C -->|Valid Input| D[Prepare Search Parameters]
    D --> E[Construct API Request]
    E -->|GET /api/search| F[Express Backend Server]
    
    C -->|Invalid/Empty| G[Clear Results\nShow Initial State]
    
    F -->|Validate Params| H[Build MongoDB Query]
    H --> I[MongoDB Atlas]
    
    I -->|Query Documents| J[Process Search Results]
    J --> K[Prepare Response]
    K -->|JSON Response| L[Send to Frontend]
    
    L --> M[Update React State]
    M --> N[Render Results]
    
    N --> O{Result Type}
    O -->|MCQ| P[Render MCQ Cards]
    O -->|Reading Comprehension| Q[Render Reading Cards]
    O -->|Anagram| R[Render Anagram Cards]
    
    N --> S[Display Pagination]
    N --> T[Show/Hide Loading Indicator]
    
    subgraph "Frontend Interactions"
    B
    C
    D
    E
    M
    N
    O
    P
    Q
    R
    S
    T
    end
    
    subgraph "Backend Processing"
    F
    H
    I
    J
    K
    L
    end
