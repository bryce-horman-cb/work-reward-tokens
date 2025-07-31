-- Table to track processed Jira tickets to avoid duplicate rewards
CREATE TABLE IF NOT EXISTS processed_tickets (
    id SERIAL PRIMARY KEY,
    ticket_key VARCHAR(50) UNIQUE NOT NULL,
    assignee_email VARCHAR(255) NOT NULL,
    completed_at TIMESTAMP NOT NULL,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to track reward history for auditing
CREATE TABLE IF NOT EXISTS reward_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    wallet_address VARCHAR(64) NOT NULL,
    ticket_key VARCHAR(50) NOT NULL,
    tokens_awarded DECIMAL(10, 4) NOT NULL,
    transaction_hash VARCHAR(66),
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_processed_tickets_key ON processed_tickets(ticket_key);
CREATE INDEX IF NOT EXISTS idx_processed_tickets_email ON processed_tickets(assignee_email);
CREATE INDEX IF NOT EXISTS idx_reward_history_user_id ON reward_history(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_history_wallet ON reward_history(wallet_address);