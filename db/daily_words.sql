CREATE TABLE daily_word (
    word_id SERIAL PRIMARY KEY,
    word VARCHAR(50) NOT NULL,
    date DATE NOT NULL UNIQUE
);

CREATE INDEX idx_daily_word_date ON daily_word(date);
