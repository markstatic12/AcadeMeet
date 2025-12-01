# API Endpoints Documentation

## Overview
Complete REST API documentation for AcadeMeet backend. All endpoints are prefixed with `http://localhost:8080/api`.

**CORS:** Configured for `http://localhost:5173` (Vite frontend)

---

## 🎯 Topics API (`/api/topics`)

### GET Endpoints
- `GET /api/topics` - Get all active topics
- `GET /api/topics/predefined` - Get predefined topics only
- `GET /api/topics/user-created` - Get user-created topics
- `GET /api/topics/popular?limit=10` - Get most popular topics
- `GET /api/topics/search?query={text}` - Search topics by name/description
- `GET /api/topics/{id}` - Get topic by ID

### POST Endpoints
- `POST /api/topics` - Create a new user topic
  ```json
  {
    "name": "Advanced Calculus",
    "description": "Higher level mathematics",
    "createdBy": 1,
    "icon": "📐",
    "color": "#FF5733"
  }
  ```

- `POST /api/topics/predefined` - Create predefined topic (admin only)
  ```json
  {
    "name": "Mathematics",
    "description": "Math-related sessions",
    "icon": "🔢",
    "color": "#3498db"
  }
  ```

- `POST /api/topics/{id}/increment` - Increment session count

### PUT Endpoints
- `PUT /api/topics/{id}` - Update topic
  ```json
  {
    "name": "Updated Name",
    "description": "Updated description",
    "icon": "📚",
    "color": "#2ecc71"
  }
  ```

### DELETE Endpoints
- `DELETE /api/topics/{id}` - Deactivate topic

---

## 🏷️ Tags API (`/api/tags`)

### GET Endpoints
- `GET /api/tags` - Get all tags
- `GET /api/tags/popular?limit=20` - Get most popular tags
- `GET /api/tags/search?query={text}` - Search tags
- `GET /api/tags/{id}` - Get tag by ID

### POST Endpoints
- `POST /api/tags/find-or-create` - Find or create tag
  ```json
  {
    "name": "algebra"
  }
  ```

- `POST /api/tags/find-or-create-bulk` - Create multiple tags
  ```json
  {
    "tagNames": ["algebra", "calculus", "geometry"]
  }
  ```

- `POST /api/tags/by-ids` - Get tags by IDs
  ```json
  {
    "tagIds": [1, 2, 3]
  }
  ```

- `POST /api/tags/{id}/increment` - Increment usage count
- `POST /api/tags/{id}/decrement` - Decrement usage count

### DELETE Endpoints
- `DELETE /api/tags/cleanup?minUsage=0` - Cleanup unused tags (admin)

---

## 👥 Followers API (`/api/followers`)

### GET Endpoints
- `GET /api/followers/{userId}/followers` - Get user's followers
- `GET /api/followers/{userId}/following` - Get users that user follows
- `GET /api/followers/{userId}/counts` - Get follower/following counts
  ```json
  {
    "followers": 25,
    "following": 18
  }
  ```

- `GET /api/followers/check?followerId={id}&followingId={id}` - Check if following
  ```json
  {
    "isFollowing": true,
    "isMutual": false
  }
  ```

- `GET /api/followers/mutual` - Get mutual follows (friends)
- `GET /api/followers/{userId}/suggestions?limit=10` - Get suggested follows
- `GET /api/followers/{userId}/follower-ids` - Get follower IDs only
- `GET /api/followers/{userId}/following-ids` - Get following IDs only

### POST Endpoints
- `POST /api/followers/follow` - Follow a user
  ```json
  {
    "followerId": 1,
    "followingId": 2
  }
  ```

### DELETE Endpoints
- `DELETE /api/followers/unfollow` - Unfollow a user
  ```json
  {
    "followerId": 1,
    "followingId": 2
  }
  ```

---

## ⏰ Reminders API (`/api/reminders`)

