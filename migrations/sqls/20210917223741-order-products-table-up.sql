CREATE TABLE order_products(
id SERIAL PRIMARY KEY, 
product_id bigint REFERENCES products(id), 
quantity integer,
order_id bigint REFERENCES orders(id)
);