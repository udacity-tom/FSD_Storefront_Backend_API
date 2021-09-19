CREATE TABLE orders(
id SERIAL PRIMARY KEY, 
user_id bigint REFERENCES users(id), 
status VARCHAR(20) NOT NULL
);