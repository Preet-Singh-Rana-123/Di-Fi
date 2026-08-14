/**
 * Unified API Client for DiFi Decentralized P2P Lending Frontend
 * Aggregates modular sub-services for clean imports across the application.
 */

import { authApi } from './authApi';
import { walletApi } from './walletApi';
import { bankApi } from './bankApi';
import { loanApi } from './loanApi';

export { authApi, walletApi, bankApi, loanApi };

export const api = {
  auth: authApi,
  wallet: walletApi,
  bank: bankApi,
  loan: loanApi
};

export default api;
