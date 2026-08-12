/**
 * API Service Client for DiFi Decentralized P2P Lending Backend
 */

const API_BASE_URL = 'http://localhost:3000/api';

// Helper to get auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('difi_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
}

export const api = {
  // Auth API
  auth: {
    register: async (payload) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    },
    login: async (email, password) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    }
  },

  // Wallet API
  wallet: {
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
  },

  // Bank Pools API
  bank: {
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
  },

  // Loans API
  loan: {
    requestLoan: async (bankId, principalAmount, termMonths, purpose) => {
      const res = await fetch(`${API_BASE_URL}/loan/request`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          bank_id: bankId,
          principal_amount: principalAmount,
          term_months: termMonths,
          purpose
        })
      });
      return handleResponse(res);
    },
    disburseLoan: async (loanId) => {
      const res = await fetch(`${API_BASE_URL}/loan/disburse/${loanId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    repayLoan: async (loanId, amount) => {
      const res = await fetch(`${API_BASE_URL}/loan/repay`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ loan_id: loanId, amount })
      });
      return handleResponse(res);
    },
    getUserLoans: async () => {
      const res = await fetch(`${API_BASE_URL}/loan/user`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    getBankLoans: async (bankId) => {
      const res = await fetch(`${API_BASE_URL}/loan/bank/${bankId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    getLoanById: async (loanId) => {
      const res = await fetch(`${API_BASE_URL}/loan//${loanId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    }
  }
};
