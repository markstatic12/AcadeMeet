# Comments and Replies System Guide

## Overview

The AcadeMeet application implements a **single-level nested comment and reply system** for sessions. This design ensures a clean UI while maintaining thread context through visual indentation and @mentions.

---

## Architecture

### Key Design Principles

1. **Single-Level Nesting**: Replies are always attached to the root (parent) comment, preventing deep nesting
2. **Visual Hierarchy**: One "step down" indentation for all replies under a comment
3. **@Mention Support**: When replying to a reply, the textarea automatically prepends `@username`
4. **Collapsible Replies**: Replies are hidden by default with a dropdown toggle showing reply count
5. **JWT Authentication**: All endpoints use Spring Security JWT authentication

---

## Database Schema

### Comment Entity

```java
@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    // Self-referencing relationship for replies
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private Comment parentComment;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL)
    private List<Comment> replies = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "reply_count")
    private Integer replyCount = 0;
}
```

**Key Fields:**

- `parentComment`: Nullable foreign key pointing to parent comment
  - **NULL = top-level comment (highest parent)**
  - **NOT NULL = reply (points to the root comment it belongs to)**
- `replyCount`: Denormalized count for performance (incremented on reply creation)
- `replies`: List of child comments (not serialized to prevent circular references)

---

## Backend Implementation

### 1. DTOs (Data Transfer Objects)

#### CommentRequest (Input DTO)

```java
public class CommentRequest {
    private String content;

    // Getters and Setters
}
```

**Purpose**: Accepts comment/reply content from frontend

#### CommentDTO (Output DTO for Parent Comments)

```java
public class CommentDTO {
    private Long commentId;
    private Long userId;
    private String userName;
    private String content;
    private LocalDateTime createdAt;
    private Integer replyCount;
    private List<ReplyDTO> replies = new ArrayList<>();

    // Getters and Setters
}
```

#### ReplyDTO (Output DTO for Replies)

```java
public class ReplyDTO {
    private Long commentId;
    private Long userId;
    private String userName;
    private String content;
    private LocalDateTime createdAt;

    // Getters and Setters
}
```

---

### 2. Comment Service

#### Creating a Comment

```java
@Transactional
public void createComment(Long userId, Long sessionId, String content) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));
    Session session = sessionRepository.findById(sessionId)
        .orElseThrow(() -> new RuntimeException("Session not found"));

    // Top-level comment: parentComment = null (indicates it's the highest parent)
    Comment comment = new Comment(session, user, content, null);
    commentRepository.save(comment);
}
```

#### Creating a Reply

```java
@Transactional
public void createReply(Long userId, Long sessionId, Long parentCommentId, String content) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));
    Session session = sessionRepository.findById(sessionId)
        .orElseThrow(() -> new RuntimeException("Session not found"));
    Comment parentComment = commentRepository.findById(parentCommentId)
        .orElseThrow(() -> new RuntimeException("Parent comment not found"));

    // KEY LOGIC: Always attach to root comment for single-level nesting
    // If parentComment.getParentComment() is null, then parentComment IS the root
    Comment rootComment = parentComment.getParentComment() != null
        ? parentComment.getParentComment()  // If replying to a reply, get the root (the one with null parent)
        : parentComment;                     // If replying to root directly, use it

    Comment reply = new Comment(session, user, content, rootComment);
    commentRepository.save(reply);

    // Increment reply count on root comment
    rootComment.incrementReplyCount();
    commentRepository.save(rootComment);
}
```

**How Single-Level Nesting Works:**

- **Scenario 1:** User replies to Comment A (where Comment A has `parentComment = null`)
  - Reply is attached to Comment A
  - The reply's `parentComment` field points to Comment A
- **Scenario 2:** User replies to Reply B (which already has `parentComment = Comment A`)
  - Reply is **still** attached to Comment A (not to Reply B)
  - The new reply's `parentComment` field points to Comment A (the root)
- **Result:** This prevents deep nesting like: Comment → Reply → Reply → Reply...
  - All replies under a comment stay at the same visual level
  - `parentComment = null` always indicates the top-level comment (root)

#### Fetching Grouped Comments

