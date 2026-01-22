-- ====================================================================
-- FULL DATABASE RESET SCRIPT (DDL + DATA)
-- This script matches the Java Entity classes perfectly.
-- It works by identifying tables 1-by-1 and recreating them.
-- ====================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. DROP ALL TABLES (To ensure clean slate)
DROP TABLE IF EXISTS invoice_detail_table;
DROP TABLE IF EXISTS invoice_header_table;
DROP TABLE IF EXISTS booking_detail_table;
DROP TABLE IF EXISTS booking_header_table;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS car_master;
DROP TABLE IF EXISTS airport_master;
DROP TABLE IF EXISTS hub_master;
DROP TABLE IF EXISTS city_master;
DROP TABLE IF EXISTS state_master;
DROP TABLE IF EXISTS customer_master;
DROP TABLE IF EXISTS add_on_master;
DROP TABLE IF EXISTS car_type_master;

-- 2. CREATE TABLES (In dependency order)

-- State Master
CREATE TABLE state_master (
    state_id INT AUTO_INCREMENT PRIMARY KEY,
    state_name VARCHAR(255)
);

-- City Master
CREATE TABLE city_master (
    city_id INT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(255),
    state_id INT,
    FOREIGN KEY (state_id) REFERENCES state_master(state_id)
);

-- Hub Master
CREATE TABLE hub_master (
    hub_id INT AUTO_INCREMENT PRIMARY KEY,
    hub_name VARCHAR(255),
    hub_address_and_details TEXT,
    contact_number BIGINT UNIQUE,
    city_id INT,
    state_id INT,
    FOREIGN KEY (city_id) REFERENCES city_master(city_id),
    FOREIGN KEY (state_id) REFERENCES state_master(state_id)
);

-- Airport Master
CREATE TABLE airport_master (
    airport_id INT AUTO_INCREMENT PRIMARY KEY,
    airport_name VARCHAR(255),
    airport_code VARCHAR(10),
    city_id INT,
    state_id INT,
    hub_id INT,
    FOREIGN KEY (city_id) REFERENCES city_master(city_id),
    FOREIGN KEY (state_id) REFERENCES state_master(state_id),
    FOREIGN KEY (hub_id) REFERENCES hub_master(hub_id)
);

-- Car Type Master
CREATE TABLE car_type_master (
    cartype_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cartype_name VARCHAR(255),
    daily_rate DOUBLE,
    weekly_rate DOUBLE,
    monthly_rate DOUBLE,
    image_path VARCHAR(255)
);

-- Add On Master
CREATE TABLE add_on_master (
    add_on_id INT AUTO_INCREMENT PRIMARY KEY,
    add_on_name VARCHAR(255),
    add_on_daily_rate DOUBLE,
    rate_valid_until DATETIME(6)
);

-- Customer Master
CREATE TABLE customer_master (
    cust_id INT AUTO_INCREMENT PRIMARY KEY,
    membership_id VARCHAR(255) UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    mobile_number VARCHAR(255),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(255),
    pincode VARCHAR(255),
    phone_number VARCHAR(255),
    credit_card_type VARCHAR(255),
    credit_card_number VARCHAR(255),
    driving_license_number VARCHAR(255),
    idp_number VARCHAR(255),
    issued_bydl VARCHAR(255),
    valid_throughdl DATE,
    passport_number VARCHAR(255),
    passport_valid_through DATE,
    passport_issued_by VARCHAR(255),
    passport_valid_from DATE,
    passport_issue_date DATE,
    date_of_birth DATE
);

-- User
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255) UNIQUE, 
    email VARCHAR(255) UNIQUE,
    role VARCHAR(255),
    hub_id INT,
    FOREIGN KEY (hub_id) REFERENCES hub_master(hub_id)
);

-- Car Master
CREATE TABLE car_master (
    car_id INT AUTO_INCREMENT PRIMARY KEY,
    car_name VARCHAR(255),
    number_plate VARCHAR(255) UNIQUE,
    cartype_id BIGINT,
    hub_id INT,
    is_available VARCHAR(255), -- Enum as String 'Y'/'N'
    status VARCHAR(255),
    mileage DOUBLE,
    maintenance_due_date DATE,
    image_path VARCHAR(255),
    FOREIGN KEY (cartype_id) REFERENCES car_type_master(cartype_id),
    FOREIGN KEY (hub_id) REFERENCES hub_master(hub_id)
);

-- Booking Header Table
CREATE TABLE booking_header_table (
    booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_date DATE,
    confirmation_number VARCHAR(255) UNIQUE,
    booking_status VARCHAR(255),
    cust_id INT NOT NULL,
    start_date DATE,
    end_date DATE,
    pickup_location_id INT,
    return_hub_id INT,
    cartype_id BIGINT,
    car_id INT,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    address VARCHAR(255),
    state VARCHAR(255),
    pin VARCHAR(255),
    daily_rate DOUBLE,
    weekly_rate DOUBLE,
    monthly_rate DOUBLE,
    email_id VARCHAR(255),
    book_car VARCHAR(255),
    pickup_time DATETIME(6),
    pickup_fuel_status VARCHAR(255),
    pickup_condition VARCHAR(255),
    FOREIGN KEY (cust_id) REFERENCES customer_master(cust_id),
    FOREIGN KEY (pickup_location_id) REFERENCES hub_master(hub_id),
    FOREIGN KEY (return_hub_id) REFERENCES hub_master(hub_id),
    FOREIGN KEY (cartype_id) REFERENCES car_type_master(cartype_id),
    FOREIGN KEY (car_id) REFERENCES car_master(car_id)
);

