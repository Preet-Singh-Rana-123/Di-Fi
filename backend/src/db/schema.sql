-- Schema for Decentralized P2P Lending Platform with Fractional Banking Mechanics

-- Drop existing tables in reverse dependency order if migrating
DROP TABLE IF EXISTS loan_repayments CASCADE;
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS bank_contributions CASCADE;
DROP TABLE IF EXISTS bank_pools CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    wallet_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (wallet_balance >= 0.00),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bank Pools (Micro-Founding Banks)
CREATE TABLE bank_pools (
    id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bank_name VARCHAR(100) NOT NULL,
    interest_rate NUMERIC(5, 2) NOT NULL CHECK (interest_rate >= 0.00),
    owner_commission_pct NUMERIC(5, 2) NOT NULL DEFAULT 10.00 CHECK (owner_commission_pct >= 0.00 AND owner_commission_pct <= 100.00),
    reserve_ratio_pct NUMERIC(5, 2) NOT NULL DEFAULT 20.00 CHECK (reserve_ratio_pct >= 0.00 AND reserve_ratio_pct <= 100.00),
    total_liquidity NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (total_liquidity >= 0.00),
    available_liquidity NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (available_liquidity >= 0.00 AND available_liquidity <= total_liquidity),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'CLOSED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bank Contributions (Lender / Depositor Shares in Bank Pools)
CREATE TABLE bank_contributions (
    id SERIAL PRIMARY KEY,
    bank_id INT NOT NULL REFERENCES bank_pools(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount_contributed NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (amount_contributed >= 0.00),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bank_id, user_id)
);

-- 4. Loans Table (P2P Borrowing against Bank Pools)
CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    bank_id INT NOT NULL REFERENCES bank_pools(id) ON DELETE RESTRICT,
    borrower_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    principal_amount NUMERIC(15, 2) NOT NULL CHECK (principal_amount > 0.00),
    interest_rate NUMERIC(5, 2) NOT NULL CHECK (interest_rate >= 0.00),
    term_months INT NOT NULL CHECK (term_months > 0),
    monthly_installment NUMERIC(15, 2) NOT NULL CHECK (monthly_installment > 0.00),
    total_repayable NUMERIC(15, 2) NOT NULL CHECK (total_repayable >= principal_amount),
    remaining_balance NUMERIC(15, 2) NOT NULL CHECK (remaining_balance >= 0.00),
    status VARCHAR(20) NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'APPROVED', 'ACTIVE', 'REPAID', 'DEFAULTED', 'REJECTED')),
    purpose VARCHAR(255),
    disbursed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Loan Repayments Table
CREATE TABLE loan_repayments (
    id SERIAL PRIMARY KEY,
    loan_id INT NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    payer_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    amount_paid NUMERIC(15, 2) NOT NULL CHECK (amount_paid > 0.00),
    principal_portion NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (principal_portion >= 0.00),
    interest_portion NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (interest_portion >= 0.00),
    owner_fee NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (owner_fee >= 0.00),
    pool_yield NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (pool_yield >= 0.00),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Wallet Transactions Table (Immutable Ledger)
CREATE TABLE wallet_transactions (
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) ON DELETE SET NULL,
    receiver_id INT REFERENCES users(id) ON DELETE SET NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0.00),
    transaction_type VARCHAR(50) NOT NULL CHECK (
        transaction_type IN (
            'DEPOSIT',
            'WITHDRAWAL',
            'TRANSFER',
            'POOL_DEPOSIT',
            'POOL_WITHDRAWAL',
            'LOAN_DISBURSEMENT',
            'LOAN_REPAYMENT',
            'POOL_YIELD_DISTRIBUTION',
            'OWNER_COMMISSION'
        )
    ),
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimal performance
CREATE INDEX idx_bank_pools_owner ON bank_pools(owner_id);
CREATE INDEX idx_bank_contributions_user ON bank_contributions(user_id);
CREATE INDEX idx_bank_contributions_bank ON bank_contributions(bank_id);
CREATE INDEX idx_loans_borrower ON loans(borrower_id);
CREATE INDEX idx_loans_bank ON loans(bank_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_wallet_tx_sender ON wallet_transactions(sender_id);
CREATE INDEX idx_wallet_tx_receiver ON wallet_transactions(receiver_id);