```java
@Transactional(readOnly = true)
public List<CommentDTO> getSessionCommentsGrouped(Long sessionId) {
    // Get all comments for the session
    List<Comment> allComments = commentRepository.findAll()
        .stream()
        .filter(c -> c.getSession().getId().equals(sessionId))
        .toList();

    Map<Long, CommentDTO> parentCommentsMap = new HashMap<>();
    Map<Long, List<ReplyDTO>> repliesMap = new HashMap<>();

    // Separate parent comments
    for (Comment comment : allComments) {
        if (comment.getParentComment() == null) {
            CommentDTO dto = new CommentDTO(
                comment.getCommentId(),
                comment.getUser().getId(),
                comment.getUser().getName(),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getReplyCount()
            );
            parentCommentsMap.put(comment.getCommentId(), dto);
            repliesMap.put(comment.getCommentId(), new ArrayList<>());
        }
    }

    // Group replies under their parent
    for (Comment comment : allComments) {
        if (comment.getParentComment() != null) {
            Long parentId = comment.getParentComment().getCommentId();

            ReplyDTO replyDTO = new ReplyDTO(
                comment.getCommentId(),
                comment.getUser().getId(),
                comment.getUser().getName(),
                comment.getContent(),
                comment.getCreatedAt(),
                null, null  // Simplified - no complex @mention tracking
            );

            if (repliesMap.containsKey(parentId)) {
                repliesMap.get(parentId).add(replyDTO);
            }
        }
    }

    // Combine parent comments with their replies
    List<CommentDTO> result = new ArrayList<>();
    for (CommentDTO parentDTO : parentCommentsMap.values()) {
        parentDTO.setReplies(repliesMap.get(parentDTO.getCommentId()));
        result.add(parentDTO);
    }

    result.sort((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt()));
    return result;
}
```

---

### 3. Comment Controller (REST API)

```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class CommentController {

    private final CommentService commentService;
    private final UserRepository userRepository;

    // Create a new comment
    // NOTE: userId is extracted from JWT token, not passed as parameter
    @PostMapping("/sessions/{sessionId}/comments")
    public ResponseEntity<?> createComment(
            @PathVariable Long sessionId,
            @RequestBody CommentRequest request) {
        try {
            User user = getAuthenticatedUser();  // Extracts userId from JWT
            commentService.createComment(user.getId(), sessionId, request.getContent());
            return ResponseEntity.ok(Map.of("message", "Comment created successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Create a reply
    // NOTE: userId is extracted from JWT token, not passed as parameter
    @PostMapping("/sessions/{sessionId}/comments/{commentId}/replies")
    public ResponseEntity<?> createReply(
            @PathVariable Long sessionId,
            @PathVariable Long commentId,
            @RequestBody CommentRequest request) {
        try {
            User user = getAuthenticatedUser();  // Extracts userId from JWT
            commentService.createReply(user.getId(), sessionId, commentId, request.getContent());
            return ResponseEntity.ok(Map.of("message", "Reply created successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get all comments for a session
    @GetMapping("/sessions/{sessionId}/comments")
    public ResponseEntity<?> getSessionComments(@PathVariable Long sessionId) {
        try {
            List<CommentDTO> comments = commentService.getSessionCommentsGrouped(sessionId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Extract authenticated user from JWT token (Spring Security)
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();  // Email is stored as username in JWT

        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
```

**API Endpoints:**

- `POST /api/sessions/{sessionId}/comments` - Create top-level comment
- `POST /api/sessions/{sessionId}/comments/{commentId}/replies` - Create reply
- `GET /api/sessions/{sessionId}/comments` - Get all comments (grouped with replies)

---

## Frontend Implementation

### 1. Comment Service (API Client)

```javascript
// CommentService.js
import { authFetch } from "./apiHelper";

export const getSessionComments = async (sessionId) => {
  const response = await authFetch(`/sessions/${sessionId}/comments`);
  const comments = await handleResponse(response, "Failed to fetch comments");
  return comments; // Returns CommentDTO[] with nested replies
};

export const createComment = async (sessionId, content) => {
  const response = await authFetch(`/sessions/${sessionId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  return await handleResponse(response, "Failed to create comment");
};

