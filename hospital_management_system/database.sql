-- =================================================================
-- Database: hospital_management_db
-- Project: Hospital Management System (HMS)
-- Technology: Python Flask + MySQL + Bootstrap 5
-- Suitable for: BTech AI & Data Science / CSE Mini-Project
-- =================================================================

CREATE DATABASE IF NOT EXISTS hospital_management_db;
USE hospital_management_db;

DROP TABLE IF EXISTS bills;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS lab_reports;
DROP TABLE IF EXISTS lab_tests;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS users;

-- 1. Users (Admin, Doctor, Staff Login)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'doctor', 'staff') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Doctors Table
CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    experience_years INT NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    opd_hours VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    consultation_fee DECIMAL(10, 2) NOT NULL,
    status ENUM('On Duty', 'In Surgery', 'In Clinic', 'On Call') DEFAULT 'On Duty',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Patients Table (Inpatient & Outpatient)
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mrn VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    ward_bed VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    doctor_id INT,
    diagnosis TEXT NOT NULL,
    condition_status ENUM('Stable', 'Critical', 'Guarded', 'Recovering') DEFAULT 'Stable',
    admission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
);

-- 4. Laboratory Diagnostic Catalog
CREATE TABLE lab_tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    specimen VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    turnaround_time VARCHAR(50) NOT NULL
);

-- 5. Patient Diagnostic Lab Reports
CREATE TABLE lab_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_number VARCHAR(50) NOT NULL UNIQUE,
    patient_id INT NOT NULL,
    test_id INT NOT NULL,
    doctor_id INT NOT NULL,
    result_value VARCHAR(100) NOT NULL,
    normal_range VARCHAR(100) NOT NULL,
    flag ENUM('Normal', 'High', 'Low', 'Critical High') DEFAULT 'Normal',
    status ENUM('Sample Received', 'Analyzing', 'Pending Review', 'Verified') DEFAULT 'Sample Received',
    pathologist_name VARCHAR(100) DEFAULT 'Dr. Vincent Croft, MD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES lab_tests(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- 6. Medical Staff & Roster
CREATE TABLE staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    shift ENUM('Morning (07:00-15:30)', 'Evening (15:00-23:30)', 'Night (23:00-07:30)') DEFAULT 'Morning (07:00-15:30)',
    on_duty BOOLEAN DEFAULT TRUE,
    extension VARCHAR(20) NOT NULL
);

-- 7. Hospital Services & Specialized Units
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    current_occupancy INT NOT NULL,
    location VARCHAR(100) NOT NULL,
    emergency_24x7 BOOLEAN DEFAULT TRUE
);

