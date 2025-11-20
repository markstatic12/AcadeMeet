# Sessions Flow Architecture - Before vs After

## BEFORE (Issues)

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CreateSessionPage.jsx                                          │
│  ├─ const userId = 1 ❌ HARDCODED                              │
│  └─ POST /api/sessions/create?userId=1 ❌ WRONG USER          │
│                                                                 │
│  ProfilePage.jsx                                                │
│  ├─ const userId = 1 ❌ HARDCODED                              │
│  └─ useSessions(1) ❌ ALWAYS USER 1                            │
│                                                                 │
│  useSessions Hook                                               │
│  ├─ GET /api/sessions/user/{userId} ✅ OK                     │
│  ├─ localStorage.setItem('trashedSessions', ...) ❌             │
│  ├─ localStorage.setItem('sessions', ...) ❌                   │
│  ├─ Delete: Modify local state + localStorage ❌               │
│  └─ Restore: Calculate daysLeft, manage TTL ❌                 │
│                                                                 │
│  localStorage                                                  │
│  ├─ student: {studentId, name, email} ❌ NO ID!              │
│  ├─ sessions: [{...}, ...] ❌ NOT FOR THIS                     │
│  └─ trashedSessions: [{...deletedAt, ...}, ...] ❌              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         │
         │ Problems:
         ├─ All sessions created by "User 1"
         ├─ Session data duplicated in backend + localStorage
         ├─ Trash managed with complex TTL calculations
         ├─ No single source of truth
         └─ User can see other users' sessions
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Spring Boot)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SessionController                                              │
│  ├─ POST /api/sessions/create?userId={userId} ✅              │
│  ├─ GET /api/sessions/user/{userId} ✅                        │
│  ├─ DELETE /api/sessions/{sessionId} ❌ NOT IMPLEMENTED       │
│  └─ PATCH /api/sessions/{sessionId}/restore ❌                │
│                                                                 │
│  SessionTable                                                   │
│  └─ host_id_fk ✓ Correctly links to User                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## AFTER (Fixed)

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  LoginPage / SignupPage                                         │
│  └─ localStorage.setItem('student', {                           │
│       id: response.id,             ✅ NOW STORED               │
│       studentId,                                                │
│       name,                                                     │
│       email,                                                    │
│       program,                     ✅ NOW STORED               │
│       yearLevel                    ✅ NOW STORED               │
│     })                                                          │
│                                                                 │
│  CreateSessionPage.jsx                                          │
│  ├─ getCurrentUserId() ✅ {                                     │
│  │    const student = JSON.parse(localStorage.get('student'))  │
│  │    return student.id ✅ DYNAMIC                             │
│  │  }                                                          │
│  └─ POST /api/sessions/create?userId={currentUserId} ✅        │
│                                                                 │
│  ProfilePage.jsx                                                │
│  ├─ getCurrentUserId() ✅ {                                     │
│  │    const student = JSON.parse(localStorage.get('student'))  │
│  │    return student.id ✅ DYNAMIC                             │
│  │  }                                                          │
│  └─ useSessions(currentUserId) ✅ CORRECT USER                │
│                                                                 │
│  useSessions Hook ✅ COMPLETELY REFACTORED                    │
│  ├─ GET /api/sessions/user/{userId} ✅ From backend           │
│  ├─ DELETE /api/sessions/{sessionId} ✅ Backend API           │
│  ├─ PATCH /api/sessions/{sessionId}/restore ✅ Backend API    │
│  ├─ isLoading state ✅ NEW                                     │
│  ├─ error state ✅ NEW                                         │
│  └─ ❌ REMOVED: localStorage ops, TTL calc, pruneTrashed      │
│                                                                 │
│  TrashedSessionsContent ✅ SIMPLIFIED                          │
│  ├─ ❌ Removed: TRASH_TTL_DAYS prop                           │
│  ├─ ❌ Removed: daysLeft calculation                          │
│  └─ Calls: restoreSession(sessionId) via API                  │
│                                                                 │
│  TrashedSessionCard ✅ SIMPLIFIED                              │
│  ├─ ❌ Removed: daysLeft prop                                 │
│  └─ Badge: "Trashed" (static) instead of "X days left"        │
│                                                                 │
│  localStorage                                                  │
│  └─ student: {id, studentId, name, email, program, yearLevel} │
│       ✅ COMPLETE, NO SESSION DATA STORED HERE                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         │
         │ ✅ Proper data flow:
         ├─ User ID from authentication
         ├─ All sessions created by actual logged-in user
         ├─ Single source of truth: Backend
         ├─ Trash managed by backend
         └─ Frontend is stateless for sessions
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Spring Boot)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SessionController                                              │
│  ├─ POST /api/sessions/create?userId={userId} ✅              │
│  ├─ GET /api/sessions/user/{userId} ✅                        │
│  ├─ DELETE /api/sessions/{sessionId} ⚠️ NEEDED               │
│  └─ PATCH /api/sessions/{sessionId}/restore ⚠️ NEEDED        │
│                                                                 │
│  SessionService                                                 │
│  ├─ createSession(session) ✅                                 │
│  ├─ getSessionsByUserId(userId) ✅                            │
│  ├─ deleteSession(sessionId) ⚠️ NEEDED                        │
│  └─ restoreSession(sessionId) ⚠️ NEEDED                       │
│                                                                 │
│  SessionTable                                                   │
│  ├─ host_id_fk ✓ Links to User.user_id                        │
│  └─ Optional: Add deletedAt timestamp                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Differences

