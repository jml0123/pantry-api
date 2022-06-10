CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE storage_containers(
    storage_id serial PRIMARY KEY,
    name varchar(50)
);

CREATE TABLE ingredients(
    ingredient_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    name varchar(50),
    perishable boolean,
    exp_date date,
    quantity int,
    date_added date,
    storage_id int,
    product_string varchar(50),
    FOREIGN KEY (storage_id) REFERENCES storage_containers(storage_id)
);

INSERT INTO storage_containers(name)
VALUES
('Refrigerator'),
('Freezer'),
('Sauce Cabinet'),
('Snack Cabinet'),
('Dried Goods Cabinet'),
('Open Shelves'),
('Countertop'),
('Shelf Container');


INSERT INTO ingredients(name, perishable, exp_date, date_added, storage_id, product_string, quantity)
VALUES
('Eggs', true, '2022-06-23', '2022-06-03', 1, NULL, 1),
('Oat Milk', true, '2022-08-09', '2022-06-03', 1, NULL, 1),
('Apple', true, '2022-07-03', '2022-06-03', 1, NULL, 1),
('Cheese puffs', false, '2023-06-03', '2022-06-03', 4, NULL, 1),
('Indomie', false, '2025-06-03', '2022-03-03', 5, NULL, 6);
