# Reminders System Guide

## Overview

The AcadeMeet application implements an **auto-generated reminder system** for study sessions. Reminders are automatically created when users create or join sessions, providing timely notifications before the session starts. This design ensures users never miss important study sessions through fixed-format, role-aware reminder messages.

---

## Architecture

### Key Design Principles

1. **Auto-Generation**: Reminders created automatically on session creation/join
2. **Fixed Message Templates**: Consistent, role-aware messages (Owner vs Participant)
3. **Two Reminder Types**: Day-before and one-hour-before notifications
4. **Smart Sorting**: Unread reminders first, then sorted by scheduled time descending
5. **Click-to-Read**: Reminders marked as read on click, with visual opacity change
6. **Auto-Cleanup**: Reminders deleted when user cancels participation
7. **JWT Authentication**: All endpoints use Spring Security JWT authentication

---

## Database Schema

### Reminder Entity

```java
@Entity
@Table(name = "reminders", indexes = {
    @Index(name = "idx_reminder_user_scheduled", columnList = "user_id, scheduled_time"),
    @Index(name = "idx_reminder_user_read", columnList = "user_id, is_read")
})
public class Reminder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reminder_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Enumerated(EnumType.STRING)
    @Column(name = "reminder_type", nullable = false, length = 20)
    private ReminderType type;

    @Column(name = "scheduled_time", nullable = false)
    private LocalDateTime scheduledTime;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public void markAsRead() {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
    }
}
```

### ReminderType Enum

```java
public enum ReminderType {
    DAY_BEFORE,      // 24 hours before session
    ONE_HOUR_BEFORE  // 1 hour before session
}
```

**Key Fields:**

- `user`: The user who will receive the reminder
- `session`: The session this reminder is for
- `type`: Either DAY_BEFORE or ONE_HOUR_BEFORE
- `scheduledTime`: When the reminder should be shown (calculated based on session start time)
- `isRead`: Boolean flag to track if user has acknowledged the reminder
- `readAt`: Timestamp when reminder was marked as read
- **Indexes**: Optimized for querying by user + scheduled time and user + read status

---

## Backend Implementation

### 1. Repository Layer

#### ReminderRepository.java

```java
@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    /**
     * Get active reminders for user (scheduled time has passed, session is active)
     * Sorted by scheduled time descending (most recent first)
     * Note: Filtering for single reminder per session and sorting by read status
     * is done in service layer due to MySQL LIMIT in subquery limitations
     */
    @Query("SELECT r FROM Reminder r " +
           "WHERE r.user.id = :userId " +
           "AND r.scheduledTime <= :currentTime " +
           "AND r.session.sessionStatus = 'ACTIVE' " +
           "ORDER BY r.scheduledTime DESC")
    List<Reminder> findActiveRemindersByUserId(
        @Param("userId") Long userId,
        @Param("currentTime") LocalDateTime currentTime
    );

    /**
     * Delete all reminders for a user-session pair
     * (used when user cancels participation)
     */
    @Modifying
    @Query("DELETE FROM Reminder r WHERE r.user.id = :userId AND r.session.id = :sessionId")
    void deleteByUserIdAndSessionId(
        @Param("userId") Long userId,
        @Param("sessionId") Long sessionId
    );

    /**
     * Get unread reminder count for user
     */
    @Query("SELECT COUNT(r) FROM Reminder r " +
           "WHERE r.user.id = :userId " +
           "AND r.scheduledTime <= :currentTime " +
           "AND r.isRead = false " +
           "AND r.session.sessionStatus = 'ACTIVE'")
    Long countUnreadReminders(
        @Param("userId") Long userId,
        @Param("currentTime") LocalDateTime currentTime
    );

    /**
     * Check if reminders already exist for user-session pair
     */
    boolean existsByUserIdAndSessionId(Long userId, Long sessionId);
}
```

**Key Query Features:**

- **Smart Sorting**: `ORDER BY r.isRead ASC, r.scheduledTime DESC` ensures unread reminders appear first
- **Active Filter**: Only shows reminders for active sessions
- **Performance**: Custom indexes on `(user_id, scheduled_time)` and `(user_id, is_read)` for fast queries

---

