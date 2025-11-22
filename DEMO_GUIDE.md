# AcadeMeet Demo Guide - Technical Q&A

## A. BACKEND-FRONTEND COMMUNICATION & CRUD OPERATIONS

### 1. GET REQUEST: How Frontend Talks to Backend

#### **What is a GET Request?**
A GET request is like asking the waiter for the menu - you're requesting information from the server without changing anything. In our app, we use GET requests to retrieve data like sessions, notes, and user information.

#### **Example: Fetching Sessions**

**Frontend File:** `frontend/src/logic/sessions/SessionsPage.logic.js`

```javascript
const fetchSessions = async () => {
  try {
    setLoading(true);  // Show loading spinner to user
    
    // 1. Frontend makes HTTP GET request
    // This is like making a phone call to the backend server
    const response = await fetch('http://localhost:8080/api/sessions/all-sessions');
    
    // 2. Check if request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // 3. Parse JSON response from backend
    // Backend sends data as JSON text, we convert it to JavaScript objects
    const data = await response.json();
    
    // 4. Update React state with the fetched data
    // This triggers a re-render and shows sessions on the page
    setSessions(data);
  } catch (err) {
    // If anything goes wrong, show error message to user
    setError('Failed to fetch sessions. Please try again later.');
  }
};
```

**Backend File:** `backend/src/main/java/com/appdev/academeet/controller/SessionController.java`

```java
// @GetMapping tells Spring this method handles GET requests
// The path "/all-sessions" is appended to the base "/api/sessions"
@GetMapping("/all-sessions")
public List<SessionDTO> getAllSessions() {
    // This method calls the service layer which queries the database
    // It returns a list of session data that Spring automatically converts to JSON
    return sessionService.getAllSessions();
}
```

**How it works step-by-step:**

1. **User Opens Sessions Page:**
   - React component loads
   - `useEffect` hook automatically calls `fetchSessions()`
   
2. **Frontend Sends Request:**
   - `fetch()` function sends HTTP GET request to `http://localhost:8080/api/sessions/all-sessions`
   - This is a cross-origin request (React port 5173 → Spring Boot port 8080)
   - CORS headers allow this connection
   
3. **Backend Receives Request:**
   - Spring Boot's `@GetMapping("/all-sessions")` catches the request
   - Calls `sessionService.getAllSessions()`
   - Service queries MySQL database using JPA
   - Database returns rows from `sessions` table
   
4. **Backend Returns Data:**
   - Service converts database rows to `SessionDTO` objects
   - Spring Boot automatically converts Java objects to JSON format
   - Response looks like: `[{sessionId: 1, title: "Study Group", location: "Library", ...}, ...]`
   
5. **Frontend Receives Response:**
   - `await response.json()` converts JSON text to JavaScript array
   - `setSessions(data)` updates React state
   - Component re-renders and displays sessions on the page

---

**Example: Fetching Notes**

**Frontend File:** `frontend/src/services/noteService.js`

```javascript
async getActiveNotes() {
  const res = await fetch(`${API_BASE_URL}/notes/active`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    throw new Error('Failed to load notes');
  }
  const data = await res.json();
  return data;
}
```

**Backend File:** `backend/src/main/java/com/appdev/academeet/controller/NoteController.java`

```java
@GetMapping("/active")
public ResponseEntity<List<Note>> getActiveNotes() {
    List<Note> notes = noteService.getNotesByStatus(getCurrentUserId(), NoteStatus.ACTIVE);
    return ResponseEntity.ok(notes);
}
```

---

### 2. POST REQUEST: Sending Data to Backend

**Example: User Login**

**Frontend File:** `frontend/src/services/authService.js`

```javascript
async login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // Request body sent to backend
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  
  return data; // Returns: {studentId, name, email}
}
```

**Backend File:** `backend/src/main/java/com/appdev/academeet/controller/AuthController.java`

