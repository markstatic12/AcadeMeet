/**
 * Session API Service - handles all session-related HTTP requests
 */

import { buildApiUrl, buildHeaders, handleApiResponse, API_CONFIG } from '../config/api';

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

    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.SESSIONS), {
      method: 'POST',
      headers: buildHeaders(userId),
      credentials: 'include',
      body: JSON.stringify(submissionData)
    });

    return handleApiResponse(response, 'Failed to create session');
  },

  /**
   * Validates session password without joining (for private session access)
   */
  async validateSessionPassword(sessionId, password, userId) {
    const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SESSIONS}/${sessionId}/validate-password`), {
      method: 'POST',
      headers: buildHeaders(userId),
      credentials: 'include',
      body: JSON.stringify({ password, userId })
    });

    return handleApiResponse(response, 'Failed to validate password');
  },

  /**
   * Joins a session with password validation and participant increment
   */
  async joinSession(sessionId, password, userId) {
    const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SESSIONS}/${sessionId}/join`), {
      method: 'POST',
      headers: buildHeaders(userId),
      credentials: 'include',
      body: JSON.stringify({ password, userId })
    });

    return handleApiResponse(response, 'Failed to join session');
  },

  /**
   * Updates session status (e.g., ACTIVE, COMPLETED, CANCELLED)
   */
  async updateSessionStatus(sessionId, status, userId) {
    const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SESSIONS}/${sessionId}/status`), {
      method: 'PATCH',
      headers: buildHeaders(userId),
      credentials: 'include',
      body: JSON.stringify({ status })
    });

    return handleApiResponse(response, 'Failed to update session status');
  },

  /**
   * Fetches sessions filtered by status or all sessions if no status provided
   */
  async getSessionsByStatus(status, userId) {
    const url = status 
      ? buildApiUrl(`${API_CONFIG.ENDPOINTS.SESSIONS}?status=${status}`)
      : buildApiUrl(API_CONFIG.ENDPOINTS.SESSIONS);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: buildHeaders(userId),
      credentials: 'include'
    });

    return handleApiResponse(response, 'Failed to fetch sessions');
  },

  /**
   * Fetches sessions available for linking (non-private sessions)
   */
  async getSessionsForLinking(userId) {
    const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SESSIONS}?status=ACTIVE,SCHEDULED`), {
      method: 'GET',
      headers: buildHeaders(userId),
      credentials: 'include'
    });
    
    const sessions = await handleApiResponse(response, 'Failed to fetch sessions for linking');
    // Filter out private sessions that user doesn't have access to
    return sessions.filter(session => 
      session.sessionType === 'PUBLIC' || 
      session.sessionType === 'PROTECTED'
    );
  },

  /**
   * Fetches all sessions regardless of filters
   */
  async getAllSessions(userId) {
    const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SESSIONS}/all-sessions`), {
      method: 'GET',
      headers: buildHeaders(userId),
      credentials: 'include'
    });

    return handleApiResponse(response, 'Failed to fetch all sessions');
  },

  /**
   * Fetches session details by ID with enhanced error handling
   */
  async getSessionById(sessionId, userId) {
    const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SESSIONS}/${sessionId}`), {
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
    
    const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SESSIONS}/by-date?${params}`), {
      method: 'GET',
      headers: buildHeaders(userId),
      credentials: 'include'
    });

    return handleApiResponse(response, 'Failed to fetch sessions for date');
  }
};