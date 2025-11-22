# 🎯 ACADEMEET PROJECT - TEAM TASK INSTRUCTIONS

**Updated: November 21, 2025**

## 📋 TABLE OF CONTENTS

- [Project Overview](#project-overview)
- [Naming Conventions](#naming-conventions)
- [ZANDER - Backend & Features](#zander---backend--features)
- [MARK - Frontend Reorganization & UI](#mark---frontend-reorganization--ui)
- [RICHEMMAE - Note Image Support](#richemmae---note-image-support)
- [Code Quality Guidelines](#code-quality-guidelines)
- [Testing & Validation](#testing--validation)

---

## 🚀 PROJECT OVERVIEW

**AcadeMeet** is a student academic collaboration platform. We are implementing three major feature branches with optimized file structures to reduce complexity while maintaining code quality.

### Key Improvements

- **28% fewer component files** through strategic merging
- **Feature-based organization** instead of page-based
- **Unified naming conventions** across frontend and backend
- **Enhanced functionality** for sessions, reminders, and notes

---

## 📏 NAMING CONVENTIONS

### **GitHub Branch Naming**

```
type/feature_name/snake_case_description

Examples:
feature/session/privacy_and_status_system
fix/session/meeting_to_session_terminology
refactor/frontend/component_reorganization
```

### **Commit Messages**

```
<type>(<scope>): <subject>

Examples:
feat(session): add privacy and status system
fix(session): replace meeting terminology with session
refactor(components): reorganize folder structure by feature
```

### **Frontend Naming**

- **Components**: `ComponentName.jsx`
- **Services**: `featureService.js`
- **Folders**: `feature-based` (session/, note/, auth/)

### **Backend Naming**

- **Entities**: `EntityName.java`
- **Services**: `EntityService.java`
- **Controllers**: `EntityController.java`
- **Enums**: `EnumName.java`
- **API Endpoints**: `/api/resource/action`

---

## 👤 ZANDER - BACKEND & FEATURES

### **🔧 BRANCH 1: `feature/session/privacy_and_status_system`**

**Priority: CRITICAL** | **Estimated Time: 3-4 days**

#### **Backend Tasks**

##### 1. Update Session Entity (`Session.java`)

**Location**: `backend/src/main/java/com/appdev/academeet/model/Session.java`

**Add these fields:**

```java
// Session Privacy & Status
@Enumerated(EnumType.STRING)
@Column(name = "session_type")
private SessionType sessionType = SessionType.PUBLIC;

@Enumerated(EnumType.STRING)
@Column(name = "status")
private SessionStatus status = SessionStatus.ACTIVE;

@Column(name = "password")
private String password; // nullable - only for PRIVATE sessions

// Participant Management
@Column(name = "max_participants")
private Integer maxParticipants;

@Column(name = "current_participants")
private Integer currentParticipants = 0;

// Images
@Column(name = "profile_image_url")
private String profileImageUrl;

@Column(name = "cover_image_url")
private String coverImageUrl;

// Timestamps
@Column(name = "created_at", updatable = false)
private LocalDateTime createdAt;

@Column(name = "updated_at")
private LocalDateTime updatedAt;
```

**Add lifecycle methods:**

```java
@PrePersist
protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
}

@PreUpdate
protected void onUpdate() {
    updatedAt = LocalDateTime.now();
}
```

##### 2. Create Enums

**SessionType.java**:

```java
package com.appdev.academeet.model;

public enum SessionType {
    PUBLIC,
    PRIVATE
}
```

**SessionStatus.java**:

```java
package com.appdev.academeet.model;

public enum SessionStatus {
    ACTIVE,
    COMPLETED,
    DELETED,
    CANCELLED
}
```

##### 3. Update SessionService.java

**Add methods:**

```java
// Validation
public boolean validateSessionPassword(Long sessionId, String password);
public boolean checkParticipantLimit(Long sessionId);

// Participant Management
public void incrementParticipant(Long sessionId);
public void decrementParticipant(Long sessionId);

// Status Management
public void updateSessionStatus(Long sessionId, SessionStatus newStatus);

// Image Upload
public String uploadSessionImage(Long sessionId, MultipartFile file, String imageType);
```

##### 4. Update SessionController.java

**Add endpoints:**

```java
@PostMapping("/{id}/join")
public ResponseEntity<?> joinSession(@PathVariable Long id, @RequestBody JoinSessionRequest request);

@PatchMapping("/{id}/status")
public ResponseEntity<?> updateSessionStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request);

@GetMapping
public ResponseEntity<List<SessionDTO>> getSessionsByStatus(@RequestParam(required = false) SessionStatus status);

@PostMapping("/{id}/upload-image")
public ResponseEntity<?> uploadSessionImage(@PathVariable Long id, @RequestParam("file") MultipartFile file, @RequestParam("type") String type);
```

#### **Frontend Tasks**

##### 1. Create SessionPrivacySelector Component

**Location**: `frontend/src/components/session/SessionPrivacySelector.jsx`

```jsx
import React from "react";

const SessionPrivacySelector = ({
  sessionType,
  password,
  onChange,
  onPasswordChange,
}) => {
  return (
    <div className="mb-6">
      <h4 className="text-white font-semibold mb-3">Session Privacy</h4>

      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sessionType"
            value="PUBLIC"
            checked={sessionType === "PUBLIC"}
            onChange={onChange}
            className="accent-indigo-500"
          />
          <span className="text-gray-300">Public</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sessionType"
            value="PRIVATE"
            checked={sessionType === "PRIVATE"}
            onChange={onChange}
            className="accent-indigo-500"
          />
          <span className="text-gray-300">Private</span>
        </label>
      </div>

      {sessionType === "PRIVATE" && (
        <input
          type="password"
          name="password"
          value={password}
          onChange={onPasswordChange}
          placeholder="Enter session password (min 6 characters)"
          className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          minLength={6}
          required
        />
      )}
    </div>
  );
};

export default SessionPrivacySelector;
```

##### 2. Create SessionStatusBadge Component

**Location**: `frontend/src/components/session/SessionStatusBadge.jsx`

```jsx
import React from "react";

const SessionStatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "COMPLETED":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "DELETED":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "CANCELLED":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusStyle()}`}
    >
      {status}
    </span>
  );
};

export default SessionStatusBadge;
```

##### 3. Update Dashboard to Filter Active Sessions

**Location**: Update existing dashboard components

- Filter sessions to show only `status: 'ACTIVE'`
- Sort by `startTime` in ascending order
- Add SessionStatusBadge to session cards

---

### **🔔 BRANCH 2: `feature/reminder/notification_system`**

**Priority: HIGH** | **Estimated Time: 2-3 days**

#### **Backend Tasks**

##### 1. Verify Reminder Entity

**Location**: `backend/src/main/java/com/appdev/academeet/model/Reminder.java`

**Ensure these fields exist:**

```java
@Column(name = "reminder_message")
private String reminderMessage;

@Enumerated(EnumType.STRING)
@Column(name = "notification_type")
private NotificationType notificationType = NotificationType.IN_APP;
```

##### 2. Complete ReminderService.java

**Add methods:**

```java
public Reminder createReminder(Long userId, Long sessionId, LocalDateTime reminderTime);
public List<Reminder> getRemindersByUser(Long userId);
public void markReminderAsSent(Long reminderId);
public void deleteReminder(Long reminderId);
public Reminder updateReminderTime(Long reminderId, LocalDateTime newTime);
public List<Reminder> getPendingReminders(Long userId);
```

##### 3. Complete ReminderController.java

**Add endpoints:**

```java
@PostMapping
public ResponseEntity<Reminder> createReminder(@RequestBody ReminderRequest request);

@GetMapping
public ResponseEntity<List<Reminder>> getUserReminders(@RequestParam Long userId);

@PatchMapping("/{id}")
public ResponseEntity<Reminder> updateReminder(@PathVariable Long id, @RequestBody ReminderRequest request);

@DeleteMapping("/{id}")
public ResponseEntity<?> deleteReminder(@PathVariable Long id);

@GetMapping("/pending")
public ResponseEntity<List<Reminder>> getPendingReminders(@RequestParam Long userId);
```

#### **Frontend Tasks**

##### 1. Create ReminderPanel Component

**Location**: `frontend/src/components/reminder/ReminderPanel.jsx`

```jsx
import React, { useState, useEffect } from "react";

const ReminderPanel = ({ userId }) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, [userId]);

  const fetchReminders = async () => {
    try {
      const response = await fetch(`/api/reminders?userId=${userId}`);
      const data = await response.json();
      setReminders(data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-gray-400">Loading reminders...</div>;

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6">
      <h3 className="text-white font-bold text-xl mb-4">Upcoming Reminders</h3>

      {reminders.length === 0 ? (
        <p className="text-gray-500 text-sm">No reminders set</p>
      ) : (
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-medium text-sm">
                    {reminder.session.title}
                  </h4>
                  <p className="text-gray-400 text-xs mt-1">
                    Remind me at:{" "}
                    {new Date(reminder.reminderTime).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReminderPanel;
```

##### 2. Create ReminderBell Component

**Location**: `frontend/src/components/reminder/ReminderBell.jsx`

```jsx
import React, { useState, useEffect } from "react";

const ReminderBell = ({ userId }) => {
  const [pendingCount, setPendingCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [userId]);

  const fetchPendingCount = async () => {
    try {
      const response = await fetch(`/api/reminders/pending?userId=${userId}`);
      const data = await response.json();
      setPendingCount(data.length);
    } catch (error) {
      console.error("Error fetching pending reminders:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {pendingCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl z-50">
          <ReminderPanel userId={userId} />
        </div>
      )}
    </div>
  );
};

export default ReminderBell;
```

---

### **💬 BRANCH 3: `feature/session/comments_and_replies`**

**Priority: HIGH** | **Estimated Time: 2-3 days**

#### **Backend Tasks**

##### 1. Update Comment Entity

**Location**: `backend/src/main/java/com/appdev/academeet/model/Comment.java`

**Add parent-child relationship:**

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "parent_comment_id")
private Comment parentComment;

@OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL)
private List<Comment> replies = new ArrayList<>();

@Column(name = "updated_at")
private LocalDateTime updatedAt;

@Column(name = "is_edited")
private boolean isEdited = false;

@Column(name = "reply_count")
private Integer replyCount = 0;
```

##### 2. Complete CommentService.java

**Add methods:**

```java
public Comment createComment(Long userId, Long sessionId, String content, Long parentCommentId);
public List<Comment> getSessionComments(Long sessionId);
public Comment updateComment(Long commentId, String newContent);
public void deleteComment(Long commentId);
public List<Comment> getReplies(Long parentCommentId);
```

##### 3. Complete CommentController.java

**Add endpoints:**

```java
@PostMapping("/sessions/{sessionId}/comments")
public ResponseEntity<Comment> createComment(@PathVariable Long sessionId, @RequestBody CommentRequest request);

@GetMapping("/sessions/{sessionId}/comments")
public ResponseEntity<List<Comment>> getSessionComments(@PathVariable Long sessionId);

@PatchMapping("/comments/{id}")
public ResponseEntity<Comment> updateComment(@PathVariable Long id, @RequestBody CommentRequest request);

@DeleteMapping("/comments/{id}")
public ResponseEntity<?> deleteComment(@PathVariable Long id);

@PostMapping("/comments/{id}/reply")
public ResponseEntity<Comment> replyToComment(@PathVariable Long id, @RequestBody CommentRequest request);
```

#### **Frontend Tasks**

##### 1. Create CommentPanel Component

**Location**: `frontend/src/components/session/CommentPanel.jsx`

```jsx
import React, { useState, useEffect } from "react";
import CommentCard from "./CommentCard";
import CommentInput from "./CommentInput";

const CommentPanel = ({ sessionId, userId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [sessionId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (content) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, userId }),
      });

      if (response.ok) {
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6">
      <h3 className="text-white font-bold text-xl mb-4">Comments</h3>

      <CommentInput onSubmit={handleAddComment} />

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="text-gray-400">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-8">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              userId={userId}
              onReply={fetchComments}
              onUpdate={fetchComments}
              onDelete={fetchComments}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentPanel;
```

---

## 👤 MARK - FRONTEND REORGANIZATION & UI

### **🗂️ BRANCH 1: `refactor/frontend/component_reorganization`**

**Priority: MEDIUM** | **Estimated Time: 2-3 days**

#### **Step 1: Create New Folder Structure**

**Create these directories:**

```
frontend/src/components/
├── common/
│   ├── layouts/
│   ├── ui/
│   └── FormPageHeader.jsx
├── auth/
├── session/
├── note/
├── reminder/
├── profile/
├── settings/
└── dashboard/

frontend/src/services/
├── authService.js (existing)
├── noteService.js (existing)
├── sessionService.js (NEW)
├── reminderService.js (NEW)
└── index.js
```

#### **Step 2: Strategic File Merging**

##### Merge #1: Create `SessionFormFields.jsx`

**Location**: `frontend/src/components/session/SessionFormFields.jsx`
**Merge**: `SessionTitleInput.jsx` + `LocationInput.jsx` + `DescriptionPanel.jsx`

```jsx
import React from "react";

// ===== SESSION TITLE INPUT =====
export const SessionTitleInput = ({ value, onChange }) => (
  <input
    type="text"
    name="title"
    value={value}
    onChange={onChange}
    placeholder="Enter Session Name"
    className="w-full bg-transparent text-4xl font-bold text-indigo-300 placeholder-indigo-300/50 focus:outline-none focus:text-white transition-colors"
  />
);

// ===== LOCATION INPUT WITH TYPE SELECTOR =====
export const LocationInput = ({ locationType, location, onChange }) => (
  <div className="mb-6">
    <div className="mb-3 flex gap-2">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="locationType"
          value="in-person"
          checked={locationType === "in-person"}
          onChange={onChange}
          className="accent-indigo-500"
        />
        <span className="text-sm text-gray-300">In-Person</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="locationType"
          value="online"
          checked={locationType === "online"}
          onChange={onChange}
          className="accent-indigo-500"
        />
        <span className="text-sm text-gray-300">Online</span>
      </label>
    </div>

    <input
      type="text"
      name="location"
      value={location}
      onChange={onChange}
      placeholder={
        locationType === "online" ? "Enter link or call URL" : "Enter location"
      }
      className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
    />
  </div>
);

// ===== DESCRIPTION PANEL =====
export const DescriptionPanel = ({ value, onChange }) => (
  <div className="col-span-2 bg-[#1a1a1a] rounded-2xl p-6">
    <h3 className="text-white font-bold text-xl mb-6">Session Overview</h3>
    <textarea
      name="description"
      value={value}
      onChange={onChange}
      placeholder="Describe the session..."
      rows={18}
      className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-gray-300 text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors"
    />
  </div>
);

export default { SessionTitleInput, LocationInput, DescriptionPanel };
```

##### Merge #2: Create `NoteFormFields.jsx`

**Location**: `frontend/src/components/note/NoteFormFields.jsx`
**Merge**: `NoteTitleInput.jsx` + `AuthorFooter.jsx`

```jsx
import React from "react";

// ===== NOTE TITLE INPUT =====
export const NoteTitleInput = ({ value, onChange }) => (
  <div className="mb-6">
    <input
      type="text"
      name="title"
      value={value}
      onChange={onChange}
      placeholder="Untitled Note"
      className="w-full bg-transparent text-4xl font-bold text-indigo-300 placeholder-indigo-300/50 focus:outline-none focus:text-white transition-colors"
    />
  </div>
);

// ===== AUTHOR FOOTER =====
export const AuthorFooter = ({ userName }) => {
  if (!userName) return null;

  return <p className="mt-4 text-xs text-gray-600">Author: {userName}</p>;
};

// ===== EDITOR STATS (NEW ENHANCEMENT) =====
export const EditorStats = ({ content }) => {
  const words = content
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const chars = content.length;

  return (
    <div className="mt-2 text-xs text-gray-500 flex gap-4">
      <span>{words} words</span>
      <span>{chars} characters</span>
    </div>
  );
};

export default { NoteTitleInput, AuthorFooter, EditorStats };
```

##### Merge #3: Create Shared `FormPageHeader.jsx`

**Location**: `frontend/src/components/common/FormPageHeader.jsx`
**Merge**: Both `PageHeader.jsx` files (createSession & createNote)

```jsx
import React from "react";

const FormPageHeader = ({
  onBack,
  onSubmit,
  isSubmitting,
  submitLabel = "Create",
}) => (
  <div className="flex items-center justify-between mb-12">
    <button
      type="button"
      onClick={onBack}
      className="flex items-center gap-3 text-white hover:text-indigo-400 transition-colors group"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back
    </button>

    <button
      type="submit"
      disabled={isSubmitting}
      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      {isSubmitting ? `${submitLabel}ing...` : submitLabel}
    </button>
  </div>
);

export default FormPageHeader;
```

#### **Step 3: Component Migration Map**

**Move these files:**

```
OLD LOCATION → NEW LOCATION

createSession/
├── SessionHeader.jsx → session/SessionHeader.jsx
├── SessionProfilePic.jsx → session/SessionProfilePic.jsx
├── DetailsPanel.jsx → session/DetailsPanel.jsx
├── DateSelector.jsx → session/DateSelector.jsx
├── TimeSelector.jsx → session/TimeSelector.jsx
└── [DELETE FILES: SessionTitleInput, LocationInput, DescriptionPanel, PageHeader]

createNote/
├── EditorToolbar.jsx → note/EditorToolbar.jsx
├── ToolbarButton.jsx → note/ToolbarButton.jsx
├── RichTextEditor.jsx → note/RichTextEditor.jsx
└── [DELETE FILES: NoteTitleInput, AuthorFooter, PageHeader]

sessions/
└── Sessions.jsx → session/SessionList.jsx

notes/
└── Notes.jsx → note/NoteList.jsx

login/ → auth/
signup/ → auth/

profile/ → profile/ (same name)
settings/ → settings/ (same name)
dashboard/ → dashboard/ (same name)
```

#### **Step 4: Update Import Statements**

**Update these files with new import paths:**

```
pages/CreateSessionPage.jsx:
- import FormPageHeader from '../components/common/FormPageHeader'
- import { SessionTitleInput, DescriptionPanel } from '../components/session/SessionFormFields'
- import SessionHeader from '../components/session/SessionHeader'
- import DetailsPanel from '../components/session/DetailsPanel'

pages/CreateNotePage.jsx:
- import FormPageHeader from '../components/common/FormPageHeader'
- import { NoteTitleInput, AuthorFooter } from '../components/note/NoteFormFields'
- import EditorToolbar from '../components/note/EditorToolbar'
- import RichTextEditor from '../components/note/RichTextEditor'
```

#### **Step 5: Merge Logic into Services**

**Create `sessionService.js`:**

```javascript
// Merge logic/createSession/* and logic/sessions/*
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export const useSessionForm = () => {
  const navigate = useNavigate();
  const { getUserId } = useUser();

  const [sessionData, setSessionData] = useState({
    title: "",
    month: "",
    day: "",
    year: "",
    startTime: "",
    endTime: "",
    location: "",
    locationType: "in-person",
    sessionType: "PUBLIC",
    password: "",
    maxParticipants: null,
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setSessionData({ ...sessionData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userId = getUserId();
    if (!userId) {
      alert("User not logged in");
      setIsSubmitting(false);
      return;
    }

    try {
      const headers = { "Content-Type": "application/json" };
      if (userId) {
        headers["X-User-Id"] = userId.toString();
      }

      const res = await fetch(`http://localhost:8080/api/sessions`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(sessionData),
      });

      if (!res.ok) throw new Error("Failed to create session");

      const result = await res.json();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Error creating session: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return {
    sessionData,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleBack,
  };
};
```

#### **Step 6: Create Index Files**

**Create `session/index.js`:**

```javascript
export { default as SessionForm } from "./SessionForm";
export { default as SessionHeader } from "./SessionHeader";
export { default as SessionProfilePic } from "./SessionProfilePic";
export { default as DetailsPanel } from "./DetailsPanel";
export { default as DateSelector } from "./DateSelector";
export { default as TimeSelector } from "./TimeSelector";
export { default as SessionCard } from "./SessionCard";
export { default as SessionList } from "./SessionList";
export {
  SessionTitleInput,
  LocationInput,
  DescriptionPanel,
} from "./SessionFormFields";
```

---

### **🔧 BRANCH 2: `fix/session/meeting_to_session_terminology`**

**Priority: LOW** | **Estimated Time: 0.5 days**

#### **Tasks**

1. **Find and Replace** across entire project:

   - "meeting" → "session" (case-insensitive)
   - "Meeting" → "Session"
   - "MEETING" → "SESSION"

2. **Files to check:**

   - All `.jsx` files
   - All `.js` files
   - All placeholder text
   - All button labels
   - All error messages

3. **Update placeholders:**
   - "Enter Meeting Name" → "Enter Session Name"
   - "Meeting Overview" → "Session Overview"
   - "Describe the meeting..." → "Describe the session..."

---

### **🎨 BRANCH 3: `chore/notes/enrich_create_note_ui`**

**Priority: MEDIUM** | **Estimated Time: 1-2 days**

#### **Tasks**

##### 1. Remove Code Artifacts

- Remove any `""`, unused code blocks, or `clr` commands
- Clean up console logs and debug code
- Remove commented-out code

##### 2. Add "Link to Sessions" Feature

**Location**: Update `EditorToolbar.jsx`

**Add button:**

```jsx
<ToolbarButton
  icon={<LinkSessionIcon />}
  onClick={onLinkSession}
  title="Link to Session"
/>
```

**Create LinkSessionModal:**

```jsx
const LinkSessionModal = ({
  isOpen,
  onClose,
  onLinkSession,
  availableSessions,
}) => {
  const [selectedSessions, setSelectedSessions] = useState([]);

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 w-96">
        <h3 className="text-white font-bold text-lg mb-4">Link to Sessions</h3>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {availableSessions.map((session) => (
            <label
              key={session.id}
              className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedSessions.includes(session.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSessions([...selectedSessions, session.id]);
                  } else {
                    setSelectedSessions(
                      selectedSessions.filter((id) => id !== session.id)
                    );
                  }
                }}
                className="accent-indigo-500"
              />
              <div>
                <div className="text-white text-sm">{session.title}</div>
                <div className="text-gray-400 text-xs">
                  {session.month} {session.day}, {session.year}
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              onLinkSession(selectedSessions);
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Link Sessions
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
```

##### 3. Fix Favorite Feature

**Location**: Update existing Notes components

**Fix the toggle logic:**

```jsx
const handleToggleFavourite = async (noteId) => {
  try {
    const response = await fetch(`/api/notes/${noteId}/favorite`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setNotes(
        notes.map((note) =>
          note.id === noteId
            ? { ...note, isFavourite: !note.isFavourite }
            : note
        )
      );
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
  }
};
```

##### 4. Icon Consistency Audit

**Tasks:**

- Create comprehensive icon list
- Replace all inconsistent icons with unified versions
- Ensure all icons are same size (w-4 h-4 or w-5 h-5)
- Use consistent colors (text-indigo-400, text-gray-400, etc.)

##### 5. Enhance Editor Features

**Add to EditorToolbar:**

```jsx
// Table insertion
<ToolbarButton
  icon={<TableIcon />}
  onClick={() => onFormat('insertTable')}
  title="Insert Table"
/>

// Quote/blockquote
<ToolbarButton
  icon={<QuoteIcon />}
  onClick={() => onFormat('formatBlock', 'blockquote')}
  title="Quote"
/>

// Image insertion
<ToolbarButton
  icon={<ImageIcon />}
  onClick={() => onInsertImage()}
  title="Insert Image"
/>
```

---

### **👤 BRANCH 4: `feature/profile/year_level_and_images`**

**Priority: MEDIUM** | **Estimated Time: 1-2 days**

#### **Tasks**

##### 1. Add Year Level Display

**Location**: Update `ProfileCard.jsx`

**Add to profile info section:**

```jsx
<p className="text-gray-400 text-xs">
  {userData.school}, {userData.program}, Year {userData.yearLevel}
</p>
```

##### 2. Update ProfileForm in Settings

**Location**: Update `ProfileForm.jsx`

**Add year level field:**

```jsx
<FormField label="Year Level">
  <select
    name="yearLevel"
    value={formData.yearLevel}
    onChange={handleChange}
    className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-indigo-500"
  >
    <option value="">Select Year Level</option>
    <option value={1}>1st Year</option>
    <option value={2}>2nd Year</option>
    <option value={3}>3rd Year</option>
    <option value={4}>4th Year</option>
    <option value={5}>5th Year+</option>
  </select>
</FormField>
```

##### 3. Implement Image Upload Functionality

**Location**: Update `ProfilePictureUpload.jsx` and `CoverImageUpload.jsx`

**Profile Picture Upload:**

```jsx
const ProfilePictureUpload = ({ currentImage, userId, onImageUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `/api/users/${userId}/upload-profile-image`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        onImageUpdate(result.imageUrl);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
      setPreview(currentImage); // Revert preview
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-700">
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>

      <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 rounded-full p-2 cursor-pointer transition-colors">
        <svg
          className="w-4 h-4 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="m14.06 9.02.92.92L9.06 15.96H8.14v-.92l5.92-5.92M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
        </svg>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </label>

      {uploading && (
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};
```

---

## 👤 RICHEMMAE - NOTE IMAGE SUPPORT

### **📷 BRANCH: `feature/note/image_support`**

**Priority: MEDIUM** | **Estimated Time: 1-2 days**

**⏳ Status: PENDING CLARIFICATION**

#### **Tentative Tasks** (Subject to your clarification)

##### 1. Update Note Entity

**Location**: `backend/src/main/java/com/appdev/academeet/model/Note.java`

**Add image field:**

```java
@Column(name = "image_url")
private String imageUrl;

@Column(name = "image_path")
private String imagePath;
```

##### 2. Create Image Upload Endpoint

**Location**: `backend/src/main/java/com/appdev/academeet/controller/NoteController.java`

**Add endpoint:**

```java
@PostMapping("/{id}/upload-image")
public ResponseEntity<?> uploadNoteImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
    try {
        String imageUrl = noteService.uploadNoteImage(id, file);
        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
```

##### 3. Add Image Support to RichTextEditor

**Location**: `frontend/src/components/note/RichTextEditor.jsx`

**Add image insertion functionality:**

```jsx
const insertImage = (imageUrl) => {
  const img = document.createElement("img");
  img.src = imageUrl;
  img.style.maxWidth = "100%";
  img.style.height = "auto";
  img.style.margin = "10px 0";

  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.insertNode(img);
  }
};
```

##### 4. Update NoteCard to Display Images

**Location**: `frontend/src/components/note/NoteCard.jsx`

**Update content rendering to show images:**

```jsx
<div
  className="text-xs text-gray-500 line-clamp-5 overflow-hidden"
  dangerouslySetInnerHTML={{ __html: note.content }}
  style={{
    wordBreak: "break-word",
    "& img": { maxWidth: "100%", height: "auto" },
  }}
/>
```

#### **❓ Questions for Richemmae**

1. Where exactly is the image path missing? (Database, UI, file system?)
2. Should images be uploaded directly or linked from external sources?
3. What image formats should be supported? (JPG, PNG, GIF?)
4. What's the maximum file size limit?
5. Should images be stored locally or on cloud storage?
6. Should there be image editing features (crop, resize, etc.)?

---

## 🧪 CODE QUALITY GUIDELINES

### **File Structure Standards**

```
components/feature/
├── FeatureMain.jsx          # Main component
├── FeatureCard.jsx          # Display component
├── FeatureForm.jsx          # Form component
├── FeatureFormFields.jsx    # Input components (merged)
├── FeatureModal.jsx         # Modal/dialog
├── FeatureList.jsx          # List/grid view
└── index.js                 # Clean exports
```

### **Component Standards**

- **Max 150 lines per component** (split if larger)
- **Use TypeScript props** (optional but recommended)
- **Consistent naming**: PascalCase for components, camelCase for functions
- **Error boundaries** for production components
- **Loading states** for async operations

### **CSS Standards**

- **Use Tailwind classes** consistently
- **Color palette**: Indigo for primary, gray for neutral
- **Responsive design**: Start with mobile-first
- **Dark theme**: Maintain current dark color scheme

### **API Standards**

- **RESTful endpoints**: `/api/resource/action`
- **Consistent response format**: `{ data, message, error }`
- **HTTP status codes**: 200, 201, 400, 401, 404, 500
- **Error handling**: Try-catch blocks with meaningful messages

---

## ✅ TESTING & VALIDATION

### **Before Committing**

1. **Component renders** without errors
2. **All imports resolve** correctly
3. **No console errors** in browser
4. **Responsive design** works on mobile/desktop
5. **API endpoints** return expected data
6. **Database changes** don't break existing data

### **Testing Checklist**

- [ ] Component mounts successfully
- [ ] Props are passed correctly
- [ ] State updates work as expected
- [ ] API calls handle success/error cases
- [ ] Form validation works
- [ ] File uploads complete successfully
- [ ] Responsive layout looks good
- [ ] Dark theme colors are consistent

### **Performance Checks**

- [ ] No unnecessary re-renders
- [ ] Images are optimized
- [ ] API calls are not excessive
- [ ] Large lists use pagination/virtualization
- [ ] Bundle size is reasonable

---

## 🚀 DEPLOYMENT NOTES

### **Environment Variables**

```bash
# Frontend (.env)
REACT_APP_API_URL=http://localhost:8080
REACT_APP_UPLOAD_MAX_SIZE=5242880

# Backend (application.properties)
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
file.upload.dir=./uploads/
```

### **Database Migrations**

Before deploying, ensure database schema supports new fields:

- Session: sessionType, status, password, maxParticipants, etc.
- Comment: parentCommentId, updatedAt, isEdited, replyCount
- Note: imageUrl, imagePath (if Richemmae confirms)
- Reminder: reminderMessage, notificationType

---

## 🎯 SUCCESS METRICS

### **Code Organization**

- ✅ **28% fewer files** through strategic merging
- ✅ **Feature-based structure** instead of page-based
- ✅ **Consistent naming** across frontend and backend
- ✅ **Shared components** reduce duplication

### **Feature Completeness**

- ✅ **Session privacy** with password protection
- ✅ **Session status** management and filtering
- ✅ **Reminder notifications** with multiple types
- ✅ **Threaded comments** with reply support
- ✅ **Enhanced note editor** with new features
- ✅ **Profile image management** with upload

### **User Experience**

- ✅ **Faster load times** with optimized components
- ✅ **Better mobile experience** with responsive design
- ✅ **Consistent UI/UX** across all features
- ✅ **Improved accessibility** with proper labels

---

## 📞 COMMUNICATION

### **Daily Standups**

- **What did you complete yesterday?**
- **What will you work on today?**
- **Any blockers or questions?**

### **Branch Management**

- **Create feature branch** from main
- **Regular commits** with descriptive messages
- **Pull request** when feature is complete
- **Code review** before merging

### **Issue Reporting**

- **Screenshots** for UI issues
- **Console logs** for JavaScript errors
- **Stack traces** for backend errors
- **Steps to reproduce** for bugs

---

**Good luck with the implementation! 🚀**

**Remember**: This is a living document. Update it as requirements change or new issues arise.
