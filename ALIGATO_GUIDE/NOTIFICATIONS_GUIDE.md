# Notifications System Guide

## Overview

The AcadeMeet application implements an **in-app notification system** that automatically notifies users about important session-related events. Notifications are triggered by specific actions and displayed in a real-time modal accessible from the dashboard.

---

## Architecture

### Database Schema

**Notification Entity:**

```java
@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_notification_user_created", columnList = "user_id, created_at"),
    @Index(name = "idx_notification_user_read", columnList = "user_id, is_read")
})
public class Notification {
    private Long id;
    private User recipient;           // Who receives the notification
    private Session session;          // Related session (nullable)
    private NotificationType type;    // Type of notification
    private String message;           // Notification message
    private Boolean isRead;           // Read/unread status
    private LocalDateTime createdAt;  // Timestamp
}
```

**Notification Types:**

```java
public enum NotificationType {
    JOIN_CONFIRMATION,      // User successfully joined a session
    PARTICIPANT_JOINED,     // New participant joined user's session
    SESSION_UPDATED,        // Session details were changed
    SESSION_CANCELED,       // Session was canceled by host
    COMMENT_REPLY,          // Someone replied to user's comment
    COMMENT_ON_SESSION,     // Someone commented on user's session
    NOTES_UPLOADED          // New notes uploaded to session
}
```

---

## Notification Triggers

### 1. Join Confirmation

**When:** User joins a session  
**Recipient:** User who joined  
**Message:** `✅ You have successfully joined "Session Title"`

```java
// In SessionService.joinSession()
notificationService.notifyJoinConfirmation(user, session);
```

### 2. Participant Joined

**When:** Someone joins your session  
**Recipient:** Session owner  
**Message:** `✅ John Doe joined your session "Session Title"`

```java
// In SessionService.joinSession()
notificationService.notifyParticipantJoined(user, session);
```

### 3. Session Updated

**When:** Session owner updates session details  
**Recipient:** All participants (except owner)  
**Message:** `🔔 The session "Session Title" has been updated. Please check the details.`

```java
// In SessionService.updateSession()
List<User> participants = sessionParticipantRepository.findBySessionId(sessionId).stream()
        .map(SessionParticipant::getUser)
        .collect(Collectors.toList());
notificationService.notifySessionUpdated(savedSession, participants);
```

### 4. Session Canceled

**When:** Session is closed/canceled by host  
**Recipient:** All participants (except owner)  
**Message:** `❌ The session "Session Title" has been canceled by Host Name.`

```java
// In SessionService.closeSession()
List<User> participants = sessionParticipantRepository.findBySessionId(sessionId).stream()
        .map(SessionParticipant::getUser)
        .collect(Collectors.toList());
notificationService.notifySessionCanceled(session, participants);
```

### 5. Comment Reply

**When:** Someone replies to a user's comment  
**Recipient:** Original commenter (not self-replies)  
**Message:** `💬 Jane Smith replied to your comment in "Session Title"`

```java
// In CommentService.createComment()
if (parentComment != null) {
    notificationService.notifyCommentReply(parentComment.getAuthor(), user, session);
}
```

### 6. Comment on Session

**When:** Someone posts a comment on a session  
**Recipient:** Session owner (not self-comments)  
**Message:** `💬 Jane Smith commented on your session "Session Title"`

```java
// In CommentService.createComment()
if (parentComment == null) {
    notificationService.notifyCommentOnSession(user, session);
}
```

### 7. Notes Uploaded

**When:** Session owner uploads new notes/files  
**Recipient:** All participants (except owner)  
**Message:** `📎 New notes were uploaded for "Session Title"`

```java
// In SessionNoteService.addNote()
List<User> participants = sessionParticipantRepository.findBySessionId(sessionId).stream()
        .map(SessionParticipant::getUser)
        .collect(Collectors.toList());
notificationService.notifyNotesUploaded(session, participants);
```

---

## Backend API Endpoints

```java
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    // Get all notifications for current user
    @GetMapping("/all")
    public ResponseEntity<?> getAllNotifications()

    // Get unread notifications only
    @GetMapping("/unread")
    public ResponseEntity<?> getUnreadNotifications()

    // Get unread count (for badge display)
    @GetMapping("/unread/count")
    public ResponseEntity<?> getUnreadCount()

    // Mark single notification as read
    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id)

    // Mark all notifications as read
    @PostMapping("/mark-all-read")
    public ResponseEntity<?> markAllAsRead()
}
```

---

## Frontend Implementation

### Notification Service