```java
@PostMapping("/login")
public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
    // 1. Receives email and password from request body
    AuthResponse response = authService.login(request);
    
    // 2. Validates credentials in AuthService
    // 3. Returns success response with user data
    if (response.getId() == null) {
        return ResponseEntity.badRequest().body(response);
    }
    
    return ResponseEntity.ok(response);
}
```

**What happens in backend:**
1. Spring Boot receives POST request at `/api/auth/login`
2. `@RequestBody` converts JSON to `LoginRequest` object
3. `authService.login()` validates email/password against MySQL database
4. Returns `AuthResponse` with user ID, name, email
5. **Success message:** `ResponseEntity.ok(response)` returns HTTP 200 with user data

---

**Example: Creating a Note**

**Frontend File:** `frontend/src/services/noteService.js`

```javascript
async createNote({ title, content, tagIds = [] }) {
  const payload = {
    title: title || 'Untitled Note',
    type: 'RICHTEXT',
    content: content || '',
    tagIds,
  };

  const res = await fetch(`${API_BASE_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to create note');
  }

  return await res.json(); // Returns created note
}
```

**Backend File:** `backend/src/main/java/com/appdev/academeet/controller/NoteController.java`

```java
@PostMapping
public ResponseEntity<?> createNote(@RequestBody NoteRequest request) {
    try {
        Note newNote = noteService.createNote(request, getCurrentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(newNote);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("error", "Failed to create note: " + e.getMessage()));
    }
}
```

**Body sent:** `{title: "My Note", type: "RICHTEXT", content: "<p>Hello</p>", tagIds: [1, 2]}`

**What happens in backend:**
1. Receives note data in request body
2. `noteService.createNote()` saves to MySQL database using JPA
3. Returns created note with auto-generated ID
4. **Success:** HTTP 201 CREATED with note object

---

### 3. COMPLETE CRUD OPERATIONS

**File:** `backend/src/main/java/com/appdev/academeet/controller/NoteController.java`

#### **CREATE (POST)**
```java
@PostMapping
public ResponseEntity<?> createNote(@RequestBody NoteRequest request) {
    Note newNote = noteService.createNote(request, getCurrentUserId());
    return ResponseEntity.status(HttpStatus.CREATED).body(newNote);
}
```
- **Endpoint:** `POST /api/notes`
- **Body:** `{title, content, tagIds}`
- **Returns:** Created note with ID

#### **READ (GET)**
```java
@GetMapping("/active")
public ResponseEntity<List<Note>> getActiveNotes() {
    List<Note> notes = noteService.getNotesByStatus(getCurrentUserId(), NoteStatus.ACTIVE);
    return ResponseEntity.ok(notes);
}
```
- **Endpoint:** `GET /api/notes/active`
- **Returns:** Array of notes

#### **UPDATE (PUT)**
```java
@PutMapping("/{noteId}")
public ResponseEntity<?> updateNote(@PathVariable Long noteId, @RequestBody NoteRequest request) {
    Note updatedNote = noteService.updateNote(noteId, getCurrentUserId(), request);
    return ResponseEntity.ok(updatedNote);
}
```
- **Endpoint:** `PUT /api/notes/{noteId}`
- **Body:** `{title, content, tagIds}`
- **Returns:** Updated note

#### **DELETE (DELETE)**
```java
@DeleteMapping("/{noteId}")
public ResponseEntity<?> trashNote(@PathVariable Long noteId) {
    noteService.setNoteStatus(noteId, getCurrentUserId(), NoteStatus.TRASH);
    return ResponseEntity.ok().build();
}
```
- **Endpoint:** `DELETE /api/notes/{noteId}`
- **Returns:** HTTP 200 OK (soft delete - moves to trash)

---

### 4. How Spring Boot Connects to React

**CORS Configuration File:** `backend/src/main/java/com/appdev/academeet/config/SecurityConfig.java`

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    // Allow React dev server to make requests
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5174"));
    // Allow all HTTP methods
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    // Allow all headers
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

**Frontend Base URL:** `frontend/src/services/authService.js`

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

**How they connect:**
1. React runs on `http://localhost:5173` (Vite dev server)
2. Spring Boot runs on `http://localhost:8080`
3. **CORS** allows React to make cross-origin requests to Spring Boot
4. All API calls from React go to `http://localhost:8080/api/*`
5. Spring Boot processes requests and sends JSON responses back