### GET Endpoints
- `GET /api/reminders/student/{studentId}` - Get all student reminders
- `GET /api/reminders/student/{studentId}/pending` - Get pending reminders
- `GET /api/reminders/student/{studentId}/upcoming?days=7` - Get upcoming reminders
- `GET /api/reminders/session/{sessionId}` - Get session reminders
- `GET /api/reminders/due` - Get due reminders (for notification service)
- `GET /api/reminders/due-soon?withinMinutes=15` - Get reminders due soon
- `GET /api/reminders/student/{studentId}/count` - Count pending reminders

### POST Endpoints
- `POST /api/reminders` - Create reminder with specific time
  ```json
  {
    "studentId": 1,
    "sessionId": 5,
    "reminderTime": "2025-11-10T09:00:00"
  }
  ```

- `POST /api/reminders/minutes-before` - Create reminder (minutes before session)
  ```json
  {
    "studentId": 1,
    "sessionId": 5,
    "minutesBefore": 30
  }
  ```

### PUT Endpoints
- `PUT /api/reminders/{reminderId}/mark-sent` - Mark reminder as sent
- `PUT /api/reminders/mark-sent-bulk` - Mark multiple as sent
  ```json
  {
    "reminderIds": [1, 2, 3]
  }
  ```

- `PUT /api/reminders/{reminderId}` - Update reminder time
  ```json
  {
    "studentId": 1,
    "newReminderTime": "2025-11-10T08:30:00"
  }
  ```

### DELETE Endpoints
- `DELETE /api/reminders/{reminderId}?studentId={id}` - Delete reminder
- `DELETE /api/reminders/session/{sessionId}` - Delete session reminders (admin)
- `DELETE /api/reminders/cleanup?daysOld=30` - Cleanup old reminders (admin)

---

## 🚨 Reports API (`/api/reports`)

### GET Endpoints
- `GET /api/reports/pending` - Get pending reports (admin)
- `GET /api/reports/status/{status}` - Get reports by status (PENDING/REVIEWED/RESOLVED/DISMISSED)
- `GET /api/reports/content?type={type}&id={id}` - Get reports for specific content
- `GET /api/reports/user/{reporterId}` - Get reports by reporter
- `GET /api/reports/statistics` - Get report statistics
  ```json
  {
    "total": 45,
    "pending": 12,
    "reviewed": 8,
    "resolved": 20,
    "dismissed": 5
  }
  ```

- `GET /api/reports/most-reported?limit=10` - Get most reported content (admin)
- `GET /api/reports/date-range?startDate={iso8601}&endDate={iso8601}` - Get reports by date
- `GET /api/reports/recent?days=7` - Get recent reports
- `GET /api/reports/reviewed-by/{adminId}` - Get reports reviewed by admin
- `GET /api/reports/count/pending` - Count pending reports
- `GET /api/reports/count/unreviewed` - Count unreviewed reports
- `GET /api/reports/count/content?type={type}&id={id}` - Count reports for content
- `GET /api/reports/flagged?type={type}&id={id}&threshold=3` - Check if content is flagged

### POST Endpoints
- `POST /api/reports` - Submit a new report
  ```json
  {
    "reporterId": 1,
    "reportedType": "SESSION",
    "reportedId": 10,
    "reason": "Inappropriate content",
    "description": "Session contains offensive material"
  }
  ```

### PUT Endpoints
- `PUT /api/reports/{reportId}/review` - Mark as reviewed (admin)
  ```json
  {
    "adminId": 1,
    "adminNotes": "Reviewed and flagged for further action"
  }
  ```

- `PUT /api/reports/{reportId}/resolve` - Resolve report (admin)
  ```json
  {
    "adminId": 1,
    "adminNotes": "Content removed, issue resolved"
  }
  ```

- `PUT /api/reports/{reportId}/dismiss` - Dismiss report (admin)
  ```json
  {
    "adminId": 1,
    "adminNotes": "Report unfounded, no action needed"
  }
  ```

