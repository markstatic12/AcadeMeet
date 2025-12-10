# Layer Responsibility Quick Reference

## Controller Layer

### ✅ SHOULD

- Handle HTTP requests and responses
- Use `@GetMapping`, `@PostMapping`, etc.
- Bind request data (`@RequestBody`, `@PathVariable`, `@RequestParam`)
- Trigger validation with `@Valid`
- Call **exactly ONE** service method per endpoint
- Return `ResponseEntity<SpecificType>`
- Get authenticated user via `getAuthenticatedUser()`
- Be **20-30 lines max** per endpoint

### ❌ SHOULD NOT

- Have try-catch blocks (use global exception handler)
- Create entities (`new Session()`)
- Parse dates or times
- Make authorization decisions
- Call repositories directly
- Have business logic
- Build `Map<String, Object>` responses manually
- Have nested if-else logic
- Import `LocalDateTime`, `Duration`, etc.
- Import entity classes except for return types

### Example

```java
// ✅ GOOD
@PostMapping
public ResponseEntity<SessionDTO> createSession(@Valid @RequestBody CreateSessionRequest request) {
    User host = getAuthenticatedUser();
    Session session = sessionMapper.toEntity(request);
    Session saved = sessionService.createSession(session, host.getId());
    return ResponseEntity.status(HttpStatus.CREATED).body(new SessionDTO(saved));
}

// ❌ BAD
@PostMapping
public ResponseEntity<?> createSession(@Valid @RequestBody CreateSessionRequest request) {
    try {
        User host = getAuthenticatedUser();
        Session session = request.toEntity(); // DTO doing conversion

        // Business validation in controller
        if (session.getStartTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Start time must be in future"));
        }

        Session saved = sessionService.createSession(session, host.getId());
        return ResponseEntity.ok(new SessionDTO(saved));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
```

---

## DTO Layer (Request/Response Objects)

### ✅ SHOULD

- Define data structure
- Have validation annotations (`@NotBlank`, `@Size`, `@Email`, `@Min`, `@Max`)
- Have getters and setters
- Trim strings in setters (e.g., `this.title = title == null ? null : title.trim()`)
- Be simple POJOs

### ❌ SHOULD NOT

- Import entity classes (`Session`, `User`, etc.)
- Import `LocalDateTime`, `Month`, `Duration`
- Have `toEntity()` methods
- Have business validation logic
- Parse dates or times
- Check if values are "in the future" or "after each other"
- Call services or repositories
- Have methods other than getters/setters

### Example

```java
// ✅ GOOD
public class CreateSessionRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100)
    private String title;

    @NotBlank(message = "Month is required")
    private String month;

    @NotBlank(message = "Start time is required")
    private String startTime;

    // Only getters/setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title == null ? null : title.trim(); }
}

// ❌ BAD
public class CreateSessionRequest {
    private String title;
    private String month;
    private String startTime;

    // Business logic in DTO
    public Session toEntity() {
        Session s = new Session();
        LocalDateTime start = parseDateTime(this.startTime);

        // Business validation
        if (start.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Start time must be in future");
        }

        s.setStartTime(start);
        return s;
    }
}
```

---

## Service Layer

### ✅ SHOULD

- Contain ALL business logic
- Make authorization decisions ("Is user the owner?")
- Parse dates and times
- Validate business rules
- Call repositories
- Use `@Transactional`
- Delegate DTO→Entity conversion to mappers
- Throw domain exceptions (`IllegalArgumentException`, `SecurityException`)
- Tell a clear "business story"

### ❌ SHOULD NOT

- Have HTTP annotations (`@GetMapping`, etc.)
- Return `ResponseEntity`
- Have JSON annotations
- Access `@RequestBody`, `@PathVariable`
- Build HTTP responses

### Example

```java
// ✅ GOOD
@Service
public class SessionService {

    private void validateSessionData(Session session) {
        if (session.getStartTime() != null && session.getStartTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Session start time must be in the future");
        }

        if (session.getStartTime() != null && session.getEndTime() != null) {
            if (session.getEndTime().isBefore(session.getStartTime())) {
                throw new IllegalArgumentException("End time must be after start time");
            }

            long durationMinutes = Duration.between(session.getStartTime(), session.getEndTime()).toMinutes();
            if (durationMinutes < 15) {
                throw new IllegalArgumentException("Session must be at least 15 minutes long");
            }
        }
    }

    @Transactional
    public Session createSession(Session session, Long hostId) {
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new RuntimeException("Host not found"));

        validateSessionData(session);

        session.setHost(host);
        return sessionRepository.save(session);
    }
}

// ❌ BAD
@Service
public class SessionService {
    @Transactional
    public ResponseEntity<?> createSession(CreateSessionRequest request) { // Returns HTTP response
        try {
            Session session = request.toEntity(); // DTO doing conversion
            return ResponseEntity.ok(sessionRepository.save(session));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
```

