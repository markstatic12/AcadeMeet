# Dashboard Components Structure

## Overview
The dashboard components have been consolidated into unified, organized files for better maintainability and cleaner imports.

## Component Files

### 1. **Calendar.jsx**
Contains all calendar-related functionality in a single file:
- `ChevronLeftIcon` - Left navigation arrow SVG
- `ChevronRightIcon` - Right navigation arrow SVG
- `CalendarHeader` - Month navigation header
- `CalendarGrid` - Calendar grid layout with day cells
- `Calendar` - Main calendar component
- `CalendarSection` - Wrapper component with session tabs

**Usage:**
```jsx
import { CalendarSection } from '../components/dashboard';
```

### 2. **Sessions.jsx**
Contains session display components:
- `SessionCard` - Individual session card with date, time, and location
- `SessionsSection` - Main container that fetches and displays up to 4 sessions from backend

**Features:**
- Fetches from `/api/sessions/all-sessions`
- Displays first 4 sessions on dashboard
- Loading and error states

**Usage:**
```jsx
import { SessionsSection, SessionCard } from '../components/dashboard';
```

### 3. **Notes.jsx**
Contains all note-related components:
- `NotesEmptyState` - Empty state with link to create notes
- `NotesTabs` - Tab switcher (My Notes / Saved Notes)
- `NoteCard` - Individual note card
- `NotesSection` - Main container with tab logic

**Usage:**
```jsx
import { NotesSection, NoteCard, NotesTabs, NotesEmptyState } from '../components/dashboard';
```

### 4. **Reminders.jsx**
Contains reminder components:
- `ReminderCard` - Individual reminder card
- `RemindersSection` - Container displaying reminders

**Usage:**
```jsx
import { RemindersSection, ReminderCard } from '../components/dashboard';
```

### 5. **SessionTabs.jsx** (Standalone)
Tab switcher for session filters:
- Used in Calendar component
- Separate because it's also used independently

**Usage:**
```jsx
import SessionTabs from '../components/dashboard/SessionTabs';
```

### 6. **RightSidebar.jsx**
Layout component combining:
- RemindersSection
- NotesSection

Orchestrates the right sidebar of the dashboard

**Usage:**
```jsx
import { RightSidebar } from '../components/dashboard';
```

## Barrel Export

The `index.js` file provides clean, centralized exports:

```jsx
// All dashboard components can be imported from one place
import { 
  Calendar, 
  CalendarSection,
  SessionsSection, 
  NotesSection, 
  RemindersSection,
  RightSidebar,
  SessionTabs 
} from '../components/dashboard';
```

## Benefits

✅ **Better Organization** - Related components grouped in single files  
✅ **Cleaner Imports** - Barrel export eliminates deep import paths  
✅ **Easier Maintenance** - Less file fragmentation  
✅ **Better Readability** - All component logic visible in one place  
✅ **Preserved Functionality** - All exports available for other pages/components  

## Import Examples

### Old Style (Before Refactoring)
```jsx
import PopularSessionsSection from './PopularSessionsSection';
import PopularSessionCard from './PopularSessionCard';
import NoteCard from './NoteCard';
import NotesTabs from './NotesTabs';
// ... many more imports
```

### New Style (After Refactoring)
```jsx
import { SessionsSection, NotesSection, CalendarSection, RightSidebar } from '../components/dashboard';
```

## File Structure

```
dashboard/
├── Calendar.jsx           (Calendar + Header + Grid + Section)
├── Sessions.jsx           (SessionsSection + SessionCard)
├── Notes.jsx              (NotesSection + NoteCard + NotesTabs + EmptyState)
├── Reminders.jsx          (RemindersSection + ReminderCard)
├── SessionTabs.jsx        (Standalone - tab switcher)
├── RightSidebar.jsx       (Layout wrapper)
└── index.js               (Barrel export)
```
