# Axios Migration Plan for AcadeMeet Services

## Overview
Migrate all service files from `authFetch` (fetch API) to `apiClient` (axios) for consistency, better error handling, and automatic token refresh.

## Current State
- `apiClient.js` - Already configured with axios, withCredentials, auto-refresh
- `apiHelper.js` - Contains `authFetch` wrapper around fetch API
- Multiple services using `authFetch` from `apiHelper.js`

## Benefits of Migration
1. **Automatic cookie handling** - withCredentials sends HttpOnly cookies automatically
2. **Unified error handling** - axios interceptors handle 401 and refresh logic
3. **Better request/response transformation** - axios automatically handles JSON
4. **Cancellation support** - built-in request cancellation with AbortController
5. **Interceptors** - Request/response modification in one place
6. **TypeScript-ready** - Better typing support when we migrate to TS

## Services to Migrate

### High Priority (Auth-related)
1. ✅ `notificationService.js` - Already using authFetch
2. `authService.js` - Login/logout/register
3. `SessionService.js` - Session CRUD operations
4. `noteService.js` - Note operations
5. `CommentService.js` - Comment operations

### Medium Priority (Data fetching)
6. `SearchService.js` - Search functionality
7. `ReminderService.js` - Reminder operations
8. `ProfileLogic.js` - Profile data
9. `DashboardLogic.js` - Dashboard data
10. `SettingsLogic.js` - Settings updates

### Low Priority (Utilities)
11. `ImageService.js` - Image uploads (may need multipart handling)
12. `useCalendarSessions.js` - Calendar data hook

## Migration Strategy

### Pattern Replacement

**Before (authFetch):**
```javascript
import { authFetch } from './apiHelper';

async getAllNotifications() {
  const response = await authFetch('/notifications/all', {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return await response.json();
}
```

**After (apiClient):**
```javascript
import api from './apiClient';

async getAllNotifications() {
  const response = await api.get('/notifications/all');
  return response.data;
}
```

### HTTP Method Mapping
- `authFetch(url, { method: 'GET' })` → `api.get(url)`
- `authFetch(url, { method: 'POST', body: JSON.stringify(data) })` → `api.post(url, data)`
- `authFetch(url, { method: 'PUT', body: JSON.stringify(data) })` → `api.put(url, data)`
- `authFetch(url, { method: 'PATCH', body: JSON.stringify(data) })` → `api.patch(url, data)`
- `authFetch(url, { method: 'DELETE' })` → `api.delete(url)`

### Error Handling Changes

**Before:**
```javascript
if (!response.ok) {
  const errorText = await response.text();
  throw new Error(`Failed: ${errorText}`);
}
return await response.json();
```

**After:**
```javascript
// Axios throws on non-2xx status automatically
// Interceptor handles 401 refresh
try {
  const response = await api.get('/endpoint');
  return response.data;
} catch (error) {
  // error.response.data contains server error
  throw error;
}
```

## Migration Steps

### Phase 1: Core Services (Day 1)
1. Migrate `notificationService.js` ✅ (Already done)
2. Migrate `SessionService.js`
3. Migrate `noteService.js`
4. Migrate `CommentService.js`
5. Test all migrated services

### Phase 2: User Services (Day 2)
6. Migrate `authService.js`
7. Migrate `ProfileLogic.js`
8. Migrate `SettingsLogic.js`
9. Test authentication flows

### Phase 3: Secondary Services (Day 3)
10. Migrate `SearchService.js`
11. Migrate `ReminderService.js`
12. Migrate `DashboardLogic.js`
13. Migrate `useCalendarSessions.js`

### Phase 4: Special Cases (Day 4)
14. Migrate `ImageService.js` (FormData handling)
15. Remove `authFetch` from `apiHelper.js`
16. Update any remaining components using authFetch directly

## Testing Checklist

After each service migration:
- [ ] Service compiles without errors
- [ ] GET requests work
- [ ] POST requests work
- [ ] PUT/PATCH requests work
- [ ] DELETE requests work
- [ ] Error responses are handled correctly
- [ ] 401 triggers refresh automatically
- [ ] Cookies are sent with requests

## Special Considerations

### FormData/File Uploads
For `ImageService.js` and file uploads:
```javascript
const formData = new FormData();
formData.append('file', file);

const response = await api.post('/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

### Query Parameters
```javascript
// Before
const params = new URLSearchParams({ key: value });
const response = await authFetch(`/endpoint?${params}`);

// After
const response = await api.get('/endpoint', {
  params: { key: value }  // axios handles URLSearchParams
});
```

### Custom Headers
```javascript
// If specific request needs custom headers
const response = await api.get('/endpoint', {
  headers: {
    'Custom-Header': 'value'
  }
});
```

## Rollback Plan
If issues arise:
1. Keep `authFetch` in `apiHelper.js` temporarily
2. Services can import both and switch back if needed
3. Once all services migrated successfully, remove `authFetch`

## Completion Criteria
- [ ] All 14+ services migrated to apiClient
- [ ] No remaining `authFetch` imports
- [ ] All tests pass
- [ ] Manual testing of key user flows
- [ ] Documentation updated
- [ ] `authFetch` removed from codebase

## Timeline
- **Day 1-2**: Core services (Sessions, Notes, Comments, Auth)
- **Day 3**: Secondary services (Search, Reminders, Dashboard)
- **Day 4**: Special cases & cleanup
- **Day 5**: Testing & documentation

## Next Steps
1. Start with `SessionService.js` (largest service)
2. Test thoroughly with Postman/browser
3. Move to next service
4. Document any issues encountered
