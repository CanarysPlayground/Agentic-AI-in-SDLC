const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ─── Token helpers ─────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ─── Auth API ──────────────────────────────────────────────────────────────
export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Login failed');
  }
  return response.json();
};

export const fetchCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Not authenticated');
  return response.json();
};

// ─── Incidents API ─────────────────────────────────────────────────────────
export const fetchIncidents = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.assignee) params.append('assignee', filters.assignee);
  
  const url = `${API_BASE_URL}/incidents?${params.toString()}`;
  const response = await fetch(url, { headers: authHeaders() });
  
  if (!response.ok) {
    throw new Error('Failed to fetch incidents');
  }
  
  return response.json();
};

export const fetchIncidentById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/incidents/${id}`, { headers: authHeaders() });
  
  if (!response.ok) {
    throw new Error('Failed to fetch incident');
  }
  
  return response.json();
};

export const createIncident = async (incidentData) => {
  const response = await fetch(`${API_BASE_URL}/incidents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(incidentData),
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to create incident');
  }
  
  return response.json();
};

export const updateIncident = async (id, incidentData) => {
  const response = await fetch(`${API_BASE_URL}/incidents/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(incidentData),
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to update incident');
  }
  
  return response.json();
};

export const deleteIncident = async (id) => {
  const response = await fetch(`${API_BASE_URL}/incidents/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete incident');
  }
  
  return response.json();
};

export const fetchStats = async () => {
  const response = await fetch(`${API_BASE_URL}/incidents/stats/summary`, { headers: authHeaders() });
  
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  
  return response.json();
};