### 2. Service Layer

#### ReminderService.java

```java
@Service
public class ReminderService {

    private final ReminderRepository reminderRepository;
    // Required imports: java.util.HashMap, java.util.Map

    /**
     * Creates reminders for a user-session pair
     * Auto-called when user creates or joins a session
     */
    @Transactional
    public void createRemindersForSession(User user, Session session) {
        // Prevent duplicate reminders
        if (reminderRepository.existsByUserIdAndSessionId(user.getId(), session.getId())) {
            return;
        }

        LocalDateTime sessionStart = session.getStartTime();
        LocalDateTime now = LocalDateTime.now();
        boolean isOwner = session.getHost().getId().equals(user.getId());

        // Create DAY_BEFORE reminder (24 hours before session)
        LocalDateTime dayBeforeTime = sessionStart.minusDays(1);
        if (dayBeforeTime.isAfter(now)) {
            Reminder dayBeforeReminder = new Reminder();
            dayBeforeReminder.setUser(user);
            dayBeforeReminder.setSession(session);
            dayBeforeReminder.setType(ReminderType.DAY_BEFORE);
            dayBeforeReminder.setScheduledTime(dayBeforeTime);
            reminderRepository.save(dayBeforeReminder);
        }

        // Create ONE_HOUR_BEFORE reminder (1 hour before session)
        LocalDateTime oneHourBeforeTime = sessionStart.minusHours(1);
        if (oneHourBeforeTime.isAfter(now)) {
            Reminder oneHourReminder = new Reminder();
            oneHourReminder.setUser(user);
            oneHourReminder.setSession(session);
            oneHourReminder.setType(ReminderType.ONE_HOUR_BEFORE);
            oneHourReminder.setScheduledTime(oneHourBeforeTime);
            reminderRepository.save(oneHourReminder);
        }
    }

    /**
     * Get active reminders for user with generated messages
     * Implements single-reminder-per-session logic:
     * - Only shows the most recent reminder (by scheduledTime) for each session
     * - Prevents duplicate 24H and 1H reminders from showing simultaneously
     */
    @Transactional(readOnly = true)
    public List<ReminderDTO> getActiveReminders(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        List<Reminder> allReminders = reminderRepository.findActiveRemindersByUserId(userId, now);

        // Keep only ONE reminder per session (most recent due to DESC sort)
        Map<Long, Reminder> latestReminderPerSession = new HashMap<>();
        for (Reminder reminder : allReminders) {
            Long sessionId = reminder.getSession().getId();
            // Since results are ordered by scheduledTime DESC, first occurrence = most recent
            if (!latestReminderPerSession.containsKey(sessionId)) {
                latestReminderPerSession.put(sessionId, reminder);
            }
        }

        return latestReminderPerSession.values().stream()
            .sorted((a, b) -> {
                // Sort: unread first, then by scheduledTime DESC
                int readCompare = Boolean.compare(a.isRead(), b.isRead());
                if (readCompare != 0) return readCompare;
                return b.getScheduledTime().compareTo(a.getScheduledTime());
            })
            .map(reminder -> {
                Session session = reminder.getSession();
                boolean isOwner = session.getHost().getId().equals(userId);
                String message = generateMessage(reminder.getType(), session, isOwner);

                return new ReminderDTO(
                    reminder.getId(),
                    session.getId(),
                    session.getTitle(),
                    message,
                    reminder.getType(),
                    reminder.getScheduledTime(),
                    reminder.isRead(),
                    reminder.getReadAt(),
                    isOwner
                );
            })
            .collect(Collectors.toList());
    }

    /**
     * Mark reminder as read (toggle)
     */
    @Transactional
    public void markAsRead(Long reminderId, Long userId) {
        Reminder reminder = reminderRepository.findById(reminderId)
            .orElseThrow(() -> new RuntimeException("Reminder not found"));

        // Verify ownership
        if (!reminder.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        reminder.markAsRead();
        reminderRepository.save(reminder);
    }

    /**
     * Delete reminders when user cancels participation
     */
    @Transactional
    public void deleteRemindersForUserSession(Long userId, Long sessionId) {
        reminderRepository.deleteByUserIdAndSessionId(userId, sessionId);
    }

    /**
     * Generate role-aware reminder message
     * Uses time-aware templates to avoid misleading "tomorrow" or "in 1 hour" text
     * Shows actual session time for accuracy
     */
    private String generateMessage(ReminderType type, Session session, boolean isOwner) {
        String title = session.getTitle();
        LocalDateTime startTime = session.getStartTime();
        String time = startTime.format(DateTimeFormatter.ofPattern("h:mm a"));

        switch (type) {
            case DAY_BEFORE:
                return isOwner
                    ? String.format("⏰ Your session '%s' is scheduled for tomorrow at %s.", title, time)
                    : String.format("⏰ Upcoming session: '%s' tomorrow at %s.", title, time);

            case ONE_HOUR_BEFORE:
                return isOwner
                    ? String.format("⏰ Your session '%s' is coming up today at %s.", title, time)
                    : String.format("⏰ '%s' is coming up today at %s.", title, time);

            default:
                return "⏰ You have an upcoming session.";
        }
    }

    /**
     * Get unread reminder count (for badge display)
     */
    @Transactional(readOnly = true)
    public Long getUnreadCount(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        return reminderRepository.countUnreadReminders(userId, now);
    }
}
```