export const createReply = async (sessionId, commentId, content) => {
  const response = await authFetch(
    `/sessions/${sessionId}/comments/${commentId}/replies`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    }
  );
  return await handleResponse(response, "Failed to create reply");
};
```

---

### 2. Comments Panel Component

#### State Management

```javascript
export const CommentsPanel = ({ sessionId }) => {
  const [comments, setComments] = React.useState([]);
  const [newComment, setNewComment] = React.useState("");
  const [replyingTo, setReplyingTo] = React.useState(null); // { commentId, userName, userId }
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [expandedComments, setExpandedComments] = React.useState(new Set());

  // ... component logic
};
```

#### Loading Comments

```javascript
const loadComments = React.useCallback(async () => {
  setLoading(true);
  try {
    const { getSessionComments } = await import(
      "../../services/CommentService"
    );
    const data = await getSessionComments(sessionId);
    setComments(data);
  } catch (error) {
    console.error("Error loading comments:", error);
  } finally {
    setLoading(false);
  }
}, [sessionId]);

React.useEffect(() => {
  if (sessionId) {
    loadComments();
  }
}, [sessionId, loadComments]);
```

#### Submitting Comment/Reply

```javascript
const handleSubmit = async () => {
  if (!newComment.trim()) return;

  setSubmitting(true);
  try {
    const { createComment, createReply } = await import(
      "../../services/CommentService"
    );

    if (replyingTo) {
      // Creating a reply - uses parent commentId
      await createReply(sessionId, replyingTo.commentId, newComment);
    } else {
      // Creating a new comment
      await createComment(sessionId, newComment);
    }

    // Reload comments and reset form
    await loadComments();
    setNewComment("");
    setReplyingTo(null);
  } catch (error) {
    console.error("Error posting comment/reply:", error);
    alert("Failed to post. Please try again.");
  } finally {
    setSubmitting(false);
  }
};
```

#### Reply Button Handler (Auto @mention)

```javascript
const handleReply = (commentId, userName, userId) => {
  setReplyingTo({ commentId, userName, userId });
  setNewComment(`@${userName} `); // Auto-prepend @mention
};
```

#### Toggle Replies (Collapsible)

```javascript
const toggleReplies = (commentId) => {
  setExpandedComments((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(commentId)) {
      newSet.delete(commentId);
    } else {
      newSet.add(commentId);
    }
    return newSet;
  });
};
```

---

### 3. UI Component Structure

#### Comment Input

```jsx
<div className="mb-6 flex-shrink-0">
  {replyingTo && (
    <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
      <span>Replying to @{replyingTo.userName}</span>
      <button
        onClick={cancelReply}
        className="text-indigo-400 hover:text-indigo-300"
      >
        Cancel
      </button>
    </div>
  )}
  <textarea
    placeholder={
      replyingTo ? `Reply to @${replyingTo.userName}...` : "Add a comment..."
    }
    rows={3}
    value={newComment}
    onChange={(e) => setNewComment(e.target.value)}
    className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg..."
  />
  <button onClick={handleSubmit} disabled={!newComment.trim() || submitting}>
    {submitting ? "Posting..." : replyingTo ? "Post Reply" : "Post Comment"}
  </button>
