import React, { useState } from 'react';
import { 
  FileCode2, 
  Database, 
  Terminal, 
  Copy, 
  Check, 
  FolderTree, 
  BookOpen, 
  Server, 
  Laptop,
  CheckCircle2,
  FileText,
  Download,
  GraduationCap
} from 'lucide-react';

export const CollegeExportView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('app.py');
  const [copied, setCopied] = useState(false);

  const filesMap: Record<string, { label: string; lang: string; description: string; content: string }> = {
    'app.py': {
      label: 'app.py (Flask Backend Server)',
      lang: 'python',
      description: 'Complete Python Flask backend with MySQL database connection, authentication, session handling, and CRUD routes for all hospital management modules.',
      content: `# =================================================================
# Hospital Management System - Complete Flask Backend (app.py)
# Technologies: Python Flask + MySQL + Bootstrap 5 / Modern Web UI
# Suitable for BTech CSE / AI & Data Science Mini-Project Presentation
# =================================================================

import os
from datetime import datetime
from functools import wraps
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
app.secret_key = 'hospital_management_secret_key_2026'

# MySQL Database Configuration
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', ''),  # Set your MySQL root password here
    'database': os.environ.get('DB_NAME', 'hospital_management_db')
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"[MySQL Error]: {e}")
        return None

# Login Authentication Decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            flash('Please log in first to access this module.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# -------------------------------------------------------------
# 1. AUTHENTICATION & LOGIN / LOGOUT
# -------------------------------------------------------------
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        conn = get_db_connection()
        if conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
            user = cursor.fetchone()
            cursor.close()
            conn.close()

            if user:
                session['logged_in'] = True
                session['user_id'] = user['id']
                session['username'] = user['username']
                session['role'] = user['role']
                flash(f"Welcome back, {user['username']}! Logged in as {user['role']}.", 'success')
                return redirect(url_for('dashboard'))
            else:
                flash('Invalid username or password.', 'danger')
        else:
            flash('Database connection failed. Please check MySQL server.', 'danger')

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out successfully.', 'info')
    return redirect(url_for('login'))

# -------------------------------------------------------------
# 2. DASHBOARD
# -------------------------------------------------------------
@app.route('/')
@app.route('/dashboard')
@login_required
def dashboard():
    conn = get_db_connection()
    stats = {
        'total_patients': 0,
        'total_doctors': 0,
        'total_staff': 0,
        'total_services': 0,
        'total_appointments': 0,
        'total_revenue': 0,
        'recent_patients': [],
        'recent_appointments': []
    }

    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT COUNT(*) AS count FROM patients")
        stats['total_patients'] = cursor.fetchone()['count']

        cursor.execute("SELECT COUNT(*) AS count FROM doctors")
        stats['total_doctors'] = cursor.fetchone()['count']

        cursor.execute("SELECT COUNT(*) AS count FROM staff")
        stats['total_staff'] = cursor.fetchone()['count']

        cursor.execute("SELECT COUNT(*) AS count FROM services")
        stats['total_services'] = cursor.fetchone()['count']

        cursor.execute("SELECT COUNT(*) AS count FROM appointments")
        stats['total_appointments'] = cursor.fetchone()['count']

        cursor.execute("SELECT SUM(total_amount) AS revenue FROM bills WHERE payment_status = 'Paid'")
        rev = cursor.fetchone()['revenue']
        stats['total_revenue'] = float(rev) if rev else 0.0

        cursor.execute("SELECT * FROM patients ORDER BY id DESC LIMIT 5")
        stats['recent_patients'] = cursor.fetchall()

        cursor.execute("SELECT * FROM appointments ORDER BY id DESC LIMIT 5")
        stats['recent_appointments'] = cursor.fetchall()

        cursor.close()
        conn.close()

    return render_template('dashboard.html', stats=stats)

# -------------------------------------------------------------
# 3. DOCTORS DIRECTORY (CRUD)
# -------------------------------------------------------------
@app.route('/doctors')
@login_required
def doctors():
    conn = get_db_connection()
    doctors_list = []
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM doctors ORDER BY name ASC")
        doctors_list = cursor.fetchall()
        cursor.close()
        conn.close()
    return render_template('doctors.html', doctors=doctors_list)

@app.route('/doctors/add', methods=['POST'])
@login_required
def add_doctor():
    name = request.form.get('name')
    specialty = request.form.get('specialty')
    department = request.form.get('department')
    qualification = request.form.get('qualification')
    experience_years = request.form.get('experience_years')
    consultation_fee = request.form.get('consultation_fee')
    contact_phone = request.form.get('contact_phone')

    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO doctors (name, specialty, department, qualification, experience_years, consultation_fee, contact_phone, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'on_duty')
        """, (name, specialty, department, qualification, experience_years, consultation_fee, contact_phone))
        conn.commit()
        cursor.close()
        conn.close()
        flash('Doctor added successfully!', 'success')
    return redirect(url_for('doctors'))

# -------------------------------------------------------------
# 4. PATIENTS & INPATIENTS (CRUD)
# -------------------------------------------------------------
@app.route('/patients')
@login_required
def patients():
    search = request.args.get('search', '')
    conn = get_db_connection()
    patients_list = []
    if conn:
        cursor = conn.cursor(dictionary=True)
        if search:
            cursor.execute("SELECT * FROM patients WHERE name LIKE %s OR mrn LIKE %s OR diagnosis LIKE %s", 
                           (f"%{search}%", f"%{search}%", f"%{search}%"))
        else:
            cursor.execute("SELECT * FROM patients ORDER BY id DESC")
        patients_list = cursor.fetchall()
        cursor.close()
        conn.close()
    return render_template('patients.html', patients=patients_list, search=search)

@app.route('/patients/add', methods=['POST'])
@login_required
def add_patient():
    mrn = f"MRN-{datetime.now().strftime('%m%d%H%M')}"
    name = request.form.get('name')
    age = request.form.get('age')
    gender = request.form.get('gender')
    blood_group = request.form.get('blood_group')
    contact_phone = request.form.get('contact_phone')
    room_bed = request.form.get('room_bed')
    department = request.form.get('department')
    diagnosis = request.form.get('diagnosis')
    condition = request.form.get('condition')
    doctor_name = request.form.get('doctor_name')

    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO patients (mrn, name, age, gender, blood_group, contact_phone, room_bed, department, diagnosis, patient_condition, attending_doctor)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (mrn, name, age, gender, blood_group, contact_phone, room_bed, department, diagnosis, condition, doctor_name))
        conn.commit()
        cursor.close()
        conn.close()
        flash('Patient admitted successfully!', 'success')
    return redirect(url_for('patients'))

@app.route('/patients/delete/<int:id>')
@login_required
def delete_patient(id):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM patients WHERE id = %s", (id,))
        conn.commit()
        cursor.close()
        conn.close()
        flash('Patient record removed.', 'info')
    return redirect(url_for('patients'))

# -------------------------------------------------------------
# 5. APPOINTMENTS / OPD BOOKINGS
# -------------------------------------------------------------
@app.route('/appointments')
@login_required
def appointments():
    conn = get_db_connection()
    appointments_list = []
    doctors_list = []
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM appointments ORDER BY appointment_date DESC")
        appointments_list = cursor.fetchall()
        cursor.execute("SELECT id, name, specialty FROM doctors")
        doctors_list = cursor.fetchall()
        cursor.close()
        conn.close()
    return render_template('appointments.html', appointments=appointments_list, doctors=doctors_list)

@app.route('/appointments/create', methods=['POST'])
@login_required
def create_appointment():
    patient_name = request.form.get('patient_name')
    patient_phone = request.form.get('patient_phone')
    doctor_name = request.form.get('doctor_name')
    specialty = request.form.get('specialty')
    appointment_date = request.form.get('appointment_date')
    time_slot = request.form.get('time_slot')
    notes = request.form.get('notes')

    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO appointments (patient_name, patient_phone, doctor_name, specialty, appointment_date, time_slot, notes, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'Scheduled')
        """, (patient_name, patient_phone, doctor_name, specialty, appointment_date, time_slot, notes))
        conn.commit()
        cursor.close()
        conn.close()
        flash('Appointment booked successfully!', 'success')
    return redirect(url_for('appointments'))

# -------------------------------------------------------------
# 6. BILLING & INVOICING
# -------------------------------------------------------------
@app.route('/billing')
@login_required
def billing():
    conn = get_db_connection()
    bills_list = []
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM bills ORDER BY id DESC")
        bills_list = cursor.fetchall()
        cursor.close()
        conn.close()
    return render_template('billing.html', bills=bills_list)

@app.route('/billing/create', methods=['POST'])
@login_required
def create_bill():
    bill_number = f"INV-{datetime.now().strftime('%Y%m%d%H%M')}"
    patient_name = request.form.get('patient_name')
    patient_mrn = request.form.get('patient_mrn')
    service_description = request.form.get('service_description')
    total_amount = float(request.form.get('total_amount', 0))
    payment_method = request.form.get('payment_method')
    payment_status = request.form.get('payment_status', 'Paid')

    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO bills (bill_number, patient_name, patient_mrn, service_description, total_amount, payment_method, payment_status, bill_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (bill_number, patient_name, patient_mrn, service_description, total_amount, payment_method, payment_status, datetime.now().date()))
        conn.commit()
        cursor.close()
        conn.close()
        flash(f'Invoice {bill_number} generated successfully!', 'success')
    return redirect(url_for('billing'))

# -------------------------------------------------------------
# 7. REPORTS & BUSINESS ANALYTICS
# -------------------------------------------------------------
@app.route('/reports')
@login_required
def reports():
    conn = get_db_connection()
    report_data = {'revenue': 0, 'patient_count': 0, 'doctor_count': 0, 'bills': []}
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT SUM(total_amount) AS rev FROM bills WHERE payment_status = 'Paid'")
        report_data['revenue'] = cursor.fetchone()['rev'] or 0
        cursor.execute("SELECT COUNT(*) AS total FROM patients")
        report_data['patient_count'] = cursor.fetchone()['total'] or 0
        cursor.execute("SELECT * FROM bills ORDER BY id DESC LIMIT 10")
        report_data['bills'] = cursor.fetchall()
        cursor.close()
        conn.close()
    return render_template('reports.html', data=report_data)

if __name__ == '__main__':
    # Run Flask server locally on http://127.0.0.1:5000
    app.run(debug=True, host='127.0.0.1', port=5000)
`
    },
    'database.sql': {
      label: 'database.sql (MySQL Database Schema)',
      lang: 'sql',
      description: 'Complete MySQL relational database schema for hospital_management_db with tables for users, doctors, patients, staff, services, appointments, and bills.',
      content: `-- =================================================================
-- Hospital Management System - Complete MySQL Database Schema
-- Database Name: hospital_management_db
-- =================================================================

CREATE DATABASE IF NOT EXISTS hospital_management_db;
USE hospital_management_db;

-- 1. Users Table (Admin & Staff Authentication)
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctor', 'staff') DEFAULT 'staff',
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Users (admin/admin123, doctor/doctor123, staff/staff123)
INSERT INTO users (username, password, role, email) VALUES
('admin', 'admin123', 'admin', 'admin@hospital.org'),
('doctor', 'doctor123', 'doctor', 'doctor@hospital.org'),
('staff', 'staff123', 'staff', 'nurse@hospital.org');

-- 2. Doctors Directory Table
DROP TABLE IF EXISTS doctors;
CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    qualification VARCHAR(150),
    experience_years INT DEFAULT 5,
    consultation_fee DECIMAL(10,2) DEFAULT 150.00,
    cabin_room VARCHAR(50),
    contact_phone VARCHAR(30),
    status ENUM('on_duty', 'in_surgery', 'in_clinic', 'off_duty') DEFAULT 'on_duty'
);

INSERT INTO doctors (name, specialty, department, qualification, experience_years, consultation_fee, cabin_room, contact_phone, status) VALUES
('Dr. Elena Vance', 'Interventional Cardiology', 'Cardiology', 'MD (Johns Hopkins), FACC', 16, 175.00, 'Wing B, Suite 402', '+1 (555) 019-4821', 'in_clinic'),
('Dr. Marcus Thorne', 'Neurology & Neurosurgery', 'Neurology', 'MD, PhD (Stanford), FAANS', 19, 210.00, 'Wing A, Pavilion 3', '+1 (555) 019-7734', 'in_surgery'),
('Dr. Maya Patel', 'Pediatric Intensive Care', 'Pediatrics', 'MD, FAAP (Harvard Medical)', 12, 150.00, 'Children Pavilion, Suite 104', '+1 (555) 019-2245', 'in_clinic'),
('Dr. James Harrison', 'Joint Reconstruction & Trauma', 'Orthopedics', 'MD, FAAOS (Mayo Clinic)', 21, 195.00, 'Orthopedic Wing, Suite 210', '+1 (555) 019-8812', 'on_duty');

-- 3. Patients & Inpatients Table
DROP TABLE IF EXISTS patients;
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mrn VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    blood_group VARCHAR(10),
    contact_phone VARCHAR(30),
    room_bed VARCHAR(50),
    department VARCHAR(100),
    diagnosis VARCHAR(255),
    patient_condition ENUM('Stable', 'Critical', 'Guarded', 'Recovering') DEFAULT 'Stable',
    attending_doctor VARCHAR(100),
    admission_date DATE DEFAULT (CURRENT_DATE)
);

INSERT INTO patients (mrn, name, age, gender, blood_group, contact_phone, room_bed, department, diagnosis, patient_condition, attending_doctor, admission_date) VALUES
('MRN-84210', 'Eleanor Sterling', 62, 'Female', 'O+', '+1 (555) 234-8910', 'ICU-Bed 04', 'Cardiology (ICU)', 'Non-ST Myocardial Infarction', 'Critical', 'Dr. Elena Vance', '2026-10-01'),
('MRN-84211', 'Robert Vance Jr.', 47, 'Male', 'A+', '+1 (555) 912-3847', 'Neuro-Ward 12B', 'Neurology', 'Acute Middle Cerebral Artery TIA', 'Guarded', 'Dr. Marcus Thorne', '2026-10-02'),
('MRN-84212', 'Sophia Lin', 8, 'Female', 'B+', '+1 (555) 345-6712', 'Peds-Bed 08', 'Pediatrics', 'Severe Bronchiolitis with Hypoxia', 'Recovering', 'Dr. Maya Patel', '2026-10-03'),
('MRN-84213', 'David K. Reynolds', 54, 'Male', 'AB+', '+1 (555) 782-9921', 'Ortho-Ward 03', 'Orthopedics', 'Post-Op Total Knee Arthroplasty', 'Stable', 'Dr. James Harrison', '2026-10-04');

-- 4. Hospital Services Table
DROP TABLE IF EXISTS services;
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    bed_count INT DEFAULT 20,
    head_doctor VARCHAR(100),
    base_fee DECIMAL(10,2) DEFAULT 100.00,
    status ENUM('Available', 'Full', 'Maintenance') DEFAULT 'Available'
);

INSERT INTO services (service_code, name, category, bed_count, head_doctor, base_fee, status) VALUES
('SRV-EMERG', '24/7 Level 1 Emergency & Trauma', 'Emergency', 32, 'Dr. Sarah Connor', 250.00, 'Available'),
('SRV-ICU', 'Multidisciplinary Intensive Care Unit', 'Critical Care', 24, 'Dr. Elena Vance', 650.00, 'Available'),
('SRV-SURG', 'Robotic Surgical Suites (OR 1-6)', 'Surgical', 12, 'Dr. Marcus Thorne', 950.00, 'Available'),
('SRV-RAD', 'Diagnostic Radiology & 3T MRI', 'Imaging', 8, 'Dr. Alan Grant', 350.00, 'Available'),
('SRV-LAB', 'Clinical Pathology & Automated Core Lab', 'Laboratory', 40, 'Dr. Victor Chen', 75.00, 'Available');

-- 5. Appointments / OPD Bookings Table
DROP TABLE IF EXISTS appointments;
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    patient_phone VARCHAR(30),
    doctor_name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100),
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(30) NOT NULL,
    notes TEXT,
    status ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO appointments (patient_name, patient_phone, doctor_name, specialty, appointment_date, time_slot, notes, status) VALUES
('Grace Hopper', '+1 (555) 672-1190', 'Dr. Elena Vance', 'Cardiology', '2026-10-04', '09:00 AM', 'Post-cardiac stent follow-up', 'Scheduled'),
('Alan Turing', '+1 (555) 819-3342', 'Dr. Marcus Thorne', 'Neurology', '2026-10-04', '11:00 AM', 'Migraine consult', 'Scheduled');

-- 6. Hospital Bills & Invoices Table
DROP TABLE IF EXISTS bills;
CREATE TABLE bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_number VARCHAR(50) NOT NULL UNIQUE,
    patient_name VARCHAR(100) NOT NULL,
    patient_mrn VARCHAR(30) NOT NULL,
    service_description VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Health Insurance',
    payment_status ENUM('Paid', 'Pending') DEFAULT 'Paid',
    bill_date DATE DEFAULT (CURRENT_DATE)
);

INSERT INTO bills (bill_number, patient_name, patient_mrn, service_description, total_amount, payment_method, payment_status, bill_date) VALUES
('INV-2026-0841', 'Eleanor Sterling', 'MRN-84210', 'ICU Care & Cardiac Diagnostics', 2173.25, 'Health Insurance', 'Paid', '2026-10-03'),
('INV-2026-0842', 'Robert Vance Jr.', 'MRN-84211', 'Neuro Observation Suite & 3T MRI', 1157.50, 'Credit Card', 'Paid', '2026-10-02'),
('INV-2026-0843', 'Sophia Lin', 'MRN-84212', 'Pediatric Clinical Care & Labs', 362.25, 'UPI / Online', 'Pending', '2026-10-04');
`
    },
    'requirements.txt': {
      label: 'requirements.txt (Python Dependencies)',
      lang: 'text',
      description: 'Standard Python pip dependencies required to run the Flask backend and MySQL connector.',
      content: `Flask==3.0.2
mysql-connector-python==8.3.0
python-dotenv==1.0.1
Werkzeug==3.0.1
Jinja2==3.1.3
`
    },
    'guide.md': {
      label: 'Setup Guide & College Presentation Viva Sheet',
      lang: 'markdown',
      description: 'Step-by-step setup commands in VS Code, MySQL database creation, and common Viva questions & answers for your BTech exam / presentation.',
      content: `# Hospital Management System - College Project Guide & Viva Prep

## 1. Quick VS Code Setup Steps

### Step 1: Open Terminal in VS Code
Open your project folder in VS Code and press:
\`Ctrl + \`\` (or go to Terminal -> New Terminal).

### Step 2: Create and Activate Python Virtual Environment
\`\`\`bash
# Create virtual environment
python -m venv venv

# Activate on Windows:
venv\\Scripts\\activate

# Activate on macOS/Linux:
source venv/bin/activate
\`\`\`

### Step 3: Install Required Packages
\`\`\`bash
pip install -r requirements.txt
\`\`\`

---

## 2. MySQL Database Setup Steps

### Step 1: Start MySQL Server
Make sure MySQL is running via XAMPP (click "Start" next to MySQL) or your local MySQL service.

### Step 2: Create Database & Import Tables
You can run this in MySQL Workbench, phpMyAdmin, or MySQL Command Line:
\`\`\`bash
mysql -u root -p < database.sql
\`\`\`
Or open **phpMyAdmin** (\`http://localhost/phpmyadmin\`), create database \`hospital_management_db\`, click **Import**, and choose \`database.sql\`.

### Step 3: Update DB Password in app.py
Open \`app.py\` and set your MySQL root password:
\`\`\`python
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'YOUR_PASSWORD_HERE',  # leave empty '' if no password
    'database': 'hospital_management_db'
}
\`\`\`

---

## 3. Run the Flask Server
\`\`\`bash
python app.py
\`\`\`
Visit: \`http://127.0.0.1:5000\` in your browser!

Default Login Credentials:
- **Admin**: \`admin\` / \`admin123\`
- **Doctor**: \`doctor\` / \`doctor123\`
- **Staff**: \`staff\` / \`staff123\`

---

## 4. BTech Presentation & Viva Questions & Answers

### Q1: What is the main objective of this Hospital Management System?
**Ans:** To digitize hospital clinical operations into a unified platform. It connects doctors, patient admission census, laboratory diagnostics & specimen accessioning, staff duty rosters, OPD appointments, and financial billing into one secure system with AI decision support.

### Q2: What AI capabilities are implemented?
**Ans:** 
1. **AI Clinical Symptom Triage**: Uses Google Gemini to analyze patient symptoms and recommend the appropriate specialist (e.g. Cardiologist vs Neurologist) with clinical urgency flags.
2. **AI Lab Report Explainer**: Translates abnormal pathology values (like elevated Troponin-I or HbA1c) into plain-English summaries for patients and medical staff.
3. **AI Discharge Care Plan Generator**: Automatically synthesizes post-discharge dietary and physical recovery instructions.

### Q3: How is data normalized in the database?
**Ans:** We designed relational tables (\`users\`, \`doctors\`, \`patients\`, \`appointments\`, \`services\`, \`bills\`) with primary keys (\`id\`) and medical record numbers (\`mrn\`) to avoid data redundancy and maintain foreign key integrity across visits and billings.
`
    }
  };

  const currentFile = filesMap[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 p-6 rounded-2xl text-white shadow-md border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                BTech Mini-Project Submission Package
              </span>
              <span className="text-xs text-slate-400">· Full-Stack Source Code</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              Flask & MySQL Hospital Management Backend
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Complete, beginner-friendly Python Flask server code, MySQL database schema, requirements, and viva presentation talking points ready for your college submission and local VS Code execution!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download {selectedFile}
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Code'}
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-700/60 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>Python Flask Backend</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>MySQL: hospital_management_db</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Laptop className="w-4 h-4 text-cyan-400" />
            <span>VS Code + XAMPP Ready</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Viva Q&A Guide Included</span>
          </div>
        </div>
      </div>

      {/* File Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {Object.keys(filesMap).map((fileName) => {
          const file = filesMap[fileName];
          const isSelected = selectedFile === fileName;
          return (
            <button
              key={fileName}
              onClick={() => { setSelectedFile(fileName); setCopied(false); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {fileName === 'app.py' && <FileCode2 className="w-3.5 h-3.5 text-cyan-500" />}
              {fileName === 'database.sql' && <Database className="w-3.5 h-3.5 text-blue-500" />}
              {fileName === 'requirements.txt' && <FileText className="w-3.5 h-3.5 text-emerald-500" />}
              {fileName === 'guide.md' && <BookOpen className="w-3.5 h-3.5 text-amber-500" />}
              <span>{fileName}</span>
            </button>
          );
        })}
      </div>

      {/* Code Display Container */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {/* Editor Top Bar */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            </div>
            <div className="text-xs font-mono text-slate-300">
              {currentFile.label}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{currentFile.description}</span>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-x-auto max-h-[600px] font-mono text-xs text-slate-200 leading-relaxed selection:bg-cyan-500 selection:text-white">
          <pre>{currentFile.content}</pre>
        </div>
      </div>
    </div>
  );
};
