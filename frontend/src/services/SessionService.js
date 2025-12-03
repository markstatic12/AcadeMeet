/**
 * Session API Service - handles all session-related HTTP requests
 */
import { authFetch } from './apiHelper';

const API_BASE = '/sessions';

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
  async createSession(sessionData) {
    const submissionData = {
      ...sessionData,
      maxParticipants: sessionData.maxParticipants ? parseInt(sessionData.maxParticipants) : null,
      currentParticipants: 0,
      status: 'ACTIVE',
      password: sessionData.sessionType === 'PUBLIC' ? null : sessionData.password
    };

    const response = await authFetch(API_BASE, {
      method: 'POST',
      body: JSON.stringify(submissionData)
    });

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
   * Updates session status (e.g., ACTIVE, COMPLETED, CANCELLED)
   */
  async updateSessionStatus(sessionId, status) {
    const response = await authFetch(`${API_BASE}/${sessionId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });

    return handleResponse(response, 'Failed to update session status');
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

  /**
   * Fetches all sessions regardless of filters
   */
  async getAllSessions() {
    const response = await authFetch(`${API_BASE}/all-sessions`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch all sessions');
  },

  /**
   * Fetches session details by ID with enhanced error handling
   */
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
  }
};