// Session API Service
export const sessionService = {
  async createSession(sessionData, userId) {
    const headers = { "Content-Type": "application/json" };
    if (userId) {
      headers['X-User-Id'] = userId.toString();
    }

    // Prepare session data for submission
    const submissionData = {
      ...sessionData,
      maxParticipants: sessionData.maxParticipants ? parseInt(sessionData.maxParticipants) : null,
      currentParticipants: 0,
      status: 'ACTIVE'
    };

    // Clear password for public sessions
    if (sessionData.sessionType === 'PUBLIC') {
      submissionData.password = null;
    }

    const response = await fetch(`http://localhost:8080/api/sessions`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(submissionData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create session");
    }

    return await response.json();
  },

  async joinSession(sessionId, password, userId) {
    const response = await fetch(`http://localhost:8080/api/sessions/${sessionId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, userId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to join session');
    }

    return await response.json();
  },

  async updateSessionStatus(sessionId, status) {
    const response = await fetch(`http://localhost:8080/api/sessions/${sessionId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error('Failed to update session status');
    }

    return await response.json();
  },

  async getSessionsByStatus(status) {
    const url = status 
      ? `http://localhost:8080/api/sessions?status=${status}`
      : 'http://localhost:8080/api/sessions';
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }

    return await response.json();
  },

  async getSessionsForLinking() {
    const response = await fetch('http://localhost:8080/api/sessions?status=ACTIVE,SCHEDULED');
    
    if (!response.ok) {
      throw new Error('Failed to fetch sessions for linking');
    }

    const sessions = await response.json();
    // Filter out private sessions that user doesn't have access to
    return sessions.filter(session => 
      session.sessionType === 'PUBLIC' || 
      session.sessionType === 'PROTECTED'
    );
  },

  async getAllSessions() {
    const response = await fetch('http://localhost:8080/api/sessions/all-sessions');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
};