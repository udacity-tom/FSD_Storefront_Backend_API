CREATE TABLE users(
id SERIAL PRIMARY KEY, 
username VARCHAR(64) NOT NULL, 
firstname VARCHAR(64) NOT NULL,
lastname VARCHAR(64) NOT NULL,
pasword TEXT) 
UNIQUE(username);