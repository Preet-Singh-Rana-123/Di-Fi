import { API_BASE_URL, getAuthHeaders, handleResponse } from './apiClient';

export const loanApi = {
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
    const res = await fetch(`${API_BASE_URL}/loan/${loanId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};
