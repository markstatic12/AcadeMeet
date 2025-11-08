# Academeet

Academeet is a collaborative academic platform that allows students to share notes, join study sessions, participate in forums, and discover trending academic content. The platform consists of a **Spring Boot backend** with a **MySQL database** and a **React + Vite frontend**.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Frontend](#frontend)
  - [Folder Structure](#frontend-folder-structure)
  - [Setup and Running](#frontend-setup-and-running)
- [Backend](#backend)
  - [Folder Structure](#backend-folder-structure)
  - [Setup and Running](#backend-setup-and-running)
- [API Testing](#api-testing)
- [Environment Variables](#environment-variables)
- [Team](#team)

---

## Project Overview

Academeet provides a comprehensive academic collaboration platform with features including:

- **Authentication**: Sign up, log in, and manage user sessions.
- **Study Sessions**: Create, browse, and join collaborative study sessions.
- **Notes Library**: Upload, browse, and view notes.
- **Forums**: Post discussions, reply, and interact with the community.
- **Discovery**: Discover trending content and featured tutors.
- **Calendar**: View upcoming sessions and events.
- **User Profile & Following**: Manage your profile and follow other users.
- **Admin Panel**: Manage users, content moderation, and analytics.

---

## Frontend

The frontend is built using **React + Vite**, Tailwind CSS, and TypeScript.

### Frontend Folder Structure

```

academeet-frontend/
│
├── src/
│   ├── main.tsx            # Vite entry point
│   ├── index.css           # Global styles
│   ├── App.tsx             # Main app component with routing
│   ├── pages/              # Page components (Landing, Dashboard, Auth, Sessions, Notes, Forums, etc.)
│   ├── components/         # Reusable components (UI, layouts, sessions, forum, notes, discovery, calendar, admin)
│   ├── hooks/              # Custom React hooks (auth, sessions, notes, forum, toast, local storage)
│   ├── services/           # API and business logic services (authService, sessionService, noteService, etc.)
│   ├── store/              # State management (Zustand/Redux/Context)
│   ├── lib/                # Utility functions and constants
│   ├── types/              # TypeScript type definitions
│   ├── styles/             # Additional stylesheets (themes, animations, responsive)
│   └── assets/             # Images, icons, fonts
├── public/                 # Public static assets (favicon, images)
├── .env                    # Environment variables (dev)
├── .env.production         # Environment variables (prod)
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── package.json            # NPM dependencies
└── README.md               # Frontend documentation

````

### Frontend Setup and Running

1. Install dependencies:

```bash
cd academeet-frontend
npm install
````

2. Start the development server:

```bash
npm run dev
```

3. Open your browser at `http://localhost:5173` (default Vite port) to view the app.

---

## Backend

The backend is built using **Spring Boot** with **MySQL** as the database.

### Backend Folder Structure

```
academeet-backend/
│
├── src/
│   ├── main/
│   │   ├── java/com/academeet/
│   │   │   ├── AcademeetApplication.java
│   │   │   ├── controller/       # REST API endpoints (Auth, User, Session, Forum, Note, Search, Admin, FileUpload)
│   │   │   ├── service/          # Business logic layer
│   │   │   ├── repository/       # JPA repositories for database access
│   │   │   ├── entity/           # JPA Entity models
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── security/         # JWT authentication and security configuration
│   │   │   ├── config/           # Spring configuration classes (CORS, Database, Beans)
│   │   │   ├── exception/        # Custom exceptions and global handlers
│   │   │   ├── validation/       # Validation logic
│   │   │   ├── util/             # Utility classes
│   │   │   └── interceptor/      # Request/response interceptors
│   │   └── resources/            # application.yml, dev/prod profiles, messages.properties
│   └── test/                      # Unit and integration tests
├── pom.xml                        # Maven dependencies & build config
├── README.md                       # Backend documentation
```

### Backend Setup and Running

1. Install dependencies:

```bash
cd academeet-backend
mvn clean install
```

2. Configure your **MySQL database** and update `application.yml` with credentials.

3. Start the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend runs on `http://localhost:8080` by default.

---

## API Testing

You can test the backend REST APIs using **Postman**:

1. Import the Postman collection (if available) or create new requests.
2. Use the base URL: `http://localhost:8080/api/`.
3. Example endpoints:

   * `POST /auth/login` — Login user
   * `POST /auth/register` — Sign up user
   * `GET /sessions` — Fetch all sessions
   * `POST /sessions` — Create a new session
   * `GET /notes` — Fetch all notes
   * `POST /forums` — Create a new discussion
4. Include JWT token in headers for protected routes:

```
Authorization: Bearer <your-jwt-token>
```

---

## Environment Variables

### Frontend (`.env`)

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Academeet
```

### Backend (`application-dev.yml`)

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/academeet
    username: root
    password: yourpassword
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
server:
  port: 8080
jwt:
  secret: your_jwt_secret_key
  expiration: 86400000
```

---

## Team

- Zander Aligato - zander.aligato@cit.edu
- Richemmae Bigno - richemmae.bigno@cit.edu
- Mark Anton Camoro - markanton.camoro@cit.edu