**Auto-Creation Logic:**

- Called automatically by `SessionService` when:
  1. User creates a session (as owner)
  2. User joins a session (as participant)
- Checks if session start time allows for reminder creation
- Creates up to 2 reminders per user-session pair

**Message Templates:**

- **Owner DAY_BEFORE**: "⏰ Your session 'Title' is scheduled for tomorrow at 3:00 PM."
- **Participant DAY_BEFORE**: "⏰ Upcoming session: 'Title' tomorrow at 3:00 PM."
- **Owner ONE_HOUR**: "⏰ Your session 'Title' is coming up today at 3:00 PM."
- **Participant ONE_HOUR**: "⏰ 'Title' is coming up today at 3:00 PM."

**Important:** Messages show actual session time instead of relative terms like "in 1 hour" to avoid misleading text when reminders are created close to session start time.

---

### 3. DTO Layer

#### ReminderDTO.java

```java
public class ReminderDTO {
    private Long id;
    private Long sessionId;
    private String sessionTitle;
    private String message;
    private ReminderType type;
    private LocalDateTime scheduledTime;
    private Boolean read;
    private LocalDateTime readAt;
    private Boolean isOwner;

    // Constructor
    public ReminderDTO(Long id, Long sessionId, String sessionTitle, String message,
                      ReminderType type, LocalDateTime scheduledTime, Boolean read,
                      LocalDateTime readAt, Boolean isOwner) {
        this.id = id;
        this.sessionId = sessionId;
        this.sessionTitle = sessionTitle;
        this.message = message;
        this.type = type;
        this.scheduledTime = scheduledTime;
        this.read = read;
        this.readAt = readAt;
        this.isOwner = isOwner;
    }

    // Getters and Setters
    // Note: Boolean getter uses isRead() instead of getRead() (Java convention)
    public Boolean isRead() {
        return read;
    }
    // ... (other standard getters/setters)
}
```

---

### 4. Controller Layer

#### ReminderController.java

```java
@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ReminderController {

    private final ReminderService reminderService;
    private final UserRepository userRepository;

    /**
     * Get all active reminders for current user
     * Returns sorted list: unread first, then by scheduled time descending
     */
    @GetMapping("/active")
    public ResponseEntity<?> getActiveReminders() {
        try {
            User user = getAuthenticatedUser();
            List<ReminderDTO> reminders = reminderService.getActiveReminders(user.getId());
            return ResponseEntity.ok(reminders);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Mark reminder as read
     * Triggered when user clicks on a reminder
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            User user = getAuthenticatedUser();
            reminderService.markAsRead(id, user.getId());
            return ResponseEntity.ok(Map.of("message", "Reminder marked as read"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get unread reminder count
     * Used for badge display in UI
     */
    @GetMapping("/unread/count")
    public ResponseEntity<?> getUnreadCount() {
        try {
            User user = getAuthenticatedUser();
            Long count = reminderService.getUnreadCount(user.getId());
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Extract authenticated user from JWT token
     */
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();

        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
```

