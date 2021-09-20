CREATE TABLE users (
id serial PRIMARY KEY, 
username VARCHAR(64) NOT NULL, 
firstname VARCHAR(64) NOT NULL,
lastname VARCHAR(64) NOT NULL,
password TEXT
);