/**
 * Core API Client Helper
 */

export const API_BASE_URL = 'http://localhost:3000/api';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('difi_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
}