**API Endpoints:**

- `GET /api/reminders/active` - Get sorted reminders for current user
- `PATCH /api/reminders/{id}/read` - Mark reminder as read
- `GET /api/reminders/unread/count` - Get unread count for badge

---

### 5. Integration with SessionService

#### SessionService.java (Modified)

```java
@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final ReminderService reminderService;  // ← Injected
    // ... other dependencies

    public SessionService(SessionRepository sessionRepository,
                         UserRepository userRepository,
                         ReminderService reminderService,  // ← Added
                         // ... other dependencies
                         ) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.reminderService = reminderService;
        // ... other assignments
    }

    /**
     * Create session - Auto-creates reminders for host
     */
    @Transactional
    public Session createSession(SessionRequest request, Long userId) {
        User host = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Session session = new Session();
        // ... set session properties

        Session saved = sessionRepository.save(session);

        // ← AUTO-CREATE REMINDERS FOR OWNER
        reminderService.createRemindersForSession(host, saved);

        return saved;
    }

    /**
     * Join session - Auto-creates reminders for participant
     */
    @Transactional
    public void joinSession(Long sessionId, String password, Long userId) {
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate password, check capacity, etc.
        // ...

        // Create participant record
        SessionParticipant participant = new SessionParticipant(user, session);
        sessionParticipantRepository.save(participant);

        // ← AUTO-CREATE REMINDERS FOR PARTICIPANT
        reminderService.createRemindersForSession(user, session);
    }

    /**
     * Cancel participation - Auto-deletes reminders
     */
    @Transactional
    public void cancelJoinSession(Long sessionId, Long userId) {
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete participant record
        sessionParticipantRepository.deleteByUserIdAndSessionId(userId, sessionId);

        // ← AUTO-DELETE REMINDERS
        reminderService.deleteRemindersForUserSession(userId, sessionId);
    }
}
```

**Integration Points:**

1. **Session Creation**: Reminders auto-created for session owner
2. **Session Join**: Reminders auto-created for new participant
3. **Cancel Participation**: Reminders auto-deleted when user leaves

---

## Frontend Implementation

### 1. Reminder Service (API Client)

#### ReminderService.js

```javascript
import { authFetch } from "./apiHelper";

const handleResponse = async (response, errorMessage = "Request failed") => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response:", response.status, errorText);
    throw new Error(`${errorMessage} (${response.status})`);
  }
  return await response.json();
};

export const reminderService = {
  /**
   * Get all active reminders for current user
   */
  async getActiveReminders() {
    const response = await authFetch("/reminders/active", {
      method: "GET",
    });
    return handleResponse(response, "Failed to fetch reminders");
  },

  /**
   * Mark reminder as read
   */
  async markAsRead(reminderId) {
    const response = await authFetch(`/reminders/${reminderId}/read`, {
      method: "PATCH",
      body: JSON.stringify({}),
    });
    return handleResponse(response, "Failed to mark reminder as read");
  },

  /**
   * Get unread reminder count
   */
  async getUnreadCount() {
    const response = await authFetch("/reminders/unread/count", {
      method: "GET",
    });
    return handleResponse(response, "Failed to fetch unread count");
  },
};
```

---

### 2. RemindersTab Component

#### SessionActivity.jsx (RemindersTab)

