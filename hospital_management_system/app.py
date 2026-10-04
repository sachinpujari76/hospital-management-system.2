import os
from datetime import datetime, date
from functools import wraps
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
app.secret_key = 'hospital_management_secret_key_2026'

# =================================================================
# MySQL Database Configuration
# =================================================================
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', ''),  # Set your MySQL root password here
    'database': os.environ.get('DB_NAME', 'hospital_management_db')
}

def get_db():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        if conn.is_connected():
            return conn
    except Error as e:
        print(f"[MySQL Connection Error]: {e}")
        return None

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access the Hospital Management System.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated

# 1. Login & Logout
@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        conn = get_db()
        if not conn:
            flash('Database offline. Please check if your MySQL server is running.', 'danger')
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
                flash(f'Welcome, {user["full_name"]}!', 'success')
                return redirect(url_for('dashboard'))
            else:
                flash('Invalid credentials. Demo: admin/admin123 or doctor/doctor123', 'danger')
        finally:
            cursor.close()
            conn.close()
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully.', 'info')
    return redirect(url_for('login'))

# 2. Executive Clinical Dashboard
@app.route('/dashboard')
@login_required
def dashboard():
    conn = get_db()
    stats = {
        'total_doctors': 0,
        'total_patients': 0,
        'total_lab_tests': 0,
        'total_appointments': 0,
        'total_revenue': 0.0,
        'bed_occupancy': '85%'
    }
    recent_patients = []
    recent_reports = []
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT COUNT(*) AS c FROM doctors")
            stats['total_doctors'] = cursor.fetchone()['c']
            cursor.execute("SELECT COUNT(*) AS c FROM patients")
            stats['total_patients'] = cursor.fetchone()['c']
            cursor.execute("SELECT COUNT(*) AS c FROM lab_reports WHERE status != 'Verified'")
            stats['total_lab_tests'] = cursor.fetchone()['c']
            cursor.execute("SELECT COUNT(*) AS c FROM appointments")
            stats['total_appointments'] = cursor.fetchone()['c']
            cursor.execute("SELECT COALESCE(SUM(amount), 0) AS rev FROM bills WHERE payment_status = 'Paid'")
            stats['total_revenue'] = float(cursor.fetchone()['rev'])

            # Recent Inpatient Census
            cursor.execute("""
                SELECT p.*, d.name AS doctor_name 
                FROM patients p 
                LEFT JOIN doctors d ON p.doctor_id = d.id 
                ORDER BY p.id DESC LIMIT 5
            """)
            recent_patients = cursor.fetchall()

            # Recent Lab Reports
            cursor.execute("""
                SELECT r.*, p.name AS patient_name, t.name AS test_name 
                FROM lab_reports r 
                JOIN patients p ON r.patient_id = p.id 
                JOIN lab_tests t ON r.test_id = t.id 
                ORDER BY r.id DESC LIMIT 4
            """)
            recent_reports = cursor.fetchall()
        finally:
            cursor.close()
            conn.close()
    return render_template('dashboard.html', stats=stats, recent_patients=recent_patients, recent_reports=recent_reports)

# 3. Doctors Management
@app.route('/doctors')
@login_required
def doctors():
    search = request.args.get('search', '').strip()
    conn = get_db()
    doctor_list = []
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            if search:
                cursor.execute("SELECT * FROM doctors WHERE name LIKE %s OR specialty LIKE %s", (f"%{search}%", f"%{search}%"))
            else:
                cursor.execute("SELECT * FROM doctors ORDER BY id ASC")
            doctor_list = cursor.fetchall()
        finally:
            cursor.close()
            conn.close()
    return render_template('doctors.html', doctors=doctor_list, search=search)

@app.route('/doctors/add', methods=['POST'])
@login_required
def add_doctor():
    name = request.form['name']
    specialty = request.form['specialty']
    qualification = request.form['qualification']
    exp = int(request.form.get('experience_years', 5))
    room = request.form['room_number']
    hours = request.form['opd_hours']
    phone = request.form['phone']
    email = request.form['email']
    fee = float(request.form.get('consultation_fee', 150))
    status = request.form.get('status', 'On Duty')

    conn = get_db()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO doctors (name, specialty, qualification, experience_years, room_number, opd_hours, phone, email, consultation_fee, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (name, specialty, qualification, exp, room, hours, phone, email, fee, status))
            conn.commit()
            flash('Doctor registered successfully!', 'success')
        finally:
            cursor.close()
            conn.close()
    return redirect(url_for('doctors'))

