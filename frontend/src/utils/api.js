const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

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

export const register = async (username, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Registration failed');
  }
  return response.json();
};

export const fetchIncidents = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.assignee) params.append('assignee', filters.assignee);
  
  const url = `${API_BASE_URL}/incidents?${params.toString()}`;
  const response = await fetch(url, { headers: getAuthHeaders() });
  
  if (!response.ok) {
    throw new Error('Failed to fetch incidents');
  }
  
  return response.json();
};

export const fetchIncidentById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/incidents/${id}`, { headers: getAuthHeaders() });
  
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
      ...getAuthHeaders(),
    },
    body: JSON.stringify(incidentData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create incident');
  }
  
  return response.json();
};

export const updateIncident = async (id, incidentData) => {
  const response = await fetch(`${API_BASE_URL}/incidents/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(incidentData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update incident');
  }
  
  return response.json();
};

export const deleteIncident = async (id) => {
  const response = await fetch(`${API_BASE_URL}/incidents/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete incident');
  }
  
  return response.json();
};

export const fetchStats = async () => {
  const response = await fetch(`${API_BASE_URL}/incidents/stats/summary`, { headers: getAuthHeaders() });
  
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  
  return response.json();
};
