CREATE TABLE application_users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    suburb TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);