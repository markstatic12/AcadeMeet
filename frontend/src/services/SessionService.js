/**
 * Session API Service - handles all session-related HTTP requests
 */

const API_BASE = 'http://localhost:8080/api/sessions';

// Helper function to build headers with optional authentication
const buildHeaders = (userId) => {
  const headers = { 'Content-Type': 'application/json' };
  if (userId) {
    headers['X-User-Id'] = userId.toString();
  }
  return headers;
};

// Helper function to handle API responses
const handleResponse = async (response, errorMessage = 'Request failed') => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || errorMessage);
  }
  return await response.json();
};

export const sessionService = {
  /**
   * Creates a new session with proper data formatting
   */
  async createSession(sessionData, userId) {
    const submissionData = {
      ...sessionData,
      maxParticipants: sessionData.maxParticipants ? parseInt(sessionData.maxParticipants) : null,
      currentParticipants: 0,
      status: 'ACTIVE',
      password: sessionData.sessionType === 'PUBLIC' ? null : sessionData.password
    };

    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: buildHeaders(userId),
      credentials: 'include',
      body: JSON.stringify(submissionData)
    });

    return handleResponse(response, 'Failed to create session');
  },

  /**
   * Validates session password without joining (for private session access)
   */
  async validateSessionPassword(sessionId, password, userId) {
    const response = await fetch(`${API_BASE}/${sessionId}/validate-password`, {
      method: 'POST',
      headers: buildHeaders(userId),
      credentials: 'include',
      body: JSON.stringify({ password, userId })
    });

    return handleResponse(response, 'Failed to validate password');
  },

  /**
   * Joins a session with password validation and participant increment
   */
  async joinSession(sessionId, password, userId) {
    const response = await fetch(`${API_BASE}/${sessionId}/join`, {
      method: 'POST',
      headers: buildHeaders(userId),
      credentials: 'include',
      body: JSON.stringify({ password, userId })
    });

    return handleResponse(response, 'Failed to join session');
  },

  /**
   * Updates session status (e.g., ACTIVE, COMPLETED, CANCELLED)
   */
  async updateSessionStatus(sessionId, status, userId) {
    const response = await fetch(`${API_BASE}/${sessionId}/status`, {
      method: 'PATCH',
      headers: buildHeaders(userId),
      credentials: 'include',
      body: JSON.stringify({ status })
    });

    return handleResponse(response, 'Failed to update session status');
  },

  /**
   * Fetches sessions filtered by status or all sessions if no status provided
   */
  async getSessionsByStatus(status, userId) {
    const url = status 
      ? `${API_BASE}?status=${status}`
      : API_BASE;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: buildHeaders(userId),
      credentials: 'include'
    });

    return handleResponse(response, 'Failed to fetch sessions');
  },

  /**
   * Fetches sessions available for linking (user's sessions)
   */
  async getSessionsForLinking(userId) {
    const response = await fetch(`${API_BASE}/user/${userId}`, {
      method: 'GET',
      headers: buildHeaders(userId),
      credentials: 'include'
    });
    
    const sessions = await handleResponse(response, 'Failed to fetch sessions for linking');
    return Array.isArray(sessions) ? sessions : [];
  },

  /**
   * Fetches all sessions regardless of filters
   */
  async getAllSessions(userId) {
    const response = await fetch(`${API_BASE}/all-sessions`, {
      method: 'GET',
      headers: buildHeaders(userId),
      credentials: 'include'
    });

    return handleResponse(response, 'Failed to fetch all sessions');
  },

  /**
   * Fetches session details by ID with enhanced error handling
   */
  async getSessionById(sessionId, userId) {
    const response = await fetch(`${API_BASE}/${sessionId}`, {
      method: 'GET',
      headers: buildHeaders(userId),
      credentials: 'include'
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
  async getSessionsByDate(year, month, day, userId) {
    const params = new URLSearchParams({
      year: year.toString(),
      month: month.toString(),
      day: day.toString()
    });
    
    const response = await fetch(`${API_BASE}/by-date?${params}`, {
      method: 'GET',
      headers: buildHeaders(userId),
      credentials: 'include'
    });

    return handleResponse(response, 'Failed to fetch sessions for date');
  }
};