```javascript
// Reminders Tab Component
const RemindersTab = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadReminders();
    // Poll every 60 seconds for new reminders
    const interval = setInterval(loadReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadReminders = async () => {
    try {
      const data = await reminderService.getActiveReminders();
      setReminders(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load reminders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReminderClick = async (reminder) => {
    try {
      // Mark as read
      await reminderService.markAsRead(reminder.id);

      // Update local state to show as read
      setReminders(
        reminders.map((r) =>
          r.id === reminder.id
            ? { ...r, read: true, readAt: new Date().toISOString() }
            : r
        )
      );

      // Navigate to session
      navigate(`/session/${reminder.sessionId}`);
    } catch (err) {
      console.error("Failed to mark reminder as read:", err);
    }
  };

  const formatScheduledTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="flex-1 relative overflow-hidden animate-fadeSlideUp">
        <div className="relative z-10 h-full flex flex-col">
          <h3 className="text-xl font-bold text-white mb-4">Reminders</h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-400">Loading reminders...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 relative overflow-hidden animate-fadeSlideUp">
        <div className="relative z-10 h-full flex flex-col">
          <h3 className="text-xl font-bold text-white mb-4">Reminders</h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-red-400">Failed to load reminders</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden animate-fadeSlideUp">
      <div className="relative z-10 h-full flex flex-col">
        <h3 className="text-xl font-bold text-white mb-4">Reminders</h3>

        {reminders.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <span className="text-6xl mb-4">🔔</span>
            <p className="text-gray-400 text-lg">No active reminders</p>
            <p className="text-gray-500 text-sm mt-2">
              Reminders will appear here when you join sessions
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                onClick={() => handleReminderClick(reminder)}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  reminder.read
                    ? "bg-gray-800/30 border-gray-700/30 opacity-50 hover:opacity-60"
                    : reminder.isOwner
                    ? "bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20"
                    : "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    reminder.read
                      ? "bg-gray-700/30"
                      : reminder.isOwner
                      ? "bg-indigo-500/20"
                      : "bg-purple-500/20"
                  }`}
                >
                  <span
                    className={`text-lg ${
                      reminder.read
                        ? "text-gray-500"
                        : reminder.isOwner
                        ? "text-indigo-300"
                        : "text-purple-300"
                    }`}
                  >
                    ⏰
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-medium text-sm mb-1 ${
                      reminder.read ? "text-gray-400" : "text-white"
                    }`}
                  >
                    {reminder.message}
                  </h4>
                  <p className="text-gray-500 text-xs">
                    {formatScheduledTime(reminder.scheduledTime)}
                  </p>
                  {reminder.read && (
                    <p className="text-gray-600 text-xs mt-1 italic">
                      Read{" "}
                      {new Date(reminder.readAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
```

**Component Features:**

1. **Auto-refresh**: Polls API every 60 seconds
2. **Click-to-read**: Marks reminder as read and navigates to session
3. **Visual states**:
   - Unread owner: Indigo background, full opacity
   - Unread participant: Purple background, full opacity
   - Read: Gray background, 50% opacity
4. **Empty state**: Shows when no reminders exist
5. **Loading/Error states**: User-friendly feedback

---

## Key Features

### 1. Auto-Generation Lifecycle

```
User Creates Session
    ↓
SessionService.createSession()
    ↓
ReminderService.createRemindersForSession(owner, session)
    ↓
Create DAY_BEFORE reminder (if session > 24h away)
Create ONE_HOUR_BEFORE reminder (if session > 1h away)
    ↓
Reminders saved to database
```

### 2. Single Reminder Per Session + Smart Sorting

**Implementation Strategy:**

Due to MySQL limitations with LIMIT in subqueries, we implement a two-stage approach:

**Stage 1: Repository Query**

```sql
ORDER BY scheduled_time DESC
```

**Stage 2: Service Layer Deduplication**

```java
Map<Long, Reminder> latestReminderPerSession = new HashMap<>();
for (Reminder reminder : allReminders) {
    Long sessionId = reminder.getSession().getId();
    // First occurrence = most recent (due to DESC sort)
    if (!latestReminderPerSession.containsKey(sessionId)) {
        latestReminderPerSession.put(sessionId, reminder);
    }
}
```

**Stage 3: Final Sorting**

```java
.sorted((a, b) -> {
    int readCompare = Boolean.compare(a.isRead(), b.isRead());
    if (readCompare != 0) return readCompare;
    return b.getScheduledTime().compareTo(a.getScheduledTime());
})
```

**Result:**

1. **Only ONE reminder per session** (most recent by scheduledTime)
2. Unread reminders first (isRead = false → 0)
3. Read reminders last (isRead = true → 1)
4. Within each group: Newest scheduled time first

**Example:**

```
✅ Unread - Session A: ONE_HOUR_BEFORE (today 2 PM)
✅ Unread - Session B: DAY_BEFORE (tomorrow 10 AM)
☑️ Read - Session C: ONE_HOUR_BEFORE (yesterday)
```

