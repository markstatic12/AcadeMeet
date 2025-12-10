import api from './apiClient';

const API_BASE = '/sessions';

export const sessionService = {
 
  async createSession(sessionData) {
    const resolvedType = sessionData.sessionPrivacy || sessionData.sessionType;

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
      sessionPrivacy: resolvedType,
      tags: sessionData.tags || [],
      password: resolvedType === 'PUBLIC' ? null : sessionData.password
    };

    console.log('Creating session with data:', submissionData);

    const response = await api.post(API_BASE, submissionData);
    console.log('Response status:', response.status);
    
    return response.data;
  },

  
  async validateSessionPassword(sessionId, password) {
    const response = await api.post(`${API_BASE}/${sessionId}/validate-password`, { password });
    return response.data;
  },

  
  async joinSession(sessionId, password) {
    const response = await api.post(`${API_BASE}/${sessionId}/join`, { password });
    return response.data;
  },

 
  async cancelJoinSession(sessionId) {
    const response = await api.post(`${API_BASE}/${sessionId}/cancel-join`, {});
    return response.data;
  },

  async leaveSession(sessionId) {
    const response = await api.delete(`${API_BASE}/${sessionId}/leave`);
    return response.data;
  },

  async isUserParticipant(sessionId) {
    const response = await api.get(`${API_BASE}/${sessionId}/is-participant`);
    return response.data;
  },

  async updateSessionStatus(sessionId, status) {
    const response = await api.patch(`${API_BASE}/${sessionId}/status`, { status });
    return response.data;
  },

  async updateSession(sessionId, sessionData) {
    const resolvedType = sessionData.sessionPrivacy || sessionData.sessionType;

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

      sessionPrivacy: resolvedType,
      tags: sessionData.tags || []
    };
    if (resolvedType !== 'PUBLIC' && sessionData.password && sessionData.password.trim() !== '') {
      submissionData.password = sessionData.password;
    }

    console.log('Updating session with data:', submissionData);

    const response = await api.put(`${API_BASE}/${sessionId}`, submissionData);
    return response.data;
  },

  async getSessionsByStatus(status) {
    const response = await api.get(API_BASE, {
      params: status ? { status } : {}
    });
    return response.data;
  },

  async getSessionsByDate(year, month, day) {
    const response = await api.get(`${API_BASE}/by-date`, {
      params: {
        year: year.toString(),
        month: month.toString(),
        day: day.toString()
      }
    });
    return response.data;
  },

  async getTrendingSessions() {
    const response = await api.get(`${API_BASE}/trending`);
    return response.data;
  },

  async getUserHostedSessions() {
    const response = await api.get(`${API_BASE}/user/me`);
    return response.data;
  },

  async getUserCompletedSessions() {
    const response = await api.get(`${API_BASE}/user/me/history`);
    return response.data;
  },

  async getJoinedSessions() {
    const response = await api.get(`${API_BASE}/user/me/joined`);
    return response.data;
  },

  async getSessionsByUserId(userId) {
    const response = await api.get(`${API_BASE}/user/${userId}`);
    return response.data;
  },

  async getSessionById(sessionId) {
    const response = await api.get(`${API_BASE}/${sessionId}`);
    return response.data;
  },

  async getAllSessions() {
    const response = await api.get(`${API_BASE}/all-sessions`);
    return response.data;
  },

  async getSessionParticipants(sessionId) {
    const response = await api.get(`${API_BASE}/${sessionId}/participants`);
    return response.data;
  },

  async removeParticipant(sessionId, userId) {
    const response = await api.delete(`${API_BASE}/${sessionId}/participants/${userId}`);
    return response.data;
  }
};