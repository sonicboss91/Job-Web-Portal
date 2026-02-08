const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getHeaders(token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function request(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: getHeaders(token),
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unexpected server error.' }));
    throw new Error(errorData.message || 'Request failed.');
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  getJobs: (token) => request('/jobs', { token }),
  createJob: (token, payload) => request('/jobs', { method: 'POST', token, body: payload }),
  updateJob: (token, id, payload) => request(`/jobs/${id}`, { method: 'PUT', token, body: payload }),
  deleteJob: (token, id) => request(`/jobs/${id}`, { method: 'DELETE', token })
};