Note: If both 24H and 1H reminders are active for the same session, only the 1H reminder shows (most recent).

### 3. Role-Aware Messages

| Type            | Role        | Message Template                                                |
| --------------- | ----------- | --------------------------------------------------------------- |
| DAY_BEFORE      | Owner       | "⏰ Your session 'Title' is scheduled for tomorrow at 3:00 PM." |
| DAY_BEFORE      | Participant | "⏰ Upcoming session: 'Title' tomorrow at 3:00 PM."             |
| ONE_HOUR_BEFORE | Owner       | "⏰ Your session 'Title' is coming up today at 3:00 PM."        |
| ONE_HOUR_BEFORE | Participant | "⏰ 'Title' is coming up today at 3:00 PM."                     |

### 4. Visual Design System

**Color Coding:**

- **Indigo** (`bg-indigo-500/10`): Owner reminders (you created this)
- **Purple** (`bg-purple-500/10`): Participant reminders (you joined this)
- **Gray** (`bg-gray-800/30`): Read reminders (acknowledged)

**Opacity:**

- **100%**: Unread reminders (requires attention)
- **50%**: Read reminders (already acknowledged)

### 5. Auto-Cleanup on Cancel

```
User Cancels Participation
    ↓
SessionService.cancelJoinSession()
    ↓
Delete participant record
    ↓
ReminderService.deleteRemindersForUserSession(userId, sessionId)
    ↓
All reminders for this user-session pair deleted
```

---

## Database Indexing Strategy

### Performance Optimization

```sql
-- Index 1: User + Scheduled Time (for active reminders query)
CREATE INDEX idx_reminder_user_scheduled
ON reminders (user_id, scheduled_time);

-- Index 2: User + Read Status (for unread count query)
CREATE INDEX idx_reminder_user_read
ON reminders (user_id, is_read);
```

**Why These Indexes?**

1. **`user_id + scheduled_time`**: Speeds up `findActiveRemindersByUserId` query
2. **`user_id + is_read`**: Speeds up `countUnreadReminders` query
3. **Composite indexes**: Better than separate indexes for multi-column WHERE clauses

---

## Authentication Flow

```
Frontend: Click reminder
    ↓
ReminderService.markAsRead(reminderId)
    ↓
authFetch includes JWT token in Authorization header
    ↓
Backend: ReminderController.markAsRead(@PathVariable id)
    ↓
SecurityContextHolder.getContext().getAuthentication()
    ↓
Extract email from JWT UserDetails
    ↓
UserRepository.findByEmail(email)
    ↓
Verify reminder.user.id == authenticated user.id
    ↓
reminder.markAsRead()
    ↓
Save to database
```

**Security:**

- JWT token automatically validated by Spring Security
- User ID extracted from token (not passed as parameter)
- Ownership verified before allowing read/delete operations

---

## Example Data Flow

### Scenario: User Creates a Session

```
1. Frontend: POST /api/sessions
   Body: { title: "Math Study", startTime: "2025-12-10T15:00:00", ... }

2. Backend: SessionController.createSession()
   - Extract userId from JWT
   - Create Session entity
   - Save to database

3. Backend: ReminderService.createRemindersForSession(user, session)
   - Calculate scheduledTime = startTime - 24h = 2025-12-09T15:00:00
   - Create DAY_BEFORE reminder
   - Calculate scheduledTime = startTime - 1h = 2025-12-10T14:00:00
   - Create ONE_HOUR_BEFORE reminder
   - Save both reminders

4. Result: 2 reminders created automatically
   - Reminder 1: DAY_BEFORE, scheduled for Dec 9 at 3 PM
   - Reminder 2: ONE_HOUR_BEFORE, scheduled for Dec 10 at 2 PM
```

### Scenario: User Views Reminders

```
1. Frontend: GET /api/reminders/active

2. Backend: ReminderRepository.findActiveRemindersByUserId()
   SQL: SELECT * FROM reminders
        WHERE user_id = 1
        AND scheduled_time <= NOW()
        AND session.session_status = 'ACTIVE'
        ORDER BY is_read ASC, scheduled_time DESC

3. Backend: ReminderService.getActiveReminders()
   - Map each Reminder to ReminderDTO
   - Generate message based on type and isOwner
   - Return list

4. Frontend: RemindersTab component
   - Display reminders with color coding
   - Unread reminders shown with full opacity
   - Read reminders shown with 50% opacity
```