# 4. Patients & Inpatient Census
@app.route('/patients')
@login_required
def patients():
    conn = get_db()
    patient_list = []
    doctor_list = []
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("""
                SELECT p.*, d.name AS doctor_name 
                FROM patients p 
                LEFT JOIN doctors d ON p.doctor_id = d.id 
                ORDER BY p.id DESC
            """)
            patient_list = cursor.fetchall()
            cursor.execute("SELECT id, name, specialty FROM doctors")
            doctor_list = cursor.fetchall()
        finally:
            cursor.close()
            conn.close()
    return render_template('patients.html', patients=patient_list, doctors=doctor_list)

@app.route('/patients/admit', methods=['POST'])
@login_required
def admit_patient():
    name = request.form['name']
    age = int(request.form['age'])
    gender = request.form['gender']
    blood = request.form['blood_group']
    phone = request.form['phone']
    bed = request.form['ward_bed']
    dept = request.form['department']
    doc_id = request.form['doctor_id']
    diag = request.form['diagnosis']
    condition = request.form['condition_status']
    mrn = f"MRN-{int(datetime.now().timestamp()) % 100000}"

    conn = get_db()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO patients (mrn, name, age, gender, blood_group, phone, ward_bed, department, doctor_id, diagnosis, condition_status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (mrn, name, age, gender, blood, phone, bed, dept, doc_id, diag, condition))
            conn.commit()
            flash(f'Patient {name} admitted successfully (MRN: {mrn})!', 'success')
        finally:
            cursor.close()
            conn.close()
    return redirect(url_for('patients'))

# 5. Laboratory & Tests Reports
@app.route('/laboratory')
@login_required
def laboratory():
    conn = get_db()
    catalog = []
    reports = []
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM lab_tests ORDER BY id ASC")
            catalog = cursor.fetchall()
            cursor.execute("""
                SELECT r.*, p.name AS patient_name, p.mrn, t.name AS test_name, t.specimen, d.name AS doctor_name
                FROM lab_reports r
                JOIN patients p ON r.patient_id = p.id
                JOIN lab_tests t ON r.test_id = t.id
                JOIN doctors d ON r.doctor_id = d.id
                ORDER BY r.id DESC
            """)
            reports = cursor.fetchall()
        finally:
            cursor.close()
            conn.close()
    return render_template('laboratory.html', catalog=catalog, reports=reports)

# 6. Staff & Roster
@app.route('/staff')
@login_required
def staff():
    conn = get_db()
    staff_list = []
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM staff ORDER BY id ASC")
            staff_list = cursor.fetchall()
        finally:
            cursor.close()
            conn.close()
    return render_template('staff.html', staff=staff_list)

# 7. Hospital Services
@app.route('/services')
@login_required
def services():
    conn = get_db()
    service_list = []
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM services ORDER BY id ASC")
            service_list = cursor.fetchall()
        finally:
            cursor.close()
            conn.close()
    return render_template('services.html', services=service_list)

# 8. Appointments
@app.route('/appointments')
@login_required
def appointments():
    conn = get_db()
    appointments_list = []
    doctors_list = []
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("""
                SELECT a.*, d.name AS doctor_name, d.specialty 
                FROM appointments a 
                JOIN doctors d ON a.doctor_id = d.id 
                ORDER BY a.id DESC
            """)
            appointments_list = cursor.fetchall()
            cursor.execute("SELECT id, name, specialty FROM doctors")
            doctors_list = cursor.fetchall()
        finally:
            cursor.close()
            conn.close()
    return render_template('appointments.html', appointments=appointments_list, doctors=doctors_list)

# 9. Billing
@app.route('/billing')
@login_required
def billing():
    conn = get_db()
    bills_list = []
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM bills ORDER BY id DESC")
            bills_list = cursor.fetchall()
        finally:
            cursor.close()
            conn.close()
    return render_template('billing.html', bills=bills_list)

if __name__ == '__main__':
    print("=================================================================")
    print(" Hospital Management System (HMS) - Flask & MySQL Backend")
    print(" Database: hospital_management_db")
    print(" Default Login: admin / admin123  OR  doctor / doctor123")
    print(" Local URL: http://127.0.0.1:5000")
    print("=================================================================")
    app.run(debug=True, port=5000)
