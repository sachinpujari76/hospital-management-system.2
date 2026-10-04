-- =================================================================
-- Database: smart_service_db
-- Project: Smart Service Management System
-- Technologies: Python Flask + MySQL + Bootstrap 5
-- Suitable for: BTech AI & Data Science Mini-Project
-- =================================================================

-- 1. Create Database if it does not already exist
CREATE DATABASE IF NOT EXISTS smart_service_db;
USE smart_service_db;

-- 2. Drop existing tables to allow clean re-import
DROP TABLE IF EXISTS bills;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;

-- 3. Users Table (Authentication for Admin and Staff)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'staff') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Customers Table
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Staff Table
CREATE TABLE staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Services Table
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    status ENUM('Available', 'Unavailable') DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Appointments / Bookings Table
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    service_id INT NOT NULL,
    staff_id INT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
);

-- 8. Bills / Invoices Table
CREATE TABLE bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    service_id INT NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('Paid', 'Unpaid') DEFAULT 'Unpaid',
    bill_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- =================================================================
-- Initial Demo Sample Data
-- =================================================================

-- Default logins:
-- Admin: admin / admin123
-- Staff: staff / staff123
INSERT INTO users (username, password, full_name, role) VALUES
('admin', 'admin123', 'System Administrator', 'admin'),
('staff', 'staff123', 'John Technician', 'staff'),
('priya', 'priya123', 'Priya Sharma', 'staff');

-- Customers
INSERT INTO customers (name, email, phone, address) VALUES
('Rahul Sharma', 'rahul.sharma@example.com', '9876543210', '124 Park Avenue, South Extension, New Delhi'),
('Ananya Patel', 'ananya.p@example.com', '9812345678', 'Plot 45, Jubilee Hills, Hyderabad'),
('Michael Dsouza', 'michael.d@example.com', '9723456789', 'B-12 Sea View Apartments, Bandra, Mumbai'),
('Sneha Reddy', 'sneha.reddy@example.com', '9634567890', '7th Cross Road, Indiranagar, Bengaluru');

-- Staff
INSERT INTO staff (name, role, email, phone, status) VALUES
('Alex Morgan', 'Senior Diagnostic Specialist', 'alex.m@smartservice.com', '9870011223', 'Active'),
('John Technician', 'Field Installation Lead', 'john.t@smartservice.com', '9870044556', 'Active'),
('Priya Sharma', 'Customer Care & Diagnostics', 'priya.s@smartservice.com', '9870077889', 'Active'),
('Karan Verma', 'Hardware Maintenance Engineer', 'karan.v@smartservice.com', '9870099001', 'Active');

-- Services
INSERT INTO services (name, description, price, status) VALUES
('Full System Diagnostics', 'Comprehensive hardware, software, and performance diagnostic checkup.', 799.00, 'Available'),
('Deep Cleaning & Maintenance', 'Complete thermal paste overhaul, dust extraction, and fan optimization.', 1299.00, 'Available'),
('Express Hardware Repair', 'Component-level motherboard and electronic part repair with warranty.', 2499.00, 'Available'),
('OS & Security Setup', 'Clean operating system installation, drivers, firewall, and security patch suite.', 899.00, 'Available'),
('Annual Maintenance Contract (AMC)', 'Unlimited emergency visits and quarterly preventive servicing for one year.', 4999.00, 'Available');

-- Appointments
INSERT INTO appointments (customer_id, service_id, staff_id, booking_date, booking_time, status, notes) VALUES
(1, 1, 1, CURDATE(), '10:00:00', 'Confirmed', 'Customer reported overheating issues and random rebooting.'),
(2, 2, 2, CURDATE(), '11:30:00', 'Pending', 'Urgent annual servicing before client presentation.'),
(3, 3, 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', 'Confirmed', 'Power supply failure replacement requested.'),
(4, 4, 4, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '16:00:00', 'Pending', 'New workstation software installation.');

-- Bills
INSERT INTO bills (bill_number, customer_id, service_id, quantity, price, total_amount, payment_status) VALUES
('INV-2026-001', 1, 1, 1, 799.00, 799.00, 'Paid'),
('INV-2026-002', 3, 3, 1, 2499.00, 2499.00, 'Paid'),
('INV-2026-003', 2, 2, 1, 1299.00, 1299.00, 'Unpaid'),
('INV-2026-004', 4, 4, 1, 899.00, 899.00, 'Unpaid');
