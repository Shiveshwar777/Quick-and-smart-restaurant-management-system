-- ------------------------------
-- DATABASE: RestaurantDB
-- ------------------------------
CREATE DATABASE RestaurantDB;
USE RestaurantDB;

-- ------------------------------
-- TABLE: signup
-- ------------------------------
CREATE TABLE signup (
    Username VARCHAR(15) PRIMARY KEY,
    Password VARCHAR(255),
   fname VARCHAR(15),
    lname VARCHAR(15)
);

SELECT * FROM signup;

-- ------------------------------
-- TABLE: customer
-- ------------------------------
CREATE TABLE customer (
    Passport_id VARCHAR(20) PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    Contact_No VARCHAR(20)
);

-- ------------------------------
-- TABLE: food
-- ------------------------------
CREATE TABLE food (
    Food_id INT PRIMARY KEY,
    Name VARCHAR(100),
    Price DECIMAL(10,2),
    Description TEXT,
    Specification TEXT,
    Qty INT
);

-- ------------------------------
-- TABLE: menu
-- ------------------------------
CREATE TABLE menu (
    Menu_id INT PRIMARY KEY,
    Food_id INT,
    Category VARCHAR(50),
    FOREIGN KEY (Food_id) REFERENCES food(Food_id)
);

-- ------------------------------
-- TABLE: discounts
-- ------------------------------
CREATE TABLE discounts (
    Discount_id INT PRIMARY KEY,
    Discount_Percentage DECIMAL(5,2),
    Description TEXT
);

-- ------------------------------
-- TABLE: orders
-- ------------------------------
CREATE TABLE orders (
    Order_No INT PRIMARY KEY,
    Ticket_No VARCHAR(20),
    Date DATE,
    Time TIME,
    Class VARCHAR(20),
    Passport_id VARCHAR(20),
    Discount_id INT,
    FOREIGN KEY (Passport_id) REFERENCES customer(Passport_id),
    FOREIGN KEY (Discount_id) REFERENCES discounts(Discount_id)
);

-- ------------------------------
-- TABLE: order_details
-- ------------------------------
CREATE TABLE order_details (
    Order_No INT,
    Food_id INT,
    Qty INT,
    Amount DECIMAL(10,2),
    PRIMARY KEY (Order_No, Food_id),
    FOREIGN KEY (Order_No) REFERENCES orders(Order_No),
    FOREIGN KEY (Food_id) REFERENCES food(Food_id)
);

-- ------------------------------
-- TABLE: payment
-- ------------------------------
CREATE TABLE payment (
    Payment_id INT PRIMARY KEY,
    NetPrice DECIMAL(10,2),
    CashPaid DECIMAL(10,2),
    Order_No INT,
    Discount_id INT,
    FOREIGN KEY (Order_No) REFERENCES orders(Order_No),
    FOREIGN KEY (Discount_id) REFERENCES discounts(Discount_id)
);

-- ------------------------------
-- TABLE: delivery
-- ------------------------------
CREATE TABLE delivery (
    Delivery_id INT PRIMARY KEY,
    Order_No INT,
    Delivery_Status VARCHAR(50),
    Estimated_Time TIME,
    FOREIGN KEY (Order_No) REFERENCES orders(Order_No)
);