---

### 5. How Spring Boot Connects to MySQL

**Configuration File:** `backend/src/main/resources/application-local.properties`

```properties
# Database connection
spring.datasource.url=jdbc:mysql://localhost:3306/academeet_db?serverTimezone=UTC&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=Mark_Anton123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate settings
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

**How it works:**
1. Spring Boot uses **JDBC driver** to connect to MySQL on `localhost:3306`
2. Connects to database `academeet_db` using credentials (root/password)
3. **Hibernate** (JPA implementation) auto-creates tables from Entity classes
4. `ddl-auto=create-drop`: Creates tables on startup, drops on shutdown
5. All database operations go through **JPA repositories**

---

### 6. What is JPA? Hibernate?

**JPA (Java Persistence API):**
- **Standard specification** for managing relational data in Java
- Defines how Java objects map to database tables
- Provides repository interfaces for database operations

**Hibernate:**
- **Implementation of JPA specification**
- ORM (Object-Relational Mapping) framework
- Converts Java objects to SQL queries automatically

**Example Entity:** `backend/src/main/java/com/appdev/academeet/model/User.java`

```java
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    
    private String name;
    private String email;
    private String password;
    // ... getters and setters
}
```

**How it works:**
1. `@Entity` tells Hibernate this is a database table
2. `@Table(name = "user")` specifies table name
3. `@Id` marks primary key
4. Hibernate automatically creates SQL: `CREATE TABLE user (userId BIGINT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255), ...)`

---

## B. REACT & STATE MANAGEMENT

### 1. How Login System Works

**Flow Diagram:**
```
User enters email/password → Form submits → POST request → Backend validates → 
Response → Store in localStorage → Navigate to dashboard
```

**Frontend Logic File:** `frontend/src/logic/login/LoginPage.logic.js`

```javascript
const handleSubmit = async (e) => {
  e.preventDefault(); // 1. Prevent page reload
  setError('');
  setLoading(true);
  
  try {
    // 2. Send POST request to backend
    const response = await authService.login(email, password);
    console.log('Login successful:', response);
    
    // 3. Store user data in localStorage
    localStorage.setItem('student', JSON.stringify({
      studentId: response.studentId,
      name: response.name,
      email: response.email
    }));
    
    // 4. Navigate to dashboard
    navigate('/dashboard');
  } catch (error) {
    // 5. Show error message if failed
    setError(error.message || 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

**Backend Validation:** `backend/src/main/java/com/appdev/academeet/service/AuthService.java`

The backend:
1. Receives email and password
2. Queries MySQL database for user with that email
3. Uses BCrypt to compare hashed password
4. Returns user data if valid, error if invalid

---

### 2. How State is Handled

**useState - Component State**

**File:** `frontend/src/logic/login/LoginPage.logic.js`

```javascript
export const useLoginPage = () => {
  const [email, setEmail] = useState(''); // Email input state
  const [password, setPassword] = useState(''); // Password input state
  const [showPassword, setShowPassword] = useState(false); // Toggle visibility
  const [error, setError] = useState(''); // Error message state
  const [loading, setLoading] = useState(false); // Loading state
  
  // State updates trigger re-render
  const handleSubmit = async (e) => {
    setLoading(true); // Component re-renders with loading=true
    // ... API call
    setLoading(false); // Component re-renders with loading=false
  };
  
  return { email, setEmail, password, setPassword, ... };
};
```

**useEffect - Side Effects**

**File:** `frontend/src/logic/dashboard/DashboardPage.logic.js`

```javascript
// Load notes when component mounts or activeNotesTab changes
useEffect(() => {
  const loadNotes = async () => {
    if (activeNotesTab !== 'my') return;
    
    setNotesLoading(true);
    try {
      const data = await noteService.getActiveNotes();
      setNotes(data);
    } catch (err) {
      setNotesError(err.message);
    } finally {
      setNotesLoading(false);
    }
  };

  loadNotes();
}, [activeNotesTab]); // Runs when activeNotesTab changes
```

**Props - Passing Data to Children**

**Parent Page:** `frontend/src/pages/LoginPage.jsx`

```javascript
function LoginPage() {
  const logic = useLoginPage();
  
  // Pass state and functions as props to child components
  return (
    <LoginForm 
      email={logic.email}
      password={logic.password}
      error={logic.error}
      loading={logic.loading}
      onEmailChange={logic.setEmail}
      onPasswordChange={logic.setPassword}
      onSubmit={logic.handleSubmit}
    />
  );
}
```

---

### 3. Where User Data is Stored

**localStorage**

**File:** `frontend/src/logic/login/LoginPage.logic.js`

```javascript
// Store user data after successful login
localStorage.setItem('student', JSON.stringify({
  studentId: response.studentId,
  name: response.name,
  email: response.email
}));

// Retrieve user data
const student = localStorage.getItem('student');
if (student) {
  const userData = JSON.parse(student);
  console.log(userData.name);
}
```

**Why localStorage?**
- Persists across page refreshes
- Survives browser close/reopen
- Available globally in application

**Security Note:** In production, you should use JWT tokens instead of storing raw user data.

---

### 4. Folder Structure Explanation

```
frontend/src/
├── pages/              # Full page components (LoginPage, DashboardPage)
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   └── NotesPage.jsx
│
├── components/         # Reusable UI components
│   ├── login/          # Login-specific components
│   ├── dashboard/      # Dashboard widgets
│   └── ui/             # Generic UI components (buttons, cards)
│
├── logic/              # Business logic (separated from UI)
│   ├── login/
│   │   └── LoginPage.logic.js    # useState, useEffect, handlers
│   └── dashboard/
│       └── DashboardPage.logic.js
│
├── services/           # API communication layer
│   ├── authService.js  # Login, signup API calls
│   └── noteService.js  # Note CRUD API calls
│
├── styles/             # CSS files
│   ├── login/
│   └── dashboard/
│
└── utils/              # Helper functions
    └── dateTimeUtils.js
```

**Why this structure?**
- **Separation of concerns:** Logic separated from UI
- **Reusability:** Components can be reused across pages
- **Maintainability:** Easy to find and update code
- **Scalability:** Easy to add new features

---

### 5. How to Connect to Backend

**Base URL Configuration:** `frontend/src/services/authService.js`

```javascript
const API_BASE_URL = 'http://localhost:8080/api';

export const authService = {
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  }
};
```

**CORS Configuration:** `backend/src/main/java/com/appdev/academeet/config/SecurityConfig.java`

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    return source;
}
```

**Full Flow Example:**

1. **User clicks "Login" button**
2. **State changes:** `setLoading(true)`
3. **React re-renders:** Button shows loading spinner
4. **API call happens:** `fetch('http://localhost:8080/api/auth/login', {...})`
5. **Spring Boot handles request:** Validates credentials in database
6. **Returns data back:** `{studentId: 1, name: "John", email: "john@example.com"}`
7. **State updates:** `setUser(data)`, `setLoading(false)`
8. **React re-renders:** Shows dashboard with user data

---

### 6. React Component Lifecycle

**Example:** `frontend/src/logic/sessions/SessionsPage.logic.js`

```javascript
export const useSessionsPage = () => {
  const [sessions, setSessions] = useState([]); // 1. Initial state
  
  useEffect(() => {
    // 2. Component mounts → fetch data
    fetchSessions();
  }, []); // Empty array = run once on mount
  
  const fetchSessions = async () => {
    // 3. User interaction or automatic trigger
    const response = await fetch('http://localhost:8080/api/sessions/all-sessions');
    const data = await response.json();
    // 4. State changes
    setSessions(data);
    // 5. React automatically re-renders component
  };
  
  return { sessions };
};
```

**Timeline:**
1. Component renders with empty sessions array
2. `useEffect` runs → fetches data from backend
3. Backend returns data
4. `setSessions(data)` updates state
5. Component re-renders with populated sessions

---

### 7. Error Handling

#### **Frontend Validation**

**File:** `frontend/src/logic/login/LoginPage.logic.js`

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Client-side validation
  if (!email || !password) {
    setError('Please fill in all fields');
    return;
  }
  
  try {
    const response = await authService.login(email, password);
    // Success handling
  } catch (error) {
    // Display error from backend
    setError(error.message || 'Login failed. Please try again.');
  }
};
```

#### **Backend Exception Handling**

**File:** `backend/src/main/java/com/appdev/academeet/controller/NoteController.java`

```java
@PostMapping
public ResponseEntity<?> createNote(@RequestBody NoteRequest request) {
    try {
        Note newNote = noteService.createNote(request, getCurrentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(newNote);
    } catch (Exception e) {
        // Return error response
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("error", "Failed to create note: " + e.getMessage()));
    }
}

@PutMapping("/{noteId}")
public ResponseEntity<?> updateNote(@PathVariable Long noteId, @RequestBody NoteRequest request) {
    try {
        Note updatedNote = noteService.updateNote(noteId, getCurrentUserId(), request);
        return ResponseEntity.ok(updatedNote);
    } catch (Exception e) {
        if (e.getMessage().contains("not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("error", "Failed to update note: " + e.getMessage()));
    }
}
```

#### **HTTP Status Codes**

**File:** `backend/src/main/java/com/appdev/academeet/controller/AuthController.java`

```java
@PostMapping("/login")
public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
    AuthResponse response = authService.login(request);
    
    if (response.getId() == null) {
        return ResponseEntity.badRequest().body(response); // 400 Bad Request
    }
    
    return ResponseEntity.ok(response); // 200 OK
}
```

**Common HTTP Status Codes in Project:**
- **200 OK:** Request successful
- **201 CREATED:** Resource created successfully
- **400 BAD REQUEST:** Invalid data sent
- **401 UNAUTHORIZED:** Not authenticated
- **404 NOT FOUND:** Resource doesn't exist
- **500 INTERNAL SERVER ERROR:** Server error

---

## Quick Reference Chart

| Operation | Frontend File | Backend File | HTTP Method | Endpoint |
|-----------|---------------|--------------|-------------|----------|
| Login | `services/authService.js` | `controller/AuthController.java` | POST | `/api/auth/login` |
| Get Notes | `services/noteService.js` | `controller/NoteController.java` | GET | `/api/notes/active` |
| Create Note | `services/noteService.js` | `controller/NoteController.java` | POST | `/api/notes` |
| Update Note | N/A | `controller/NoteController.java` | PUT | `/api/notes/{id}` |
| Delete Note | N/A | `controller/NoteController.java` | DELETE | `/api/notes/{id}` |
| Get Sessions | `logic/sessions/SessionsPage.logic.js` | `controller/SessionController.java` | GET | `/api/sessions/all-sessions` |

---

## Demo Tips

1. **Show live API calls in browser DevTools Network tab**
2. **Show MySQL Workbench with actual tables and data**
3. **Demonstrate state changes in React DevTools**
4. **Show CORS configuration allowing frontend to call backend**
5. **Walk through one complete flow: Button click → API call → Database → Response → UI update**

Good luck with your demo! 🚀
