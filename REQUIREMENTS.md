# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 
    - An INDEX (READ) Route: <span style="color:skyblue">/products</span>  [GET]
- Show
    - A SHOW (READ) Route: <span style="color:skyblue">/products/:id</span>   [GET]
- Create [token required]
    - A CREATE Route: <span style="color:skyblue">/products/create</span>   [POST]
- [OPTIONAL] Top 5 most popular products 
    - A Top 5 DASHBOARD Route: <span style="color:skyblue">/products/info/top-5-products</span>  [GET]
- [OPTIONAL] Products by category (args: product category)
    - A CATEGORY Route: <span style="color:skyblue">/products/category/:category</span>   [GET]
> Additionally the following additional 'products' routes have been added (together with their models/handlers) to aid current/future implementation
>- Update [token required] (takes an updated set of 'Product' type parameters in body)
>   - An UPDATE Route: <span style="color:skyblue">/products/:id</span>  [PUT]
>- Delete [token required] (deletes a specific product id)
>   - A DELETE Route: <span style="color:skyblue">/products/:id</span>  [DELETE]

#### Users
- Index [token required]
    - An INDEX Route: <span style="color:skyblue">/users</span>   [GET]
- Show [token required]
    - A SHOW Route: <span style="color:skyblue">/users/:id</span>  [GET]
- Create N[token required]
    - A CREATE Route: <span style="color:skyblue">/users/create</span>   [POST]

> Additionally the following additional 'user' routes have been added (together with their models/handlers) to aid current/future implementation
>- Authentication (args: username, password. Allows authorisation and issues an update JWT on success. )
>   - An AUTHENTICATION Route: <span style="color:skyblue">/users/authenticate</span>  [POST]
>- Delete [token required] (args: user ID, id.  Deletes a specific user from the users DB Table)
>   - A DELETE Route: <span style="color:skyblue">/users/:id</span>  [DELETE]
>- Update [token required] (args: user ID, id.  Updates users details, username, firstname, lastname)
>   - An UPDATE Route: <span style="color:skyblue">/users/:id</span>  [PUT]
#### Orders
- Current Order by user (args: user id)[token required]
    - A SHOW Route: <span style="color:skyblue">/users/:id/orders</span>  [GET]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]
    - Route <span style="color:skyblue">/users/:id/orders/complete/all</span>  [GET]

>Additionally the following additional 'orders' routes have been added (together with their models/handlers) to aid current/future implementation
>- Show all orders [token required]
>   - An INDEX (READ) Route: <span style="color:skyblue">/orders</span>   [GET]
>- Show only a specific order (args: order ID (oid)) [token required]
>   - A SHOW (READ) Route: <span style="color:skyblue">/orders/:oid</span>   [GET]
>- shows details of order (args: user (id),  order (oid)) [token required]
>   - A SHOW (READ) Route: <span style="color:skyblue">/users/:id/orders/:oid</span>   [GET]
>- Create Order by user (args: user id) [token required] (Returns order details in json body)
>    - A CREATE Route: <span style="color:skyblue">/users/:id/orders/create/</span>  [POST]
>- Add products to order (args: user ID, id, order ID, oid)  [token required]
>   - A CREATE Route: <span style="color:skyblue">/users/:id/orders/:oid/add-product</span>  [POST]
>- Delete Order (args: user ID,id. Order ID, oid)   [token required]
>   - A DELETE Route: <span style="color:skyblue">/users/:id/orders/:oid</span>  [DELETE]


## Data Shapes
#### Product
-  id 
- name
- price
- [OPTIONAL] category

>Suggested Table: 
>For the 'products' table we will create the following: 
>
>|id|name|price|category|
>|--|----|------|-------|
>|serial PRIMARY KEY|VARCHAR(64) NOT NULL|NUMERIC(8,2) NOT NULL|VARCHAR(64)|

>``CREATE TABLE products(
>id serial PRIMARY KEY, 
>name VARCHAR(64) NOT NULL, 
>price NUMERIC(8, 2) NOT NULL, 
>category VARCHAR(64)
>);``

#### User
- id
- firstName
- lastName
- password

>Suggested Table:
>For the 'users' table we are including a unique username field as such: 
>|id|username (UNIQUE)|firstname|lastname|password|
>|--|----|------|-------|------|
>|serial PRIMARY KEY|VARCHAR(64) NOT NULL|VARCHAR(64) NOT NULL|VARCHAR(64) NOT NULL|TEXT|

>``CREATE TABLE users(
id serial PRIMARY KEY, 
username VARCHAR(64) NOT NULL, 
firstname VARCHAR(64) NOT NULL,
lastname VARCHAR(64) NOT NULL,
pasword TEXT) 
UNIQUE(username);``

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

>Suggested Tables:

>In order to track orders/products more appropriately we'll use two tables.

>One to track orders, another to track orders and products.

>For the 'orders' table we'll create an appropriate table so: 
>|id|user_id|status|
>|--|----|------|
>serial PRIMARY KEY|bigint REFERENCES users(id)|VARCHAR(20) NOT NULL|

>``CREATE TABLE orders(
id serial PRIMARY KEY, 
user_id bigint REFERENCES users(id), 
status VARCHAR(20) NOT NULL
);``

>For an 'orders'/'product' JOIN table we will use: 
>|id (transaction ID)|product_id|quantity|order_id|
>|--|----------|-------|------|
>|serial PRIMARY KEY|bigint REFERENCES products(id)|integer|bigint REFERENCES orders(id)|

>``CREATE TABLE order_products(
id serial PRIMARY KEY, 
product_id bigint REFERENCES products(id), 
quantity integer,
order_id bigint REFERENCES orders(id)
);``
