# 🔐 Authentication Setup - Complete!

## ✅ What Has Been Implemented

### Backend (Spring Boot + MySQL)
1. **User Entity** - Stores user information in MySQL
2. **Authentication Service** - Handles signup and login with password encryption (BCrypt)
3. **REST API Endpoints**:
   - `POST /api/auth/signup` - Register new users
   - `POST /api/auth/login` - Login existing users
4. **Database Table**: `users` table automatically created with fields:
   - `id` (auto-increment)
   - `name`
   - `email` (unique)
   - `password` (encrypted)
   - `created_at`, `updated_at`

### Frontend (React)
1. **API Service** - Handles HTTP requests to backend
2. **Updated LoginPage** - Connects to login endpoint
3. **Updated SignupPage** - Connects to signup endpoint
4. **Features**:
   - Form validation
   - Error handling
   - Loading states
   - Success messages
   - User data stored in localStorage

---

## 🚀 How to Test

### 1. Make sure both servers are running:

**Backend (Terminal 1):**
```bash
cd c:\VSC\AcadeMeet\backend
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
```
✅ Should be running on: http://localhost:8080

**Frontend (Terminal 2):**
```bash
cd c:\VSC\AcadeMeet\frontend
npm run dev
```
✅ Should be running on: http://localhost:5173

---

### 2. Test Signup:

1. Go to http://localhost:5173/signup
2. Fill in the form:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Sign up"
4. You should see: "Signup successful! Please login."
5. You'll be redirected to the login page

---

### 3. Test Login:

1. Go to http://localhost:5173/login (or you'll be redirected there)
2. Enter your credentials:
   - Email: `john@example.com`
   - Password: `password123`
3. Click "Log in"
4. You should see: "Welcome back, John Doe!"

---

### 4. Verify in Database:

Open MySQL Workbench and run:
```sql
USE academeet_db;
SELECT * FROM users;
```

You should see your registered user with an encrypted password!

---

## 📋 API Endpoints Reference

### Signup
```
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Signup successful"
}
```

**Error Response (400):**
```json
{
  "userId": null,
  "name": null,
  "email": null,
  "message": "Email already exists"
}
```

---

### Login
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Login successful"
}
```

**Error Response (400):**
```json
{
  "userId": null,
  "name": null,
  "email": null,
  "message": "Invalid email or password"
}
```

---

## 🔒 Security Features

1. **Password Encryption**: BCrypt hashing (cannot be reversed)
2. **Unique Email**: Database constraint prevents duplicate emails
3. **Validation**:
   - Email format validation
   - Password minimum 6 characters
   - Required fields checking
4. **CORS**: Configured to allow frontend (localhost:5173)

---

## 📁 Files Created

### Backend:
- `model/User.java` - User entity
- `repository/UserRepository.java` - Database operations
- `dto/SignupRequest.java` - Signup request DTO
- `dto/LoginRequest.java` - Login request DTO
- `dto/AuthResponse.java` - Response DTO
- `service/AuthService.java` - Business logic
- `controller/AuthController.java` - REST endpoints
- `config/SecurityConfig.java` - Security configuration

### Frontend:
- `services/authService.js` - API calls
- Updated: `pages/LoginPage.jsx`
- Updated: `pages/SignupPage.jsx`

---

## 🎯 Next Steps

1. **Create Dashboard Page** - Where users go after login
2. **Protected Routes** - Require login to access certain pages
3. **Logout Functionality** - Clear user session
4. **User Profile Page** - View/edit user information
5. **Remember Me** - Keep users logged in
6. **Password Reset** - Forgot password feature
7. **JWT Tokens** - For more secure authentication

---

## 🐛 Troubleshooting

### Backend won't start:
- Check if MySQL is running
- Verify database credentials in `application-local.properties`
- Check if port 8080 is available

### Frontend can't connect:
- Verify backend is running on port 8080
- Check browser console for errors
- Ensure CORS is configured correctly

### Login/Signup fails:
- Check backend terminal for error logs
- Verify database connection
- Check if user already exists (for signup)

---

## 📞 Need Help?

Check the backend logs in the terminal for detailed error messages!