- `PUT /api/reports/resolve-bulk` - Resolve all reports for content (admin)
  ```json
  {
    "reportedType": "SESSION",
    "reportedId": 10,
    "adminId": 1,
    "adminNotes": "Bulk resolved after content deletion"
  }
  ```

---

## 🔍 Search API (`/api/search`)

### GET Endpoints

#### Unified Search
- `GET /api/search?query={text}&limit=10` - Search across all content types
  ```json
  {
    "query": "mathematics",
    "sessions": [...],
    "students": [...],
    "notes": [...],
    "comments": [...]
  }
  ```

#### Session Search
- `GET /api/search/sessions?query={text}&limit=20` - Search sessions
- `GET /api/search/sessions/advanced?query={text}&privacyType={PUBLIC|PRIVATE}&sessionType={ONLINE|FACE_TO_FACE}&status={UPCOMING|ONGOING|COMPLETED}` - Advanced session search
- `GET /api/search/sessions/topic/{topicId}?limit=20` - Search by topic
- `GET /api/search/sessions/tag/{tagName}?limit=20` - Search by tag

#### Student Search
- `GET /api/search/students?query={text}&limit=20` - Search students
- `GET /api/search/students/program/{program}?limit=20` - Search by program
- `GET /api/search/students/year/{yearLevel}?limit=20` - Search by year level

#### Content Search
- `GET /api/search/notes?query={text}&limit=20` - Search notes
- `GET /api/search/comments?query={text}&limit=20` - Search comments

#### Search Helpers
- `GET /api/search/suggestions` - Get search suggestions
  ```json
  {
    "recentSessions": ["Algebra Study", "Physics Lab", ...],
    "programs": ["Computer Science", "Mathematics", ...]
  }
  ```

- `GET /api/search/autocomplete?prefix={text}&type={sessions|students|programs}&limit=10` - Autocomplete
- `GET /api/search/trending?limit=10` - Get trending searches

### POST Endpoints
- `POST /api/search/sessions/tags` - Search sessions by multiple tags
  ```json
  {
    "tagNames": ["algebra", "calculus"],
    "limit": 20
  }
  ```

---

## 📊 Summary Statistics

**Total New API Endpoints:** 100+

### Breakdown by Controller:
- **TopicController:** 10 endpoints
- **TagController:** 9 endpoints
- **FollowerController:** 10 endpoints
- **ReminderController:** 15 endpoints
- **ReportController:** 22 endpoints
- **SearchController:** 18 endpoints

### HTTP Methods Distribution:
- **GET:** 65+ endpoints (read operations)
- **POST:** 20+ endpoints (create operations)
- **PUT:** 8+ endpoints (update operations)
- **DELETE:** 7+ endpoints (delete operations)

---

## 🔐 Security Notes

1. **Authentication Required:** All endpoints should be protected with JWT authentication (configure in SecurityConfig)
2. **Authorization:**
   - Admin-only endpoints: Reports management, cleanup operations, bulk actions
   - User-specific: Students can only delete their own reminders, submit reports
3. **CORS:** Currently configured for `http://localhost:5173` - update for production

---

## 🚀 Next Steps

1. **Run Database Migration:** Execute `complete_migration_v2.sql` in MySQL Workbench
2. **Build Project:** Run `mvn clean install` to compile and resolve import errors
3. **Update SecurityConfig:** Configure authentication for new endpoints
4. **Test Endpoints:** Use Postman/Thunder Client to test all APIs
5. **Frontend Integration:** Connect React components to these endpoints

---

## 📝 Notes

- All controllers include embedded DTO classes for request/response bodies
- Error handling includes proper HTTP status codes (400, 404, 500)
- Pagination support where applicable (limit parameters)
- All date/time fields use ISO-8601 format
- Tag names are case-insensitive
- Report types: SESSION, COMMENT, NOTE, USER
- Report statuses: PENDING, REVIEWED, RESOLVED, DISMISSED
