INSERT INTO products(id, name, price, category) VALUES(1, 'Pen', 1.20, 'stationary');
INSERT INTO products(id, name, price, category) VALUES(2, 'Pencil', 0.5, 'stationary');
INSERT INTO products(id, name, price, category) VALUES(3, 'Pad of Paper', 2.10, 'stationary');
INSERT INTO products(id, name, price, category) VALUES(4, 'Stapler', 5, 'stationary');
INSERT INTO products(id, name, price, category) VALUES(5, 'Desktop Computer', 1000, 'office electronics');
INSERT INTO products(id, name, price, category) VALUES(6, 'Phone', 399, 'office electronics');
ALTER SEQUENCE products_id_seq RESTART WITH 7;