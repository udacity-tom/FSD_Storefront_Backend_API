# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 
    -  ->Route: /products
- Show
    - Route: /products/:id
- Create [token required]
    - Route: /products/create
- [OPTIONAL] Top 5 most popular products 
    - Route: /products/top-5-products
- [OPTIONAL] Products by category (args: product category)
    - Route: /products/category/:category

#### Users
- Index [token required]
    - Route: /users
- Show [token required]
    - Route: /users/:id
- Create N[token required]
    - Route: /users/create

> Additionally the following 'user' routes have been added (together with their modesl/handlers) to aid current/future implementation
>- Authentication (uses users login details (username, password) to authorise and issues a fresh JWT. )
>   - Route: /users/authenticate
>- Delete [token required] (deletes a specific user from the users DB Table)
>   - Route: /users/delete/:id

#### Orders
- Current Order by user (args: user id)[token required]
    - Route: /users/:id/orders/current
    - Route: /users/:id/orders/active (*which route makes more sense?*)
- [OPTIONAL] Completed Orders by user (args: user id)[token required]
    - Route /users/:id/orders/complete

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



#### User
- id
- firstName
- lastName
- password

>Suggested Table:
>For the 'users' table we suggest including a unique username field as such: 
>|id|username|firstname|lastname|password|
>|--|----|------|-------|------|
>|SERIAL PRIMARY KEY|VARCHAR(64) NOT NULL|VARCHAR(64) NOT NULL|VARCHAR(64) NOT NULL|TEXT|

>NOTE: 
>CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR(64) NOT NULL...etc) UNIQUE(username);

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
>SERIAL PRIMARY KEY|bigint REFERNCES users(id)|VARCHAR(20) NOT NULL|


>For an 'orders'/'product' JOIN table we suggest: 
>|id (transaction ID)|product_id|quantity|order_id|
>|--|----------|-------|------|
>|SERIAL PRIMARY KEY|bigint REFERNCES products(id)|integer|bigint REFERENCES orders(id)|