### Scenario: User Clicks Reminder

```
1. Frontend: handleReminderClick(reminder)
   - Call reminderService.markAsRead(reminder.id)

2. Backend: PATCH /api/reminders/{id}/read
   - Find reminder by ID
   - Verify userId from JWT matches reminder.user.id
   - Call reminder.markAsRead()
   - Set isRead = true, readAt = NOW()
   - Save to database

3. Frontend: Update local state
   - Change reminder.read = true
   - Lower opacity to 50%
   - Navigate to /session/{sessionId}
```

---

## Best Practices

### 1. Always Check Duplicates

```java
if (reminderRepository.existsByUserIdAndSessionId(user.getId(), session.getId())) {
    return; // Prevent duplicate reminders
}
```

### 2. Validate Time Before Creation

```java
LocalDateTime dayBeforeTime = sessionStart.minusDays(1);
if (dayBeforeTime.isAfter(now)) {
    // Only create if scheduled time is in the future
    reminderRepository.save(reminder);
}
```

### 3. Use Transactions for Cleanup

```java
@Transactional
public void cancelJoinSession(Long sessionId, Long userId) {
    sessionParticipantRepository.deleteByUserIdAndSessionId(userId, sessionId);
    reminderService.deleteRemindersForUserSession(userId, sessionId);
    // Both operations succeed or both fail (atomic)
}
```

### 4. Poll for Updates

```javascript
useEffect(() => {
  loadReminders();
  const interval = setInterval(loadReminders, 60000); // Every 60 seconds
  return () => clearInterval(interval);
}, []);
```

### 5. Optimistic UI Updates

```javascript
// Update UI immediately (don't wait for reload)
setReminders(
  reminders.map((r) =>
    r.id === reminder.id ? { ...r, read: true, readAt: new Date() } : r
  )
);
```

---

## Troubleshooting

### Reminders not being created?

**Check:**

- Session start time is in the future
- User is authenticated (JWT valid)
- `ReminderService` injected in `SessionService` constructor
- No duplicate check blocking creation

### Reminders showing wrong order?

**Verify:**

- SQL query: `ORDER BY is_read ASC, scheduled_time DESC`
- Repository attribute names match entity: `r.isRead`, `r.scheduledTime`

### Can't mark reminder as read?

**Debug:**

- JWT token present in localStorage
- User ID in token matches reminder owner
- PATCH endpoint: `/api/reminders/{id}/read`

### Reminders not deleted on cancel?

**Ensure:**

- `@Transactional` on `cancelJoinSession`
- `deleteRemindersForUserSession` called after participant deletion
- User ID and session ID are correct

### Seeing both 24H and 1H reminders for same session?

**Solution:**

- This is fixed by HashMap deduplication in `getActiveReminders()`
- Only the most recent reminder per session will show
- Verify `Map<Long, Reminder>` import is present

### MySQL error: "LIMIT & IN/ALL/ANY/SOME subquery"?

**Fix:**

- Don't use LIMIT inside JPQL subqueries (MySQL 8.0 limitation)
- Move filtering to service layer using HashMap
- Keep repository query simple: `ORDER BY r.scheduledTime DESC`

### Compilation error: "getRead() undefined for ReminderDTO"?

**Fix:**

- Boolean getters should use `isRead()` not `getRead()` (Java convention)
- Update all comparators to use `a.isRead()` and `b.isRead()`

---

## Future Enhancements (Optional)

- **Push Notifications**: Real-time browser notifications using Web Push API
- **Email Reminders**: Send email at scheduled times using scheduled tasks
- **Custom Reminder Times**: Allow users to set custom reminder intervals
- **Snooze Feature**: Postpone reminders by 15/30/60 minutes
- **Reminder Settings**: Per-user preferences (enable/disable, custom times)
- **Real-time Updates**: WebSocket for instant reminder updates without polling

---

**Created by:** AcadeMeet Development Team  
**Last Updated:** December 7, 2025
