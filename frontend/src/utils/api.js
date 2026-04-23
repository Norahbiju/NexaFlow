const BASE_URL = '/api';

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('nexaflow_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('nexaflow_token');
    localStorage.removeItem('nexaflow_user');
    window.location.href = '/login';
  }

  return response;
};

export const get = (endpoint) => apiCall(endpoint);
export const post = (endpoint, body) =>
  apiCall(endpoint, { method: 'POST', body: JSON.stringify(body) });
export const put = (endpoint, body) =>
  apiCall(endpoint, { method: 'PUT', body: JSON.stringify(body) });