### Authentication Flow

**BEFORE:**

```
User Logs In
    ↓
Backend sends {studentId, name, email}
    ↓
Frontend stores in localStorage
    ↓
❌ No 'id' field available
    ↓
Hardcode userId = 1 for everything
```

**AFTER:**

```
User Logs In
    ↓
Backend sends {id, studentId, name, email, program, yearLevel}
    ↓
Frontend stores complete object in localStorage
    ↓
✅ 'id' field available for API calls
    ↓
Use current user's actual ID from auth object
```

### Session Data Flow

**BEFORE:**

```
Frontend State (useSessions)
    ├─ sessionsData (from API)
    ├─ trashedSessions (from localStorage) ❌
    └─ Modifications: Update both state AND localStorage ❌
         ↓
         Inconsistency between:
         ├─ What's in backend database
         ├─ What's in frontend memory
         └─ What's in browser localStorage
```

**AFTER:**

```
Backend (Source of Truth)
    ↓
Frontend State (useSessions)
    ├─ sessionsData (from API via GET)
    ├─ trashedSessions (from backend if provided)
    └─ Modifications: API calls only ✅
         ↓
         Single source of truth:
         └─ Backend database is always correct
```

### Error & Loading Management

**BEFORE:**

```
try {
  const data = await fetch(...)
  setSessionsData(data)
} catch (error) {
  console.error(error)  // Silent failure ❌
}
```

**AFTER:**

```
setIsLoading(true)
setError(null)
try {
  const data = await fetch(...)
  setSessionsData(data)
} catch (err) {
  setError(err.message)  // Proper error state ✅
  setSessionsData([])
} finally {
  setIsLoading(false)
}
```

---

## User-Visible Impact

| Scenario             | Before                       | After                        |
| -------------------- | ---------------------------- | ---------------------------- |
| **Create Session**   | Created as User 1 (wrong!)   | Created as logged-in user ✅ |
| **View My Sessions** | Shows User 1's sessions      | Shows your sessions ✅       |
| **Switch Users**     | Still shows User 1 (bug!)    | Shows different sessions ✅  |
| **Delete Session**   | Local only (not in backend)  | Backend updated ✅           |
| **Restore Session**  | Complex TTL math on frontend | Backend handles ✅           |
| **Data Consistency** | Multiple sources of truth    | Single backend source ✅     |

---

## API Call Examples

### Create Session

```
POST /api/sessions/create?userId=5
Body: {
  title: "Study Group",
  month: "December",
  day: "19",
  year: "2025",
  startTime: "14:00",
  endTime: "16:00",
  location: "Library",
  description: "Math discussion"
}

Response: {
  id: 42,
  title: "Study Group",
  hostName: "John Doe",
  ...
}
```

### Get User Sessions

```
GET /api/sessions/user/5

Response: [
  {
    id: 42,
    title: "Study Group",
    hostName: "John Doe",
    month: "December",
    day: "19",
    year: "2025",
    startTime: "14:00",
    endTime: "16:00",
    location: "Library"
  },
  ...
]
```

### Delete Session ⚠️ NEEDS IMPLEMENTATION

```
DELETE /api/sessions/42

Response: 200 OK
```

### Restore Session ⚠️ NEEDS IMPLEMENTATION

```
PATCH /api/sessions/42/restore

Response: {
  id: 42,
  title: "Study Group",
  ...
}
```
