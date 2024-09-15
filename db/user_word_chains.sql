CREATE TABLE user_word_chains (
    chain_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    word VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    points INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_word_chains_user_date ON user_word_chains(user_id, date);