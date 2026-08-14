import { API_BASE_URL, getAuthHeaders, handleResponse } from './apiClient';

export const walletApi = {
  deposit: async (amount) => {
    const res = await fetch(`${API_BASE_URL}/wallet/deposit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount })
    });
    return handleResponse(res);
  },
  withdraw: async (amount) => {
    const res = await fetch(`${API_BASE_URL}/wallet/withdraw`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount })
    });
    return handleResponse(res);
  },
  transfer: async (receiverEmail, amount) => {
    const res = await fetch(`${API_BASE_URL}/wallet/transfer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ receiver_email: receiverEmail, amount })
    });
    return handleResponse(res);
  },
  getHistory: async () => {
    const res = await fetch(`${API_BASE_URL}/wallet/history`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};