-- Booking Detail Table
CREATE TABLE booking_detail_table (
    booking_detail_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT,
    addon_id INT,
    addon_rate DOUBLE,
    FOREIGN KEY (booking_id) REFERENCES booking_header_table(booking_id),
    FOREIGN KEY (addon_id) REFERENCES add_on_master(add_on_id)
);

-- Invoice Header Table
CREATE TABLE invoice_header_table (
    invoice_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    booking_id BIGINT,
    cust_id INT,
    car_id INT,
    handover_date DATE,
    return_date DATE,
    rental_amt DOUBLE,
    total_addon_amt DOUBLE,
    total_amt DOUBLE,
    customer_details VARCHAR(255),
    rate VARCHAR(255),
    FOREIGN KEY (booking_id) REFERENCES booking_header_table(booking_id),
    FOREIGN KEY (cust_id) REFERENCES customer_master(cust_id),
    FOREIGN KEY (car_id) REFERENCES car_master(car_id)
);

-- Invoice Detail Table
CREATE TABLE invoice_detail_table (
    invdtl_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT,
    addon_id INT,
    addon_amt DOUBLE,
    FOREIGN KEY (invoice_id) REFERENCES invoice_header_table(invoice_id),
    FOREIGN KEY (addon_id) REFERENCES add_on_master(add_on_id)
);

SET FOREIGN_KEY_CHECKS = 1;


-- 3. INSERT TEST DATA

-- Master Data: States & Cities
INSERT INTO state_master (state_name) VALUES 
('Maharashtra'),
('Delhi'),
('Karnataka'),
('Tamil Nadu');

INSERT INTO city_master (city_name, state_id) VALUES 
('Mumbai', 1),
('Pune', 1),
('Nagpur', 1),
('New Delhi', 2),
('Bangalore', 3),
('Chennai', 4);

-- Master Data: Hubs
INSERT INTO hub_master (hub_name, hub_address_and_details, contact_number, city_id, state_id) VALUES 
('Mumbai Central Hub', 'Nariman Point, Mumbai - 400021', 9876543210, 1, 1),
('Pune Airport Hub', 'Lohegaon Airport, Pune', 9876543211, 2, 1),
('Delhi Terminal 3', 'IGI Airport, New Delhi', 9876543212, 4, 2),
('Bangalore Tech Park', 'Whitefield, Bangalore', 9876543213, 5, 3),
('Chennai Marina', 'Marina Beach Road, Chennai', 9876543214, 6, 4);

-- Master Data: Airports
INSERT INTO airport_master (airport_name, airport_code, city_id, state_id, hub_id) VALUES
('Chhatrapati Shivaji Maharaj International Airport', 'BOM', 1, 1, 1),
('Pune International Airport', 'PNQ', 2, 1, 2),
('Indira Gandhi International Airport', 'DEL', 4, 2, 3),
('Kempegowda International Airport', 'BLR', 5, 3, 4),
('Chennai International Airport', 'MAA', 6, 4, 5);

-- Master Data: Car Types
INSERT INTO car_type_master (cartype_name, daily_rate, weekly_rate, monthly_rate, image_path) VALUES 
('Hatchback', 1200, 7500, 28000, 'images/hatchback.jpg'),
('Sedan', 1800, 11000, 42000, 'images/sedan.jpg'),
('SUV', 2500, 15500, 58000, 'images/suv.jpg'),
('Luxury', 5000, 30000, 110000, 'images/luxury.jpg');

-- Master Data: Add-ons
INSERT INTO add_on_master (add_on_name, add_on_daily_rate) VALUES 
('GPS Navigation', 100),
('Child Seat', 150),
('Extra Driver', 300),
('WiFi Hotspot', 120);

-- Master Data: User (Auth)
INSERT INTO user (username, password, email, role, hub_id) VALUES 
('admin', 'admin123', 'admin@fleet.com', 'ADMIN', 1),
('staff_mumbai', 'staff123_mumbai', 'staff.mumbai@fleet.com', 'STAFF', 1),
('staff_pune', 'staff123_pune', 'staff.pune@fleet.com', 'STAFF', 2);

-- Master Data: Customers
INSERT INTO customer_master (first_name, last_name, email, membership_id, mobile_number, address_line1, city, pincode, driving_license_number, passport_number) VALUES 
('Suhas', 'Patil', 'suhas@example.com', 'MEM001', '9988776655', 'Flat 101, Residency', 'Mumbai', '400001', 'MH1234567890', 'P1234567'),
('John', 'Doe', 'john@example.com', 'MEM002', '9123456780', '123 Main St', 'Pune', '411001', 'MH0987654321', 'A9876543'),
('Alice', 'Smith', 'alice@example.com', 'MEM003', '9000000001', '45 Park Ave', 'New Delhi', '110001', 'DL1122334455', 'B5544332');