-- 8. Appointments & Consultations
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    visit_type VARCHAR(50) DEFAULT 'OPD Consultation',
    status ENUM('Scheduled', 'In Consultation', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- 9. Billing & Invoices
CREATE TABLE bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_number VARCHAR(50) NOT NULL UNIQUE,
    patient_name VARCHAR(100) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    service_description VARCHAR(150) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('Paid', 'Unpaid') DEFAULT 'Unpaid',
    bill_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================================
-- Sample Data Insertion
-- =================================================================

-- Default logins:
-- Admin: admin / admin123
-- Doctor: doctor / doctor123
INSERT INTO users (username, password, full_name, role) VALUES
('admin', 'admin123', 'Medical Director (Admin)', 'admin'),
('doctor', 'doctor123', 'Dr. Elena Vance (Attending)', 'doctor'),
('staff', 'staff123', 'Nurse Rachel Miller', 'staff');

-- Doctors
INSERT INTO doctors (name, specialty, qualification, experience_years, room_number, opd_hours, phone, email, consultation_fee, status) VALUES
('Dr. Elena Vance', 'Cardiology & Catheterization', 'MD (Johns Hopkins), FACC', 16, 'Suite 402', '08:30 - 13:30 (Mon, Wed, Fri)', '+1 555-019-4821', 'e.vance@hospital.org', 175.00, 'In Clinic'),
('Dr. Marcus Thorne', 'Neurology & Neurosurgery', 'MD, PhD (Stanford), FAANS', 19, 'Surgical Core 3', '10:00 - 16:00 (Tue, Thu)', '+1 555-019-7734', 'm.thorne@hospital.org', 210.00, 'In Surgery'),
('Dr. Amara Patel', 'Pediatric Intensive Care', 'MD (Columbia Univ), FAAP', 14, 'Children Room 210', '09:00 - 14:00 (Mon-Thu)', '+1 555-019-3312', 'a.patel@hospital.org', 140.00, 'On Duty'),
('Dr. Samuel Lin', 'Orthopedic & Trauma Surgery', 'MD (Harvard), FACS', 18, 'Ortho Suite 105', '13:00 - 18:00 (Mon, Wed)', '+1 555-019-8902', 's.lin@hospital.org', 190.00, 'On Duty');

-- Patients
INSERT INTO patients (mrn, name, age, gender, blood_group, phone, ward_bed, department, doctor_id, diagnosis, condition_status) VALUES
('MRN-84210', 'Eleanor Sterling', 64, 'Female', 'A+', '9876543210', 'ICU Bed 04', 'Cardiology', 1, 'Acute Coronary Syndrome, post-PCI stent', 'Guarded'),
('MRN-84211', 'Arthur Pendelton', 72, 'Male', 'O+', '9812345678', 'Ward 3B, Bed 12', 'Orthopedics', 4, 'Right femoral neck fracture', 'Recovering'),
('MRN-84212', 'Liam Vance-Keller', 7, 'Male', 'B+', '9723456789', 'Pediatric Room 108', 'Pediatrics', 3, 'Acute bronchiolitis with hypoxemia', 'Stable'),
('MRN-84213', 'Camila Duarte', 39, 'Female', 'O-', '9634567890', 'Trauma Bay 2', 'Emergency & Trauma', 4, 'Polytrauma secondary to motor accident', 'Critical');

-- Lab Tests
INSERT INTO lab_tests (test_code, name, category, specimen, price, turnaround_time) VALUES
('CBC-DIFF', 'Complete Blood Count with Differential', 'Hematology', 'Whole Blood (EDTA)', 350.00, '45 Mins'),
('CMP-14', 'Comprehensive Metabolic Panel (14 Biomarkers)', 'Biochemistry', 'Serum (SST Gold)', 650.00, '60 Mins'),
('TROP-HS', 'High-Sensitivity Troponin I (Cardiac)', 'Cardiology Diagnostic', 'Plasma (Lithium Heparin)', 850.00, '20 Mins'),
('LIPID-FULL', 'Standard Lipid Profile', 'Biochemistry', 'Serum (Gold Top)', 500.00, '90 Mins');

-- Lab Reports
INSERT INTO lab_reports (report_number, patient_id, test_id, doctor_id, result_value, normal_range, flag, status) VALUES
('LAB-2026-88102', 1, 3, 1, '482.4 ng/L', '< 14.0 ng/L', 'Critical High', 'Verified'),
('LAB-2026-88094', 2, 1, 4, '10.4 g/dL', '13.5 - 17.5 g/dL', 'Low', 'Verified'),
('LAB-2026-88110', 4, 1, 4, 'Pending Run', '13.5 - 17.5 g/dL', 'Normal', 'Analyzing');

-- Staff
INSERT INTO staff (employee_id, name, role, department, shift, on_duty, extension) VALUES
('EMP-4019', 'Rachel Miller, RN', 'Nurse Manager & Clinical Supervisor', 'Intensive Care Unit (ICU)', 'Morning (07:00-15:30)', TRUE, 'Ext. 401'),
('EMP-4024', 'Aaron Sterling, MLS', 'Senior Clinical Lab Technologist', 'Central Pathology Lab', 'Morning (07:00-15:30)', TRUE, 'Ext. 612'),
('EMP-4033', 'Chloe Tremblay, RN', 'Emergency Trauma Staff Nurse', 'Emergency & Trauma', 'Evening (15:00-23:30)', TRUE, 'Ext. 119'),
('EMP-4045', 'Devon Bradley, RT', 'Senior Radiologic Technologist', 'Diagnostic Imaging', 'Morning (07:00-15:30)', TRUE, 'Ext. 350');

-- Services
INSERT INTO services (code, name, category, capacity, current_occupancy, location, emergency_24x7) VALUES
('SRV-EMERGENCY', 'Level 1 Emergency & Polytrauma Center', 'Emergency & Trauma', 32, 24, 'Ground Floor, Ambulance Bay', TRUE),
('SRV-ICU', 'Multidisciplinary Intensive Care Units (ICU/CCU)', 'Critical Care', 48, 41, 'Tower A, Floors 2 & 3', TRUE),
('SRV-SURGERY', 'Advanced Robotic Surgical Theaters', 'Surgical Services', 14, 9, 'Wing C, Floor 3', TRUE),
('SRV-LAB', 'Automated Pathology & Molecular Diagnostics Hub', 'Diagnostics', 18, 12, 'Diagnostic Wing, Level B1', TRUE);

-- Appointments
INSERT INTO appointments (patient_name, patient_phone, doctor_id, appointment_date, appointment_time, visit_type, status, notes) VALUES
('Jonathan Davis', '9876543210', 1, CURDATE(), '09:00 AM', 'OPD Consultation', 'Scheduled', 'Annual cardiac rhythm checkup'),
('Grace Linwood', '9812345678', 4, CURDATE(), '11:15 AM', 'Follow-up', 'Scheduled', 'Post-op knee mobility check');

-- Bills
INSERT INTO bills (bill_number, patient_name, patient_phone, service_description, amount, payment_status) VALUES
('INV-2026-901', 'Eleanor Sterling', '9876543210', 'ICU Care & Cardiac Stent Protocol', 24500.00, 'Paid'),
('INV-2026-902', 'Arthur Pendelton', '9812345678', 'Orthopedic Surgery & Inpatient Stay', 18200.00, 'Paid'),
('INV-2026-903', 'Liam Vance-Keller', '9723456789', 'Pediatric Nebulization & Observation', 3400.00, 'Unpaid');
