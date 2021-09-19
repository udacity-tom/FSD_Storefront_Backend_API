# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 
    - An INDEX Route: /products  [GET]
- Show
    - A SHOW Route: /products/:id  [GET]
- Create [token required]
    - A CREATE Route: /products/create  [POST]
- [OPTIONAL] Top 5 most popular products 
    - A Top 5 DASHBOARD Route: /products/top-5-products [GET]
- [OPTIONAL] Products by category (args: product category)
    - A CATEGORY Route: /products/category/:category  [GET]

#### Users
- Index [token required]
    - An INDEX Route: /users  [GET]
- Show [token required]
    - A SHOW Route: /users/:id [GET]
- Create N[token required]
    - A CREATE Route: /users/create  [POST]

> Additionally the following 'user' routes have been added (together with their modesl/handlers) to aid current/future implementation
>- Authentication (uses users login details (username, password) to authorise and issues a fresh JWT. )
>   - Route: /users/authenticate [POST]
>- Delete [token required] (deletes a specific user from the users DB Table)
>   - Route: /users/delete/:id [GET]

#### Orders
- Current Order by user (args: user id)[token required]
    - ARoute: /users/:id/orders/current [GET]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]
    - Route /users/:id/orders/complete [GET]

## Data Shapes
#### Product
-  id 
- name
- price
- [OPTIONAL] category

>Suggested Table: 
>For the 'products' table we suggest the following: 
>
>|id|name|price|category|
>|--|----|------|-------|
>|SERIAL PRIMARY KEY|VARCHAR(64) NOT NULL|NUMERIC(8,2) NOT NULL|VARCHAR(64)|

>CREATE TABLE products(
id SERIAL PRIMARY KEY, 
name VARCHAR(64) NOT NULL, 
price NUMERIC(8, 2) NOT NULL, 
category VARCHAR(64)
);

#### User
- id
- firstName
- lastName
- password

>Suggested Table:
>For the 'users' table we suggest including a unique username field as such: 
>|id|username (UNIQUE)|firstname|lastname|password|
>|--|----|------|-------|------|
>|SERIAL PRIMARY KEY|VARCHAR(64) NOT NULL|VARCHAR(64) NOT NULL|VARCHAR(64) NOT NULL|TEXT|

>CREATE TABLE users(
id SERIAL PRIMARY KEY, 
username VARCHAR(64) NOT NULL, 
firstname VARCHAR(64) NOT NULL,
lastname VARCHAR(64) NOT NULL,
pasword TEXT) 
UNIQUE(username);

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

>Suggested Tables:
>For the 'orders' table we suggest an appropriate table so: 
>|id|user_id|status|
>|--|----|------|
>SERIAL PRIMARY KEY|bigint REFERENCES users(id)|VARCHAR(20) NOT NULL|

>CREATE TABLE orders(
id SERIAL PRIMARY KEY, 
user_id bigint REFERENCES users(id), 
status VARCHAR(20) NOT NULL
);

>For an 'orders'/'product' JOIN table we suggest: 
>|id (transaction ID)|product_id|quantity|order_id|
>|--|----------|-------|------|
>|SERIAL PRIMARY KEY|bigint REFERENCES products(id)|integer|bigint REFERENCES orders(id)|

>CREATE TABLE order_products(
id SERIAL PRIMARY KEY, 
product_id bigint REFERENCES products(id), 
quantity integer,
order_id bitint REFERENCES orders(id)
);