-- Inventory: Cars
-- Hub 1 (Mumbai)
INSERT INTO car_master (car_name, number_plate, status, mileage, hub_id, is_available, cartype_id, maintenance_due_date) VALUES 
('Swift Dzire', 'MH01-AB-1234', 'Excellent', 20000, 1, 'Y', 2, '2026-06-01'),
('Hyundai Creta', 'MH01-XY-9876', 'Good', 15000, 1, 'Y', 3, '2026-05-15'),
('Baleno', 'MH01-CD-4567', 'Fair', 35000, 1, 'Y', 1, '2026-04-20');

-- Hub 2 (Pune)
INSERT INTO car_master (car_name, number_plate, status, mileage, hub_id, is_available, cartype_id, maintenance_due_date) VALUES 
('Honda City', 'MH12-EF-1111', 'Excellent', 12000, 2, 'Y', 2, '2026-07-10'),
('Innova Crysta', 'MH12-IN-2222', 'Good', 40000, 2, 'Y', 3, '2026-06-25');

-- Hub 3 (Delhi)
INSERT INTO car_master (car_name, number_plate, status, mileage, hub_id, is_available, cartype_id, maintenance_due_date) VALUES 
('Toyota Fortuner', 'DL01-TO-3333', 'Excellent', 5000, 3, 'Y', 4, '2026-08-01');

-- Unavailable/Booked/Maintenance Cars
INSERT INTO car_master (car_name, number_plate, status, mileage, hub_id, is_available, cartype_id, maintenance_due_date) VALUES 
('Tata Nexon', 'MH02-ZZ-5555', 'Maintenance', 50000, 1, 'N', 3, '2026-01-20'), -- In Maintenance
('Mercedes C-Class', 'MH01-QQ-8888', 'Excellent', 8000, 1, 'N', 4, '2026-09-15');   -- Currently Rented

-- Transaction Data: Bookings (Regression Scenarios)

-- Scenario A: Completed Booking (Past)
INSERT INTO booking_header_table (booking_date, confirmation_number, booking_status, cust_id, start_date, end_date, pickup_location_id, return_hub_id, cartype_id, car_id, first_name, last_name, email_id, daily_rate, book_car) VALUES 
('2025-12-01', 'BOK-PAST001', 'COMPLETED', 1, '2025-12-05', '2025-12-10', 1, 1, 2, 1, 'Suhas', 'Patil', 'suhas@example.com', 1800, 'Swift Dzire');

-- Create Invoice for Scenario A (Assume invoice_id generates 1)
INSERT INTO invoice_header_table (date, booking_id, cust_id, car_id, handover_date, return_date, rental_amt, total_amt) VALUES
('2025-12-10', 1, 1, 1, '2025-12-05', '2025-12-10', 9000, 9000);

-- Scenario B: Active Booking (Currently Handed Over / On Trip)
INSERT INTO booking_header_table (booking_date, confirmation_number, booking_status, cust_id, start_date, end_date, pickup_location_id, return_hub_id, cartype_id, car_id, first_name, last_name, email_id, daily_rate, book_car, pickup_time, pickup_fuel_status, pickup_condition) VALUES 
('2026-01-10', 'BOK-ACTIVE01', 'ACTIVE', 2, '2026-01-18', '2026-01-25', 1, 1, 4, 8, 'John', 'Doe', 'john@example.com', 5000, 'Mercedes C-Class', '2026-01-18 10:00:00', 'Full', 'Clean, no scratches');

-- Create Initial Invoice (Handover) for Scenario B
INSERT INTO invoice_header_table (date, booking_id, cust_id, car_id, handover_date, rental_amt) VALUES
('2026-01-18', 2, 2, 8, '2026-01-18', 35000);

-- Scenario C: Confirmed Booking (Future / Ready for Handover Test)
INSERT INTO booking_header_table (booking_date, confirmation_number, booking_status, cust_id, start_date, end_date, pickup_location_id, return_hub_id, cartype_id, car_id, first_name, last_name, email_id, daily_rate, book_car) VALUES 
('2026-01-15', 'BOK-CONFIRM1', 'CONFIRMED', 1, '2026-01-24', '2026-01-28', 2, 2, 2, 4, 'Suhas', 'Patil', 'suhas@example.com', 1800, 'Honda City');

-- Scenario D: Cancelled Booking
INSERT INTO booking_header_table (booking_date, confirmation_number, booking_status, cust_id, start_date, end_date, pickup_location_id, return_hub_id, cartype_id, car_id, first_name, last_name, email_id, daily_rate, book_car) VALUES 
('2026-01-01', 'BOK-CANCEL01', 'CANCELLED', 3, '2026-01-05', '2026-01-07', 3, 3, 1, 6, 'Alice', 'Smith', 'alice@example.com', 1200, 'Toyota Fortuner');
