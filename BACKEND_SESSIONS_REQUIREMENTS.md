# Backend Implementation Requirements for Sessions

## Overview

The frontend has been refactored to use backend APIs for session management. The following backend endpoints need to be implemented to complete the Sessions functionality.

## Endpoints Status

### ✅ Already Implemented

- `POST /api/sessions/create?userId={userId}`
- `GET /api/sessions/user/{userId}`
- `GET /api/sessions/all-sessions`

### ⚠️ Need to Implement

- `DELETE /api/sessions/{sessionId}` - Soft delete / Mark as trashed
- `PATCH /api/sessions/{sessionId}/restore` - Restore deleted session

---

## 1. DELETE Session Endpoint

### Specification

```java
@DeleteMapping("/{sessionId}")
public ResponseEntity<String> deleteSession(@PathVariable Long sessionId)
```

### Requirements

1. **Path Parameter**: `sessionId` (Long)
2. **Operation**: Soft-delete the session (mark as deleted, don't remove from DB)
3. **Response**:
   - Success: `200 OK` with message
   - Not Found: `404 Not Found`
   - Error: `500 Internal Server Error`

### Implementation Options

#### Option A: Add `deletedAt` timestamp

```java
@Entity
@Table(name = "sessions")
public class Session {
    // ... existing fields ...

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
```

Then implement:

```java
@DeleteMapping("/{sessionId}")
public ResponseEntity<String> deleteSession(@PathVariable Long sessionId) {
    Session session = sessionRepository.findById(sessionId)
        .orElseThrow(() -> new RuntimeException("Session not found"));

    session.setDeletedAt(LocalDateTime.now());
    sessionRepository.save(session);

    return ResponseEntity.ok("Session deleted successfully");
}
```

#### Option B: Add `deleted` boolean flag

```java
@Entity
@Table(name = "sessions")
public class Session {
    // ... existing fields ...

    @Column(name = "deleted")
    private boolean deleted = false;

    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
}
```

Then implement:

```java
@DeleteMapping("/{sessionId}")
public ResponseEntity<String> deleteSession(@PathVariable Long sessionId) {
    Session session = sessionRepository.findById(sessionId)
        .orElseThrow(() -> new RuntimeException("Session not found"));

    session.setDeleted(true);
    sessionRepository.save(session);

    return ResponseEntity.ok("Session deleted successfully");
}
```

#### Option C: Add `sessionStatus` enum

```java
public enum SessionStatus {
    ACTIVE,
    TRASHED,
    ARCHIVED
}

@Entity
@Table(name = "sessions")
public class Session {
    // ... existing fields ...

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "VARCHAR(50) DEFAULT 'ACTIVE'")
    private SessionStatus status = SessionStatus.ACTIVE;

    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }
}
```

Then implement:

```java
@DeleteMapping("/{sessionId}")
public ResponseEntity<String> deleteSession(@PathVariable Long sessionId) {
    Session session = sessionRepository.findById(sessionId)
        .orElseThrow(() -> new RuntimeException("Session not found"));

    session.setStatus(SessionStatus.TRASHED);
    sessionRepository.save(session);

    return ResponseEntity.ok("Session moved to trash");
}
```

### Recommendation

**Use Option A** (`deletedAt` timestamp) - provides most flexibility for:

- Timestamped audit trail
- Automatic cleanup queries (find sessions deleted > 14 days ago)
- Easy TTL calculation on backend

---

## 2. RESTORE Session Endpoint

### Specification

```java
@PatchMapping("/{sessionId}/restore")
public ResponseEntity<SessionDTO> restoreSession(@PathVariable Long sessionId)
```

### Requirements

1. **Path Parameter**: `sessionId` (Long)
2. **Operation**: Restore a deleted/trashed session
3. **Response**:
   - Success: `200 OK` with restored SessionDTO
   - Not Found: `404 Not Found`
   - Not Trashed: `400 Bad Request` (can't restore non-trashed session)
   - Error: `500 Internal Server Error`

### Implementation

If using `deletedAt` approach:

```java
@PatchMapping("/{sessionId}/restore")
public ResponseEntity<SessionDTO> restoreSession(@PathVariable Long sessionId) {
    Session session = sessionRepository.findById(sessionId)
        .orElseThrow(() -> new RuntimeException("Session not found"));

    if (session.getDeletedAt() == null) {
        throw new RuntimeException("Session is not in trash");
    }

    session.setDeletedAt(null);
    Session restored = sessionRepository.save(session);

    return ResponseEntity.ok(new SessionDTO(restored));
}
```

If using `deleted` flag approach:

```java
@PatchMapping("/{sessionId}/restore")
public ResponseEntity<SessionDTO> restoreSession(@PathVariable Long sessionId) {
    Session session = sessionRepository.findById(sessionId)
        .orElseThrow(() -> new RuntimeException("Session not found"));

    if (!session.isDeleted()) {
        throw new RuntimeException("Session is not in trash");
    }

    session.setDeleted(false);
    Session restored = sessionRepository.save(session);

    return ResponseEntity.ok(new SessionDTO(restored));
}
```

---

## 3. Update GET Endpoints to Handle Trashed Sessions

### Current Implementation

```java
@GetMapping("/user/{userId}")
public List<SessionDTO> getSessionsByUser(@PathVariable Long userId) {
    return sessionService.getSessionsByUserId(userId);
}
```

### Problem

This returns ALL sessions, including trashed ones. Should probably filter them out.

### Updated Implementation

```java
@GetMapping("/user/{userId}")
public List<SessionDTO> getSessionsByUser(@PathVariable Long userId) {
    return sessionService.getActiveSessionsByUserId(userId);
    // Filters out deleted/trashed sessions
}

@GetMapping("/user/{userId}/trash")
public List<SessionDTO> getTrashedSessionsByUser(@PathVariable Long userId) {
    return sessionService.getTrashedSessionsByUserId(userId);
    // Returns only trashed sessions
}
```

### Repository Changes

```java
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByHost_Id(Long userId);

    // NEW: Get only active sessions
    @Query("SELECT s FROM Session s WHERE s.host.id = :userId AND s.deletedAt IS NULL")
    List<Session> findActiveByUserId(@Param("userId") Long userId);

    // NEW: Get only trashed sessions
    @Query("SELECT s FROM Session s WHERE s.host.id = :userId AND s.deletedAt IS NOT NULL")
    List<Session> findTrashedByUserId(@Param("userId") Long userId);
}
```

### Service Layer

```java
@Service
public class SessionService {
    // ... existing methods ...

    @Transactional(readOnly = true)
    public List<SessionDTO> getActiveSessionsByUserId(Long userId) {
        return sessionRepository.findActiveByUserId(userId)
            .stream()
            .map(SessionDTO::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SessionDTO> getTrashedSessionsByUserId(Long userId) {
        return sessionRepository.findTrashedByUserId(userId)
            .stream()
            .map(SessionDTO::new)
            .collect(Collectors.toList());
    }
}
```

---

## 4. Optional: Auto-Cleanup of Old Trash

### Purpose

Automatically delete sessions from trash after 14 days

### Implementation

```java
@Component
public class TrashCleanupScheduler {

    @Autowired
    private SessionRepository sessionRepository;

    @Scheduled(cron = "0 0 2 * * *") // Run at 2 AM every day
    public void cleanupOldTrash() {
        LocalDateTime twoWeeksAgo = LocalDateTime.now().minusDays(14);

        List<Session> oldTrashed = sessionRepository.findAll()
            .stream()
            .filter(s -> s.getDeletedAt() != null && s.getDeletedAt().isBefore(twoWeeksAgo))
            .collect(Collectors.toList());

        if (!oldTrashed.isEmpty()) {
            sessionRepository.deleteAll(oldTrashed);
            System.out.println("Cleaned up " + oldTrashed.size() + " old trashed sessions");
        }
    }
}
```

### Add to pom.xml (if not already present)

```xml
<!-- Spring Boot Starter -->
<!-- Already included in spring-boot-starter-web -->
```

---

## 5. Complete Example Implementation

### SessionController.java

```java
@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:5173")
public class SessionController {
    private final SessionService sessionService;
    private final UserRepository userRepository;

    public SessionController(SessionService sessionService, UserRepository userRepository) {
        this.sessionService = sessionService;
        this.userRepository = userRepository;
    }

    @PostMapping("/create")
    public SessionDTO createSession(@RequestBody Session session, @RequestParam Long userId) {
        User host = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        session.setHost(host);
        Session savedSession = sessionService.createSession(session);
        return new SessionDTO(savedSession);
    }

    @GetMapping("/user/{userId}")
    public List<SessionDTO> getSessionsByUser(@PathVariable Long userId) {
        return sessionService.getActiveSessionsByUserId(userId);
    }

    @GetMapping("/user/{userId}/trash")
    public List<SessionDTO> getTrashedSessionsByUser(@PathVariable Long userId) {
        return sessionService.getTrashedSessionsByUserId(userId);
    }

    @GetMapping("/all-sessions")
    public List<SessionDTO> getAllSessions() {
        return sessionService.getAllSessions();
    }

    // NEW: Delete endpoint
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<String> deleteSession(@PathVariable Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setDeletedAt(LocalDateTime.now());
        sessionRepository.save(session);

        return ResponseEntity.ok("Session deleted successfully");
    }

    // NEW: Restore endpoint
    @PatchMapping("/{sessionId}/restore")
    public ResponseEntity<SessionDTO> restoreSession(@PathVariable Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.getDeletedAt() == null) {
            throw new RuntimeException("Session is not in trash");
        }

        session.setDeletedAt(null);
        Session restored = sessionRepository.save(session);

        return ResponseEntity.ok(new SessionDTO(restored));
    }
}
```

---

## 6. Database Migration (if using Liquibase/Flyway)

### SQL for adding `deletedAt` column

```sql
ALTER TABLE sessions ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;

CREATE INDEX idx_sessions_deleted_at ON sessions(deleted_at);
```

---

## Frontend API Calls

Once these endpoints are implemented, the frontend will:

### Delete a session:

```javascript
const response = await fetch(
  `http://localhost:8080/api/sessions/${sessionId}`,
  {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  }
);
```

### Restore a session:

```javascript
const response = await fetch(
  `http://localhost:8080/api/sessions/${sessionId}/restore`,
  {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  }
);
const restored = await response.json();
```

---

## Testing Checklist

- [ ] DELETE endpoint returns 200 for valid sessionId
- [ ] DELETE endpoint returns 404 for invalid sessionId
- [ ] Deleted session appears in trash (deletedAt is set)
- [ ] Deleted session no longer appears in active sessions
- [ ] PATCH restore returns 200 for valid trashed sessionId
- [ ] Restored session no longer in trash
- [ ] Restored session appears in active sessions again
- [ ] Cannot restore a session that's not trashed
- [ ] Auto-cleanup removes sessions after 14 days
- [ ] Frontend delete/restore operations work end-to-end

---

## Priority

**HIGH** - These endpoints are needed for the Sessions feature to work completely:

1. DELETE endpoint - Users can delete sessions
2. PATCH restore endpoint - Users can restore sessions
3. Query filtering - Separate active from trashed sessions
4. Auto-cleanup (Optional) - Clean database over time
