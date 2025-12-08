/**
 * Session API Service - handles all session-related HTTP requests
 */
import { authFetch } from './apiHelper';

const API_BASE = '/sessions';

// Helper function to handle API responses
const handleResponse = async (response, errorMessage = 'Request failed') => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', response.status, errorText);
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.error || errorData.message || `${errorMessage} (${response.status})`);
    } catch (e) {
      throw new Error(`${errorMessage} (${response.status}): ${errorText}`);
    }
  }
  return await response.json();
};

export const sessionService = {
  /**
   * Creates a new session with proper data formatting
   */
  async createSession(sessionData) {
    // Format date and time into LocalDateTime format (yyyy-MM-dd'T'HH:mm:ss)
    const formatDateTime = (year, month, day, time) => {
      // Convert month name to number if needed (case-insensitive)
      const monthNames = ["january", "february", "march", "april", "may", "june",
                          "july", "august", "september", "october", "november", "december"];
      const monthLower = month.toLowerCase();
      const monthIndex = monthNames.indexOf(monthLower);
      const monthNumber = monthIndex !== -1 
        ? String(monthIndex + 1).padStart(2, '0')
        : month.padStart(2, '0');
      
      const paddedDay = day.padStart(2, '0');
      return `${year}-${monthNumber}-${paddedDay}T${time}:00`;
    };

    const submissionData = {
      title: sessionData.title,
      description: sessionData.description,
      startTime: formatDateTime(sessionData.year, sessionData.month, sessionData.day, sessionData.startTime),
      endTime: formatDateTime(sessionData.year, sessionData.month, sessionData.day, sessionData.endTime),
      location: sessionData.location,
      maxParticipants: sessionData.maxParticipants ? parseInt(sessionData.maxParticipants) : null,
      sessionType: sessionData.sessionType, // Should be 'PUBLIC' or 'PRIVATE'
      tags: sessionData.tags || [],
      password: sessionData.sessionType === 'PUBLIC' ? null : sessionData.password
    };

    console.log('Creating session with data:', submissionData);
    console.log('Token exists:', !!localStorage.getItem('token'));

    const response = await authFetch(API_BASE, {
      method: 'POST',
      body: JSON.stringify(submissionData)
    });

    console.log('Response status:', response.status);
    
    return handleResponse(response, 'Failed to create session');
  },

  /**
   * Validates session password without joining (for private session access)
   */
  async validateSessionPassword(sessionId, password) {
    const response = await authFetch(`${API_BASE}/${sessionId}/validate-password`, {
      method: 'POST',
      body: JSON.stringify({ password })
    });

    return handleResponse(response, 'Failed to validate password');
  },

  /**
   * Joins a session with password validation and participant increment
   */
  async joinSession(sessionId, password) {
    const response = await authFetch(`${API_BASE}/${sessionId}/join`, {
      method: 'POST',
      body: JSON.stringify({ password })
    });

    return handleResponse(response, 'Failed to join session');
  },

  /**
   * Cancels participation in a session
   */
  async cancelJoinSession(sessionId) {
    const response = await authFetch(`${API_BASE}/${sessionId}/cancel-join`, {
      method: 'POST',
      body: JSON.stringify({})
    });

    return handleResponse(response, 'Failed to cancel participation');
  },

  /**
   * Checks if the current user is a participant of a session
   */
  async isUserParticipant(sessionId) {
    const response = await authFetch(`${API_BASE}/${sessionId}/is-participant`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to check participation status');
  },

  /**
   * Updates session status (e.g., ACTIVE, COMPLETED, CANCELLED, TRASH)
   */
  async updateSessionStatus(sessionId, status) {
    const response = await authFetch(`${API_BASE}/${sessionId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });

    return handleResponse(response, 'Failed to update session status');
  },

  /**
   * Updates session details
   */
  async updateSession(sessionId, sessionData) {
    // Format date and time into LocalDateTime format (yyyy-MM-dd'T'HH:mm:ss)
    const formatDateTime = (year, month, day, time) => {
      // Convert month name to number if needed (case-insensitive)
      const monthNames = ["january", "february", "march", "april", "may", "june",
                          "july", "august", "september", "october", "november", "december"];
      const monthLower = month.toLowerCase();
      const monthIndex = monthNames.indexOf(monthLower);
      const monthNumber = monthIndex !== -1 
        ? String(monthIndex + 1).padStart(2, '0')
        : month.padStart(2, '0');
      
      const paddedDay = day.padStart(2, '0');
      return `${year}-${monthNumber}-${paddedDay}T${time}:00`;
    };

    const submissionData = {
      title: sessionData.title,
      description: sessionData.description,
      startTime: formatDateTime(sessionData.year, sessionData.month, sessionData.day, sessionData.startTime),
      endTime: formatDateTime(sessionData.year, sessionData.month, sessionData.day, sessionData.endTime),
      location: sessionData.location,
      maxParticipants: sessionData.maxParticipants ? parseInt(sessionData.maxParticipants) : null,
      sessionType: sessionData.sessionType,
      tags: sessionData.tags || [],
      password: sessionData.sessionType === 'PUBLIC' ? null : sessionData.password
    };

    console.log('Updating session with data:', submissionData);

    const response = await authFetch(`${API_BASE}/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(submissionData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update session failed. Status:', response.status, 'Response:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || errorData.message || 'Failed to update session');
      } catch (e) {
        throw new Error(`Failed to update session: ${response.status} - ${errorText}`);
      }
    }

    return await response.json();
  },

  /**
   * Fetches sessions filtered by status or all sessions if no status provided
   */
  async getSessionsByStatus(status) {
    const url = status 
      ? `${API_BASE}?status=${status}`
      : API_BASE;
    
    const response = await authFetch(url, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch sessions');
  },

  /**
   * Fetches sessions available for linking (non-private sessions)
   */
  async getSessionsForLinking() {
    const response = await authFetch(`${API_BASE}?status=ACTIVE,SCHEDULED`, {
      method: 'GET'
    });
    
    const sessions = await handleResponse(response, 'Failed to fetch sessions for linking');
    // Filter out private sessions that user doesn't have access to
    return sessions.filter(session => 
      session.sessionType === 'PUBLIC' || 
      session.sessionType === 'PROTECTED'
    );
  },

  // MUST FETCH ONLY ACTIVE SESSIONS
  async getAllSessions() {
    const url = `${API_BASE}?status=ACTIVE`;
    
    const response = await authFetch(url, {
      method: 'GET'
    });
    
    console.log('Fetching all [ACTIVE] sessions:', response);

    return handleResponse(response, 'Failed to fetch all sessions');
  },

  //FETCHES SESSION BY SESSION ID
  async getSessionById(sessionId) {
    const response = await authFetch(`${API_BASE}/${sessionId}`, {
      method: 'GET'
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Session not found');
      }
      throw new Error(`Failed to fetch session: ${response.status}`);
    }

    return await response.json();
  },

  /**
   * Gets sessions scheduled for a specific date
   */
  async getSessionsByDate(year, month, day) {
    const params = new URLSearchParams({
      year: year.toString(),
      month: month.toString(),
      day: day.toString()
    });
    
    const response = await authFetch(`${API_BASE}/by-date?${params}`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch sessions for date');
  },

  /**
   * Gets top 4 trending sessions based on tag popularity
   */
  async getTrendingSessions() {
    const response = await authFetch(`${API_BASE}/trending`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch trending sessions');
  },

  /**
   * Gets all sessions hosted by the current user
   */
  async getUserHostedSessions() {
    const response = await authFetch(`${API_BASE}/user/me`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch user hosted sessions');
  },

  /**
   * Gets completed sessions (history) for the current user
   */
  async getUserCompletedSessions() {
    const response = await authFetch(`${API_BASE}/user/me/history`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch completed sessions');
  },

  /**
   * Gets all sessions hosted by a specific user (for viewing other users' profiles)
   */
  async getSessionsByUserId(userId) {
    const response = await authFetch(`${API_BASE}/user/${userId}`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch user sessions');
  },

  /**
   * Gets the list of participants for a specific session
   */
  async getSessionParticipants(sessionId) {
    const response = await authFetch(`${API_BASE}/${sessionId}/participants`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch session participants');
  },

  /**
   * Removes a participant from a session (host only)
   */
  async removeParticipant(sessionId, userId) {
    const response = await authFetch(`${API_BASE}/${sessionId}/participants/${userId}`, {
      method: 'DELETE'
    });

    return handleResponse(response, 'Failed to remove participant');
  }
};