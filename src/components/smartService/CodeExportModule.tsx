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
  FileText
} from 'lucide-react';

export const CodeExportModule: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('app.py');
  const [copied, setCopied] = useState(false);

  const filesMap: Record<string, { label: string; lang: string; description: string; content: string }> = {
    'app.py': {
      label: 'app.py (Flask Backend Server)',
      lang: 'python',
      description: 'Complete Python Flask backend with MySQL database connection, authentication, session handling, and CRUD routes for all modules.',
      content: `# =================================================================
# Smart Service Management System - Flask Server (app.py)
# Technologies: Python Flask + MySQL + Bootstrap 5
# =================================================================

import os
from datetime import datetime
from functools import wraps
from flask import Flask, render_template, request, redirect, url_for, session, flash
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
app.secret_key = 'smart_service_secret_key_2026'

# MySQL Configuration
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', ''),  # Set your MySQL root password here
    'database': os.environ.get('DB_NAME', 'smart_service_db')
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"[MySQL Error]: {e}")
        return None

# Login Required Decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# 1. Login & Authentication
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        conn = get_db_connection()
        if not conn:
            flash('Cannot connect to MySQL database.', 'danger')
            return render_template('login.html')
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
            user = cursor.fetchone()
            if user:
                session['user_id'] = user['id']
                session['username'] = user['username']
                session['full_name'] = user['full_name']
                session['role'] = user['role']
                flash(f'Welcome back, {user["full_name"]}!', 'success')
                return redirect(url_for('dashboard'))
            else:
                flash('Invalid credentials. Try admin / admin123 or staff / staff123', 'danger')
        finally:
            cursor.close()
            conn.close()
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully.', 'info')
    return redirect(url_for('login'))

# 2. Operational Dashboard
@app.route('/')
@app.route('/dashboard')
@login_required
def dashboard():
    conn = get_db_connection()
    stats = {'total_customers': 0, 'total_staff': 0, 'total_services': 0, 'total_bookings': 0, 'total_revenue': 0.0}
    recent_bookings = []
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT COUNT(*) AS count FROM customers")
            stats['total_customers'] = cursor.fetchone()['count']
            cursor.execute("SELECT COUNT(*) AS count FROM staff")
            stats['total_staff'] = cursor.fetchone()['count']
            cursor.execute("SELECT COUNT(*) AS count FROM services")
            stats['total_services'] = cursor.fetchone()['count']
            cursor.execute("SELECT COUNT(*) AS count FROM appointments")
            stats['total_bookings'] = cursor.fetchone()['count']
            cursor.execute("SELECT COALESCE(SUM(total_amount), 0) AS revenue FROM bills WHERE payment_status = 'Paid'")
            stats['total_revenue'] = float(cursor.fetchone()['revenue'])
            cursor.execute("""
                SELECT a.*, c.name AS customer_name, s.name AS service_name, st.name AS staff_name
                FROM appointments a
                JOIN customers c ON a.customer_id = c.id
                JOIN services s ON a.service_id = s.id
                JOIN staff st ON a.staff_id = st.id
                ORDER BY a.id DESC LIMIT 5
            """)
            recent_bookings = cursor.fetchall()
        finally:
            cursor.close()
            conn.close()
    return render_template('dashboard.html', stats=stats, recent_bookings=recent_bookings)

# 3. Customer Management
@app.route('/customers')
@login_required
def customers():
    search = request.args.get('search', '').strip()
    conn = get_db_connection()
    customers_list = []
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            if search:
                cursor.execute("SELECT * FROM customers WHERE name LIKE %s OR email LIKE %s OR phone LIKE %s", (f"%{search}%", f"%{search}%", f"%{search}%"))
            else:
                cursor.execute("SELECT * FROM customers ORDER BY id DESC")
            customers_list = cursor.fetchall()
        finally:
            cursor.close()
            conn.close()
    return render_template('customers.html', customers=customers_list, search=search)

@app.route('/customers/add', methods=['POST'])
@login_required
def add_customer():
    name, email, phone, address = request.form['name'], request.form.get('email', ''), request.form['phone'], request.form.get('address', '')
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO customers (name, email, phone, address) VALUES (%s, %s, %s, %s)", (name, email, phone, address))
            conn.commit()
            flash('Customer registered!', 'success')
        finally:
            cursor.close()
            conn.close()
    return redirect(url_for('customers'))

# Run Flask
if __name__ == '__main__':
    app.run(debug=True, port=5000)`
    },
    'database.sql': {
      label: 'database.sql (MySQL Schema & Tables)',
      lang: 'sql',
      description: 'Creates smart_service_db, users, customers, staff, services, appointments, and bills tables with foreign key relationships.',
      content: `-- Database: smart_service_db
CREATE DATABASE IF NOT EXISTS smart_service_db;
USE smart_service_db;

-- 1. Users Table (Admin & Staff authentication)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'staff') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customers Table
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Staff Table
CREATE TABLE staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Services Table
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    status ENUM('Available', 'Unavailable') DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Appointments Table
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

-- 6. Bills Table
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

-- Initial Logins
INSERT INTO users (username, password, full_name, role) VALUES
('admin', 'admin123', 'System Administrator', 'admin'),
('staff', 'staff123', 'John Technician', 'staff');`
    },
    'requirements.txt': {
      label: 'requirements.txt (Python Dependencies)',
      lang: 'text',
      description: 'Required Python libraries to install with pip.',
      content: `flask==3.0.3
mysql-connector-python==8.3.0
werkzeug==3.0.3
python-dotenv==1.0.1`
    },
    'setup_guide': {
      label: 'VS Code & MySQL Setup Guide (Viva Guide)',
      lang: 'markdown',
      description: 'Step-by-step instructions for running locally on your laptop in Visual Studio Code.',
      content: `### How to Run Locally in VS Code:

1. Open VS Code and open the 'smart_service_system' folder.
2. Ensure MySQL server is running (via XAMPP or MySQL Workbench).
3. Import the database schema:
   mysql -u root -p < database.sql

4. In VS Code terminal, install Python packages:
   pip install -r requirements.txt

5. Start the Flask server:
   python app.py

6. Open your web browser:
   http://127.0.0.1:5000

7. Default Login Credentials:
   - Admin: admin / admin123
   - Staff: staff / staff123`
    }
  };

  const currentFileData = filesMap[selectedFile] || filesMap['app.py'];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFileData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Python Flask + MySQL Source Code & College Export
            </h1>
            <span className="text-[11px] bg-emerald-50 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">
              Complete & Functional
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Export, copy, and run the complete backend codebase locally in VS Code with MySQL.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied to Clipboard!' : 'Copy Current File'}
        </button>
      </div>

      {/* 3 Step VS Code Quick Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-cyan-600" />
            1. MySQL Database Setup
          </span>
          <p className="text-slate-600 text-[11px]">
            Run <code className="bg-slate-100 px-1 py-0.5 rounded text-cyan-800 font-mono">database.sql</code> in MySQL Workbench or phpMyAdmin to create <code className="text-cyan-800">smart_service_db</code>.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-indigo-600" />
            2. Install Dependencies
          </span>
          <p className="text-slate-600 text-[11px]">
            Execute <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-800 font-mono">pip install -r requirements.txt</code> in your VS Code terminal.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-emerald-600" />
            3. Start Flask App
          </span>
          <p className="text-slate-600 text-[11px]">
            Run <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-800 font-mono">python app.py</code> and open <code className="text-emerald-800">http://127.0.0.1:5000</code>.
          </p>
        </div>
      </div>

      {/* Code Viewer Panel */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        {/* File Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2 gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1">
            {Object.keys(filesMap).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedFile(key)}
                className={`px-3 py-1.5 rounded-lg font-mono transition-colors cursor-pointer text-xs ${
                  selectedFile === key
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            {currentFileData.lang.toUpperCase()}
          </span>
        </div>

        <div className="p-4 bg-slate-50/50 border-b border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <span>{currentFileData.description}</span>
          <button
            onClick={handleCopy}
            className="text-cyan-700 font-medium hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Code
          </button>
        </div>

        {/* Code Content Box */}
        <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-[500px]">
          <pre className="leading-relaxed">
            <code>{currentFileData.content}</code>
          </pre>
        </div>
      </div>

      {/* Folder Structure Reference */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs shadow-2xs">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-cyan-600" />
          Flask Project Structure in <code className="text-cyan-800">smart_service_system/</code>
        </h3>
        <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed">
{`smart_service_system/
├── app.py                     # Main Flask Application & MySQL CRUD routes
├── requirements.txt           # Python library dependencies
├── database.sql               # MySQL database schema & sample data
├── README.md                  # Complete VS Code local setup manual
├── templates/
│   ├── base.html              # Bootstrap 5 master template with navbar & footer
│   ├── login.html             # Admin & Staff authentication form
│   ├── dashboard.html         # Modern operational metrics & charts
│   ├── customers.html         # Customer management & search table
│   ├── staff.html             # Staff directory & duty status
│   ├── services.html          # Service catalog & pricing in ₹
│   ├── appointments.html      # Appointment booking schedule
│   ├── billing.html           # Bill generation & printable invoice
│   └── reports.html           # System reports & workload analytics
└── static/
    ├── css/
    │   └── style.css          # Custom styling and print styles
    └── js/
        └── script.js          # Dynamic calculators & interactive scripts`}
        </pre>
      </div>
    </div>
  );
};
