import { API_BASE_URL, getAuthHeaders, handleResponse } from './apiClient';

export const bankApi = {
  createPool: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/bank/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },
  depositLiquidity: async (bankId, amount) => {
    const res = await fetch(`${API_BASE_URL}/bank/deposit-liquidity`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ bank_id: bankId, amount })
    });
    return handleResponse(res);
  },
  withdrawLiquidity: async (bankId, amount) => {
    const res = await fetch(`${API_BASE_URL}/bank/withdraw-liquidity`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ bank_id: bankId, amount })
    });
    return handleResponse(res);
  },
  getAllPools: async () => {
    const res = await fetch(`${API_BASE_URL}/bank/pools`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(res);
  },
  getPoolById: async (bankId) => {
    const res = await fetch(`${API_BASE_URL}/bank/pool/${bankId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};
