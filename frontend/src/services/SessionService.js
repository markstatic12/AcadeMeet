import { authFetch } from './apiHelper';

const API_BASE = '/sessions';

const handleResponse = async (response, errorMessage = 'Request failed') => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', response.status, errorText);
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.error || errorData.message || `${errorMessage} (${response.status})`);
    } catch {
      throw new Error(`${errorMessage} (${response.status}): ${errorText}`);
    }
  }
  return await response.json();
};

export const sessionService = {
 
  async createSession(sessionData) {
    const submissionData = {
      title: sessionData.title,
      description: sessionData.description,
      month: sessionData.month,  // Send as string (e.g., "January")
      day: sessionData.day,      // Send as string (e.g., "15")
      year: sessionData.year,    // Send as string (e.g., "2025")
      startTime: sessionData.startTime,  // Send as string (e.g., "14:30")
      endTime: sessionData.endTime,      // Send as string (e.g., "16:00")
      location: sessionData.location,
      maxParticipants: sessionData.maxParticipants ? parseInt(sessionData.maxParticipants) : null,
      sessionType: sessionData.sessionType, // Should be 'PUBLIC' or 'PRIVATE'
      tags: sessionData.tags || [],
      password: sessionData.sessionType === 'PUBLIC' ? null : sessionData.password
    };

    console.log('Creating session with data:', submissionData);

    const response = await authFetch(API_BASE, {
      method: 'POST',
      body: JSON.stringify(submissionData)
    });

    console.log('Response status:', response.status);
    
    return handleResponse(response, 'Failed to create session');
  },

  
  async validateSessionPassword(sessionId, password) {
    const response = await authFetch(`${API_BASE}/${sessionId}/validate-password`, {
      method: 'POST',
      body: JSON.stringify({ password })
    });

    return handleResponse(response, 'Failed to validate password');
  },

  
  async joinSession(sessionId, password) {
    const response = await authFetch(`${API_BASE}/${sessionId}/join`, {
      method: 'POST',
      body: JSON.stringify({ password })
    });

    return handleResponse(response, 'Failed to join session');
  },

 
  async cancelJoinSession(sessionId) {
    const response = await authFetch(`${API_BASE}/${sessionId}/cancel-join`, {
      method: 'POST',
      body: JSON.stringify({})
    });

    return handleResponse(response, 'Failed to cancel participation');
  },

  async isUserParticipant(sessionId) {
    const response = await authFetch(`${API_BASE}/${sessionId}/is-participant`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to check participation status');
  },

  async updateSessionStatus(sessionId, status) {
    const response = await authFetch(`${API_BASE}/${sessionId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });

    return handleResponse(response, 'Failed to update session status');
  },

  async updateSession(sessionId, sessionData) {
    const submissionData = {
      title: sessionData.title,
      description: sessionData.description,
      month: sessionData.month,  
      day: sessionData.day,      
      year: sessionData.year,   
      startTime: sessionData.startTime,  
      endTime: sessionData.endTime,      
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
      } catch {
        throw new Error(`Failed to update session: ${response.status} - ${errorText}`);
      }
    }

    return await response.json();
  },

  async getSessionsByStatus(status) {
    const url = status 
      ? `${API_BASE}?status=${status}`
      : API_BASE;
    
    const response = await authFetch(url, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch sessions');
  },

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

  async getTrendingSessions() {
    const response = await authFetch(`${API_BASE}/trending`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch trending sessions');
  },

  async getUserHostedSessions() {
    const response = await authFetch(`${API_BASE}/user/me`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch user hosted sessions');
  },

  async getUserCompletedSessions() {
    const response = await authFetch(`${API_BASE}/user/me/history`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch completed sessions');
  },

  async getJoinedSessions() {
    const response = await authFetch(`${API_BASE}/user/me/joined`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch joined sessions');
  },

  async getSessionsByUserId(userId) {
    const response = await authFetch(`${API_BASE}/user/${userId}`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch user sessions');
  },

  async getSessionById(sessionId) {
    const response = await authFetch(`${API_BASE}/${sessionId}`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch session');
  },

  async getAllSessions() {
    const response = await authFetch(`${API_BASE}/all-sessions`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch all sessions');
  },

  async getSessionParticipants(sessionId) {
    const response = await authFetch(`${API_BASE}/${sessionId}/participants`, {
      method: 'GET'
    });

    return handleResponse(response, 'Failed to fetch session participants');
  },

  async removeParticipant(sessionId, userId) {
    const response = await authFetch(`${API_BASE}/${sessionId}/participants/${userId}`, {
      method: 'DELETE'
    });

    return handleResponse(response, 'Failed to remove participant');
  }
};