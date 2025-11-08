# Academeet

Academeet is a collaborative academic platform designed to help students share notes, join study sessions, participate in forum discussions, and follow trending content. It is built with a **React + Vite frontend** and a **Spring Boot backend** with MySQL database support.

---

## Table of Contents

- [Project Structure](#project-structure)  
  - [Frontend](#frontend)  
  - [Backend](#backend)  
- [Features](#features)  
- [Environment Setup](#environment-setup)  
- [Database Setup (MySQL)](#database-setup-mysql)  
- [Running the Application](#running-the-application)  
- [API Testing](#api-testing)  
- [Team](#team)  

---

## Project Structure

### Frontend (React + Vite)

```

academeet-frontend/
│
├── src/
│   ├── main.tsx                 # Vite entry point
│   ├── App.tsx                  # Main app component with routing
│   ├── index.css                # Global styles
│   │
│   ├── pages/                   # Page components
│   │   ├── Landing.tsx
│   │   ├── Dashboard.tsx
│   │   ├── auth/                # Login and Signup
│   │   ├── sessions/            # Session listing, creation, detail
│   │   ├── notes/               # Notes library, creation, detail
│   │   ├── forums/              # Forum listing, creation, discussion detail
│   │   ├── search/              # Universal search
│   │   ├── discover/            # Discover/trending content
│   │   ├── calendar/            # Calendar view
│   │   ├── following/           # Follow/community page
│   │   ├── profile/             # User profile
│   │   └── admin/               # Admin dashboard & moderation
│   │
│   ├── components/              # Reusable UI and app components
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API services
│   ├── store/                   # State management
│   ├── lib/                     # Utilities and constants
│   ├── types/                   # TypeScript type definitions
│   ├── styles/                  # Additional CSS files
│   └── assets/                  # Images, icons, fonts
│
├── public/                      # Public static assets
├── .env                         # Environment variables
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS
└── package.json                 # NPM dependencies

```

### Backend (Spring Boot + MySQL)

```

academeet-backend/
│
├── src/main/java/com/academeet/
│   ├── AcademeetApplication.java        # Main Spring Boot entry point
│   ├── controller/                      # REST API endpoints
│   ├── service/                         # Business logic
│   ├── repository/                      # Database access (JPA)
│   ├── entity/                          # JPA Entity models
│   ├── dto/                             # Data Transfer Objects
│   ├── security/                        # JWT and authentication
│   ├── config/                          # Spring configurations
│   ├── exception/                       # Custom exceptions
│   ├── validation/                      # Validators
│   ├── util/                            # Utility classes
│   └── interceptor/                      # Request/response interceptors
│
├── src/main/resources/
│   ├── application.yml                  # Main configuration
│   ├── application-dev.yml              # Development profile
│   ├── application-prod.yml             # Production profile
│   └── messages.properties              # Internationalization
│
├── src/test/java/com/academeet/         # Unit and integration tests
├── pom.xml                               # Maven dependencies
└── README.md                             # Backend documentation

````

---

## Features

- **Authentication & Authorization**: Login, Signup, JWT authentication  
- **Session Management**: Create, browse, join sessions  
- **Notes Library**: Upload, view, and manage notes  
- **Forums**: Post discussions, reply, and interact  
- **Search**: Search across sessions, notes, and users  
- **Discovery**: Trending sessions and featured users  
- **User Profile**: View and manage user info, follow other users  
- **Admin Panel**: User management and content moderation  

---

## Environment Setup

1. **Clone the repository**

```bash
git clone https://github.com/markstatic12/academeet.git
cd academeet
````

2. **Frontend Setup (React + Vite)**

```bash
cd academeet-frontend
npm install
cp .env.example .env
npm run dev
```

3. **Backend Setup (Spring Boot)**

```bash
cd academeet-backend
mvn clean install
cp src/main/resources/application-dev.yml src/main/resources/application.yml
mvn spring-boot:run
```

---

## Database Setup (MySQL)

1. Open **MySQL Workbench** and connect to your local MySQL server.
2. Create the database:

```sql
CREATE DATABASE academeet_db;
```

3. Update `application-dev.yml` (or `.env` for frontend) with your MySQL credentials:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/academeet_db
    username: root
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
```

4. Start the backend application to auto-generate tables.

---

## Running the Application

* Frontend: `npm run dev` (default: `http://localhost:5173`)
* Backend: `mvn spring-boot:run` (default: `http://localhost:8080`)

The frontend communicates with the backend via REST API endpoints.

---

## API Testing

* Use **Postman** to test API endpoints.
* Import the Postman collection: `academeet-backend/postman_collection.json` (if available).
* Example endpoints:

  * `POST /api/auth/login` – Authenticate user
  * `POST /api/auth/signup` – Register user
  * `GET /api/sessions` – List all sessions
  * `POST /api/notes` – Create a note
  * `GET /api/forums` – Retrieve forum discussions

---

## Team

- Zander Aligato - zander.aligato@cit.edu
- Richemmae Bigno - richemmae.bigno@cit.edu
- Mark Anton Camoro - markanton.camoro@cit.edu