```javascript
// services/notificationService.js
export const notificationService = {
  async getAllNotifications() {
    const response = await authFetch("/notifications/all", { method: "GET" });
    return handleResponse(response, "Failed to fetch notifications");
  },

  async getUnreadNotifications() {
    const response = await authFetch("/notifications/unread", {
      method: "GET",
    });
    return handleResponse(response, "Failed to fetch unread notifications");
  },

  async getUnreadCount() {
    const response = await authFetch("/notifications/unread/count", {
      method: "GET",
    });
    return handleResponse(response, "Failed to fetch unread count");
  },

  async markAsRead(notificationId) {
    const response = await authFetch(`/notifications/${notificationId}/read`, {
      method: "PATCH",
      body: JSON.stringify({}),
    });
    return handleResponse(response, "Failed to mark notification as read");
  },

  async markAllAsRead() {
    const response = await authFetch("/notifications/mark-all-read", {
      method: "POST",
      body: JSON.stringify({}),
    });
    return handleResponse(response, "Failed to mark all as read");
  },
};
```

### Notification Modal in DashboardLayout

**Features:**

- Bell icon with unread count badge
- Dropdown modal with "All" and "Unread" filters
- Auto-refresh every 60 seconds
- Click notification to mark as read and navigate to session
- Expandable view for viewing all notifications
- Three-dot menu for individual mark as read/unread

**Key Implementation:**

```javascript
const [showNotifications, setShowNotifications] = useState(false);
const [notifications, setNotifications] = useState([]);
const [unreadCount, setUnreadCount] = useState(0);
const [expandedView, setExpandedView] = useState(false);

// Load unread count periodically
useEffect(() => {
  loadUnreadCount();
  const interval = setInterval(loadUnreadCount, 60000);
  return () => clearInterval(interval);
}, []);

// Load notifications when modal opens
useEffect(() => {
  if (showNotifications) {
    loadNotifications();
  }
}, [showNotifications, filter]);

const handleNotificationClick = async (notification) => {
  if (!notification.read) {
    await notificationService.markAsRead(notification.id);
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }
  setShowNotifications(false);
  if (notification.sessionId) {
    navigate(`/session/${notification.sessionId}`);
  }
};
```

---

## Key Features

### 1. Auto-Notification Creation

Notifications are created automatically in service layer methods:

- No manual trigger needed from controllers
- Business logic determines when to notify
- Prevents self-notifications (user won't be notified of their own actions)

### 2. Smart Filtering

- **Recipient Check:** Users don't receive notifications for their own actions
- **Batch Notifications:** Session updates notify all participants at once
- **Single Notification:** Each event creates one notification per recipient

### 3. Read/Unread Status

- Unread notifications: Full opacity with colored background
- Read notifications: 80% opacity with gray background
- Visual indicator (blue dot) for unread items

### 4. Real-time Badge

- Bell icon shows unread count (max "9+")
- Updates every 60 seconds automatically
- Immediate update when marking as read

### 5. Session Navigation

- Clicking a notification navigates to the related session
- Automatically marks notification as read
- Closes the modal after navigation

---

## Database Indexing

```sql
-- Index for fetching user notifications sorted by date
CREATE INDEX idx_notification_user_created
ON notifications (user_id, created_at);

-- Index for counting unread notifications
CREATE INDEX idx_notification_user_read
ON notifications (user_id, is_read);
```

These indexes optimize:

1. Fetching all notifications for a user
2. Filtering unread notifications
3. Counting unread notifications quickly

---

## Example Data Flow

### Scenario: User joins a session

```
1. Frontend: POST /api/sessions/{id}/join

2. Backend: SessionService.joinSession()
   - Validate user and session
   - Create SessionParticipant record
   - Call notificationService.notifyJoinConfirmation(user, session)
   - Call notificationService.notifyParticipantJoined(user, session)

3. NotificationService creates two notifications:
   Notification 1 (to user):
   - type: JOIN_CONFIRMATION
   - message: "✅ You have successfully joined 'Study Group'"

   Notification 2 (to session owner):
   - type: PARTICIPANT_JOINED
   - message: "✅ John Doe joined your session 'Study Group'"

4. Frontend: Bell icon badge updates to show new unread count

5. User clicks bell icon → Modal shows new notifications

6. User clicks notification → Marks as read, navigates to session
```

---

## Best Practices

### Backend

- Always use `@Transactional` when creating notifications
- Check if user is performing action on themselves (prevent self-notifications)
- Use `findBySessionId(sessionId)` not `findBySession(session)` for participants
- Batch create notifications for multiple recipients in one method

### Frontend

- Poll for unread count every 60 seconds
- Update local state immediately after marking as read (optimistic UI)
- Close modal after navigation for better UX
- Show loading states during API calls

---

**Created:** December 8, 2025  
**Feature Status:** ✅ Fully Implemented