---

## Mapper Layer

### ✅ SHOULD

- Convert DTOs to Entities
- Convert Entities to Response DTOs
- Parse dates/times (data conversion)
- Be annotated with `@Service`
- Have clear naming (`toEntity()`, `toDTO()`, `toResponse()`)

### ❌ SHOULD NOT

- Perform business validation ("is this in the future?")
- Call repositories
- Make authorization decisions
- Save or persist data
- Have business rules

### Example

```java
// ✅ GOOD
@Service
public class SessionMapper {
    public Session toEntity(CreateSessionRequest request) {
        Session session = new Session();
        session.setTitle(request.getTitle());

        // Convert date/time (data conversion, not validation)
        LocalDateTime start = parseDateTime(request.getMonth(), request.getDay(),
                                           request.getYear(), request.getStartTime());
        session.setStartTime(start);

        return session;
    }

    private LocalDateTime parseDateTime(String month, String day, String year, String time) {
        // Parsing logic - throws IllegalArgumentException if invalid format
    }
}

// ❌ BAD
@Service
public class SessionMapper {
    public Session toEntity(CreateSessionRequest request) {
        Session session = new Session();
        LocalDateTime start = parseDateTime(request.getStartTime());

        // Business validation in mapper
        if (start.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Start time must be in future");
        }

        session.setStartTime(start);
        return session;
    }
}
```

---

## Repository Layer

### ✅ SHOULD

- Extend `JpaRepository<Entity, ID>`
- Define query methods
- Use `@Query` for custom queries
- Return entities or lists

### ❌ SHOULD NOT

- Have business logic
- Reference DTOs
- Have HTTP logic
- Create entities

### Example

```java
// ✅ GOOD
@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByHost_Id(Long userId);

    @Query("SELECT s FROM Session s WHERE s.sessionStatus = :status")
    List<Session> findByStatus(@Param("status") SessionStatus status);
}

// ❌ BAD
@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    default Session createSessionWithValidation(CreateSessionRequest request) {
        Session session = request.toEntity();
        if (session.getStartTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Invalid start time");
        }
        return save(session);
    }
}
```

---

## Quick Decision Tree

### "Where does this code belong?"

**Is it about HTTP (requests/responses)?** → Controller

**Is it validating structure (not blank, size, format)?** → DTO

**Is it a business rule (affects what should happen)?** → Service

**Is it converting DTO ↔ Entity?** → Mapper

**Is it database access?** → Repository

**Is it file I/O?** → File Service

---

## Common Mistakes to Avoid

### 1. Business Logic in DTOs

```java
// ❌ BAD - DTO has business logic
public class CreateSessionRequest {
    public Session toEntity() {
        if (startTime.isBefore(LocalDateTime.now())) { // Business rule
            throw new IllegalArgumentException("...");
        }
    }
}
```

### 2. Try-Catch in Controllers

```java
// ❌ BAD - Controller handles exceptions
@PostMapping
public ResponseEntity<?> create(@RequestBody MyRequest request) {
    try {
        return ResponseEntity.ok(service.create(request));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
```

### 3. Entity Creation in Controllers

```java
// ❌ BAD - Controller creates entities
@PostMapping
public ResponseEntity<?> create(@RequestBody MyRequest request) {
    Session session = new Session();
    session.setTitle(request.getTitle());
    session.setStartTime(LocalDateTime.parse(request.getStartTime()));
    return ResponseEntity.ok(service.save(session));
}
```

### 4. HTTP Logic in Services

```java
// ❌ BAD - Service returns HTTP response
@Service
public class MyService {
    public ResponseEntity<?> create(MyRequest request) {
        try {
            return ResponseEntity.ok(repository.save(entity));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(...);
        }
    }
}
```

### 5. Manual Map Building in Controllers

```java
// ❌ BAD - Manual Map responses
@GetMapping("/me")
public ResponseEntity<?> getCurrentUser() {
    User user = getAuthenticatedUser();
    Map<String, Object> response = new HashMap<>();
    response.put("id", user.getId());
    response.put("name", user.getName());
    // ... 10 more lines
    return ResponseEntity.ok(response);
}

// ✅ GOOD - Use proper DTO
@GetMapping("/me")
public ResponseEntity<UserProfileResponse> getCurrentUser() {
    User user = getAuthenticatedUser();
    UserProfileResponse response = userMapper.toProfileResponse(user);
    return ResponseEntity.ok(response);
}
```

---

## Remember

**If you can't explain a class's responsibility in ONE sentence, it's doing too much.**

- Controller: "Handles HTTP for sessions"
- DTO: "Defines session creation data contract"
- Service: "Implements session business logic"
- Mapper: "Converts session DTOs to entities"
- Repository: "Accesses session database"
