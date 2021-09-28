INSERT INTO order_products (id, product_id, quantity, order_id) VALUES (1, 6, 2, 5);
INSERT INTO order_products (id, product_id, quantity, order_id) VALUES (2, 6, 2, 4);
INSERT INTO order_products (id, product_id, quantity, order_id) VALUES (3, 6, 3, 2);
INSERT INTO order_products (id, product_id, quantity, order_id) VALUES (4, 5, 4, 2);
INSERT INTO order_products (id, product_id, quantity, order_id) VALUES (5, 3, 10, 2);
INSERT INTO order_products (id, product_id, quantity, order_id) VALUES (6, 4, 10, 1);
INSERT INTO order_products (id, product_id, quantity, order_id) VALUES (7, 4, 2, 4);
ALTER SEQUENCE order_products_id_seq RESTART WITH 8;