</div>
```

#### Comment Display with Collapsible Replies

```jsx
<div className="flex-1 overflow-y-auto space-y-6">
  {comments.map((comment) => (
    <div key={comment.commentId} className="border-b border-gray-800 pb-4">
      {/* Parent Comment */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
          {getInitials(comment.userName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white text-sm font-medium">
              {comment.userName}
            </span>
            <span className="text-gray-400 text-xs">
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>
          <p className="text-gray-300 text-sm mb-2">{comment.content}</p>

          {/* Actions: Reply button + Reply count dropdown */}
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                handleReply(comment.commentId, comment.userName, comment.userId)
              }
            >
              Reply
            </button>

            {comment.replies && comment.replies.length > 0 && (
              <button onClick={() => toggleReplies(comment.commentId)}>
                <svg
                  className={`w-3 h-3 transition-transform ${
                    expandedComments.has(comment.commentId) ? "rotate-180" : ""
                  }`}
                >
                  {/* Chevron icon */}
                </svg>
                {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Replies (single-level indent) - Only show when expanded */}
      {comment.replies &&
        comment.replies.length > 0 &&
        expandedComments.has(comment.commentId) && (
          <div className="ml-11 mt-3 space-y-3">
            {comment.replies.map((reply) => (
              <div key={reply.commentId} className="flex items-start gap-3">
                <div className="w-7 h-7 bg-purple-600 rounded-full">
                  {getInitials(reply.userName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm">{reply.userName}</span>
                    <span className="text-gray-400 text-xs">
                      {formatTimeAgo(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{reply.content}</p>
                  <button
                    onClick={() =>
                      handleReply(
                        comment.commentId,
                        reply.userName,
                        reply.userId
                      )
                    }
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  ))}
</div>
```

---

## Key Features

### 1. Single-Level Nesting Logic

- When User A replies to Comment X → Reply is attached to Comment X
- When User B replies to User A's reply → Reply is **still** attached to Comment X (not User A's reply)
- This ensures all replies stay at the same visual level

### 2. Visual Indentation

- Parent comments: No indentation
- All replies: One level of indentation (`ml-11` = margin-left: 2.75rem)
- No deeper nesting allowed

### 3. @Mention Feature

- When replying to a reply, textarea auto-fills with `@username `
- Content stored as plain text (e.g., `"@JohnDoe Great point!"`)
- No backend parsing needed - it's just visual context

### 4. Collapsible Replies

- Replies hidden by default
- Click dropdown to expand/collapse
- Shows reply count (e.g., "3 replies")
- Chevron icon rotates on toggle

### 5. Fixed-Height Scrollable Container

- Container: Fixed 600px height
- Header and input: Fixed (`flex-shrink-0`)
- Comments list: Scrollable (`flex-1 overflow-y-auto`)

---

## Authentication Flow

1. User logs in → Receives JWT token (stored in localStorage)
2. Frontend includes token in all API requests via `authFetch` helper
3. Backend validates JWT in `SecurityContextHolder`
4. `getAuthenticatedUser()` extracts user email from token
5. User entity fetched from database for comment creation

**JWT is automatically handled** - no manual token management needed in comment endpoints.

---

## Example Data Flow

### Creating a Comment

```
Frontend → POST /api/sessions/123/comments
Body: { "content": "Great session!" }
Headers: { "Authorization": "Bearer <JWT_TOKEN>" }
↓
Backend extracts userId from JWT
Backend creates Comment entity (parentComment = null)
Backend saves to database
↓
Frontend receives success response
Frontend reloads comments
```

### Creating a Reply to a Reply

```
Frontend → User clicks "Reply" on Reply B (under Comment A)
Frontend sets replyingTo = { commentId: A, userName: "UserB", userId: 2 }
Frontend prepopulates textarea with "@UserB "
User types: "@UserB I agree!"
↓
Frontend → POST /api/sessions/123/comments/A/replies
Body: { "content": "@UserB I agree!" }
↓
Backend finds Comment A
Backend checks if Comment A has a parent
- If yes → Attach new reply to A's parent (root comment)
- If no → Attach new reply to Comment A
Backend increments reply count on root comment
Backend saves reply
↓
Frontend reloads comments
Reply appears under Comment A (single indent level)
```

---

## Best Practices

1. **Always reload comments after create operations** - Ensures UI stays in sync
2. **Use Set for expandedComments** - O(1) lookup performance
3. **Validate content on frontend** - Trim whitespace, check for empty strings
4. **Handle errors gracefully** - Show user-friendly error messages
5. **Keep DTOs simple** - Avoid circular references (Session, User entities not serialized)
6. **Use callbacks for event handlers** - Prevents unnecessary re-renders
7. **Memoize loadComments** - `React.useCallback` with proper dependencies

---

## Troubleshooting

### Comments not loading?

- Check JWT token in localStorage
- Verify sessionId is valid
- Check backend logs for authentication errors

### Replies appearing under wrong comment?

- Verify `parentCommentId` in reply creation
- Check `getSessionCommentsGrouped` logic for proper grouping

### Infinite re-renders?

- Ensure `loadComments` is wrapped in `useCallback`
- Check useEffect dependencies array

### Circular JSON errors?

- Never return Comment entities directly from controller
- Always use DTOs (CommentDTO, ReplyDTO)

---

## Future Enhancements (Optional)

- **Edit/Delete comments**: Add PATCH/DELETE endpoints
- **Pagination**: Implement cursor-based pagination for large comment threads
- **Real-time updates**: Use WebSocket for live comment updates
- **Rich text**: Support markdown or HTML formatting
- **Reactions**: Add like/emoji reactions to comments
- **Notifications**: Notify users when someone replies to their comment

---

**Created by:** AcadeMeet Development Team  
**Last Updated:** December 3, 2025
