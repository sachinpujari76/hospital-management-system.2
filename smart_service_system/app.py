import os
from datetime import datetime, date, time
from functools import wraps
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
app.secret_key = 'smart_service_secret_key_2026_change_in_production'

# =================================================================
# MySQL Database Configuration
# =================================================================
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', ''),  # Set your MySQL root password here
    'database': os.environ.get('DB_NAME', 'smart_service_db')
}

def get_db_connection():
    """
    Establishes connection to MySQL database.
    Returns connection and cursor with dictionary output.
    """
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"[MySQL Error]: {e}")
        return None

# =================================================================
# Authentication & Role Decorators
# =================================================================
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or session.get('role') != 'admin':
            flash('Admin authorization required for this action.', 'danger')
            return redirect(url_for('dashboard'))
        return f(*args, **kwargs)
    return decorated_function

# =================================================================
# 1. Authentication Routes (Login / Logout)
# =================================================================
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

        conn = get_db_connection()
        if not conn:
            flash('Could not connect to MySQL database. Please verify your MySQL service is running.', 'danger')
            return render_template('login.html')

        try:
            cursor = conn.cursor(dictionary=True)
            query = "SELECT * FROM users WHERE username = %s AND password = %s"
            cursor.execute(query, (username, password))
            user = cursor.fetchone()

            if user:
                session['user_id'] = user['id']
                session['username'] = user['username']
                session['full_name'] = user['full_name']
                session['role'] = user['role']
                flash(f'Welcome back, {user["full_name"]}!', 'success')
                return redirect(url_for('dashboard'))
            else:
                flash('Invalid username or password. Try admin / admin123 or staff / staff123', 'danger')
        except Error as e:
            flash(f'Database error: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out successfully.', 'info')
    return redirect(url_for('login'))

# =================================================================
# 2. Modern Dashboard Route
# =================================================================
@app.route('/dashboard')
@login_required
def dashboard():
    conn = get_db_connection()
    if not conn:
        flash('Database connection failed.', 'danger')
        return render_template('dashboard.html', stats={}, recent_bookings=[], recent_bills=[])

    stats = {
        'total_customers': 0,
        'total_staff': 0,
        'total_services': 0,
        'total_bookings': 0,
        'total_revenue': 0.0,
        'pending_bookings': 0
    }
    recent_bookings = []
    recent_bills = []

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

        cursor.execute("SELECT COUNT(*) AS count FROM appointments WHERE status = 'Pending'")
        stats['pending_bookings'] = cursor.fetchone()['count']

        cursor.execute("SELECT COALESCE(SUM(total_amount), 0) AS revenue FROM bills WHERE payment_status = 'Paid'")
        stats['total_revenue'] = float(cursor.fetchone()['revenue'])

        # Recent activities / appointments
        cursor.execute("""
            SELECT a.id, a.booking_date, a.booking_time, a.status,
                   c.name AS customer_name, s.name AS service_name, st.name AS staff_name
            FROM appointments a
            JOIN customers c ON a.customer_id = c.id
            JOIN services s ON a.service_id = s.id
            JOIN staff st ON a.staff_id = st.id
            ORDER BY a.id DESC LIMIT 5
        """)
        recent_bookings = cursor.fetchall()

        # Recent bills
        cursor.execute("""
            SELECT b.id, b.bill_number, b.total_amount, b.payment_status, b.bill_date,
                   c.name AS customer_name, s.name AS service_name
            FROM bills b
            JOIN customers c ON b.customer_id = c.id
            JOIN services s ON b.service_id = s.id
            ORDER BY b.id DESC LIMIT 5
        """)
        recent_bills = cursor.fetchall()

    except Error as e:
        flash(f'Error loading dashboard metrics: {e}', 'danger')
    finally:
        cursor.close()
        conn.close()

    return render_template('dashboard.html', stats=stats, recent_bookings=recent_bookings, recent_bills=recent_bills)

# =================================================================
# 3. Customer Management Routes
# =================================================================
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
                query = "SELECT * FROM customers WHERE name LIKE %s OR email LIKE %s OR phone LIKE %s ORDER BY id DESC"
                param = f"%{search}%"
                cursor.execute(query, (param, param, param))
            else:
                cursor.execute("SELECT * FROM customers ORDER BY id DESC")
            customers_list = cursor.fetchall()
        except Error as e:
            flash(f'Error retrieving customers: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return render_template('customers.html', customers=customers_list, search=search)

@app.route('/customers/add', methods=['POST'])
@login_required
def add_customer():
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip()
    phone = request.form.get('phone', '').strip()
    address = request.form.get('address', '').strip()

    if not name or not phone:
        flash('Name and Phone are mandatory.', 'warning')
        return redirect(url_for('customers'))

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = "INSERT INTO customers (name, email, phone, address) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (name, email, phone, address))
            conn.commit()
            flash('Customer added successfully!', 'success')
        except Error as e:
            flash(f'Error adding customer: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return redirect(url_for('customers'))

@app.route('/customers/edit/<int:id>', methods=['POST'])
@login_required
def edit_customer(id):
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip()
    phone = request.form.get('phone', '').strip()
    address = request.form.get('address', '').strip()

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = "UPDATE customers SET name = %s, email = %s, phone = %s, address = %s WHERE id = %s"
            cursor.execute(query, (name, email, phone, address, id))
            conn.commit()
            flash('Customer details updated successfully!', 'success')
        except Error as e:
            flash(f'Error updating customer: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return redirect(url_for('customers'))

@app.route('/customers/delete/<int:id>')
@login_required
@admin_required
def delete_customer(id):
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM customers WHERE id = %s", (id,))
            conn.commit()
            flash('Customer deleted successfully.', 'info')
        except Error as e:
            flash(f'Error deleting customer: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return redirect(url_for('customers'))

# =================================================================
# 4. Staff Management Routes
# =================================================================
@app.route('/staff')
@login_required
def staff():
    search = request.args.get('search', '').strip()
    conn = get_db_connection()
    staff_list = []

    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            if search:
                query = "SELECT * FROM staff WHERE name LIKE %s OR role LIKE %s OR email LIKE %s ORDER BY id DESC"
                param = f"%{search}%"
                cursor.execute(query, (param, param, param))
            else:
                cursor.execute("SELECT * FROM staff ORDER BY id DESC")
            staff_list = cursor.fetchall()
        except Error as e:
            flash(f'Error loading staff: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return render_template('staff.html', staff=staff_list, search=search)

@app.route('/staff/add', methods=['POST'])
@login_required
@admin_required
def add_staff():
    name = request.form.get('name', '').strip()
    role = request.form.get('role', '').strip()
    email = request.form.get('email', '').strip()
    phone = request.form.get('phone', '').strip()
    status = request.form.get('status', 'Active')

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = "INSERT INTO staff (name, role, email, phone, status) VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(query, (name, role, email, phone, status))
            conn.commit()
            flash('Staff member added successfully!', 'success')
        except Error as e:
            flash(f'Error adding staff: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return redirect(url_for('staff'))

@app.route('/staff/edit/<int:id>', methods=['POST'])
@login_required
@admin_required
def edit_staff(id):
    name = request.form.get('name', '').strip()
    role = request.form.get('role', '').strip()
    email = request.form.get('email', '').strip()
    phone = request.form.get('phone', '').strip()
    status = request.form.get('status', 'Active')

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = "UPDATE staff SET name = %s, role = %s, email = %s, phone = %s, status = %s WHERE id = %s"
            cursor.execute(query, (name, role, email, phone, status, id))
            conn.commit()
            flash('Staff member updated successfully!', 'success')
        except Error as e:
            flash(f'Error updating staff: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return redirect(url_for('staff'))

@app.route('/staff/delete/<int:id>')
@login_required
@admin_required
def delete_staff(id):
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM staff WHERE id = %s", (id,))
            conn.commit()
            flash('Staff member removed.', 'info')
        except Error as e:
            flash(f'Error deleting staff: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return redirect(url_for('staff'))

# =================================================================
# 5. Service Management Routes
# =================================================================
@app.route('/services')
@login_required
def services():
    search = request.args.get('search', '').strip()
    conn = get_db_connection()
    services_list = []

    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            if search:
                query = "SELECT * FROM services WHERE name LIKE %s OR description LIKE %s ORDER BY id DESC"
                param = f"%{search}%"
                cursor.execute(query, (param, param))
            else:
                cursor.execute("SELECT * FROM services ORDER BY id DESC")
            services_list = cursor.fetchall()
        except Error as e:
            flash(f'Error loading services: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return render_template('services.html', services=services_list, search=search)

@app.route('/services/add', methods=['POST'])
@login_required
@admin_required
def add_service():
    name = request.form.get('name', '').strip()
    description = request.form.get('description', '').strip()
    price = request.form.get('price', 0)
    status = request.form.get('status', 'Available')

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = "INSERT INTO services (name, description, price, status) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (name, description, price, status))
            conn.commit()
            flash('Service added successfully!', 'success')
        except Error as e:
            flash(f'Error adding service: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return redirect(url_for('services'))

@app.route('/services/edit/<int:id>', methods=['POST'])
@login_required
@admin_required
def edit_service(id):
    name = request.form.get('name', '').strip()
    description = request.form.get('description', '').strip()
    price = request.form.get('price', 0)
    status = request.form.get('status', 'Available')

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = "UPDATE services SET name = %s, description = %s, price = %s, status = %s WHERE id = %s"
            cursor.execute(query, (name, description, price, status, id))
            conn.commit()
            flash('Service updated successfully!', 'success')
        except Error as e:
            flash(f'Error updating service: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return redirect(url_for('services'))

@app.route('/services/delete/<int:id>')
@login_required
@admin_required
def delete_service(id):
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM services WHERE id = %s", (id,))
            conn.commit()
            flash('Service removed successfully.', 'info')
        except Error as e:
            flash(f'Error deleting service: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return redirect(url_for('services'))

# =================================================================
# 6. Appointments / Bookings Routes
# =================================================================
@app.route('/appointments')
@login_required
def appointments():
    conn = get_db_connection()
    bookings_list = []
    customers_list = []
    services_list = []
    staff_list = []
    filter_status = request.args.get('status', 'All')

    if conn:
        try:
            cursor = conn.cursor(dictionary=True)

            query = """
                SELECT a.id, a.booking_date, a.booking_time, a.status, a.notes,
                       c.id AS customer_id, c.name AS customer_name, c.phone AS customer_phone,
                       s.id AS service_id, s.name AS service_name, s.price AS service_price,
                       st.id AS staff_id, st.name AS staff_name
                FROM appointments a
                JOIN customers c ON a.customer_id = c.id
                JOIN services s ON a.service_id = s.id
                JOIN staff st ON a.staff_id = st.id
            """
            if filter_status and filter_status != 'All':
                query += " WHERE a.status = %s ORDER BY a.booking_date DESC, a.booking_time DESC"
                cursor.execute(query, (filter_status,))
            else:
                query += " ORDER BY a.booking_date DESC, a.booking_time DESC"
                cursor.execute(query)
            bookings_list = cursor.fetchall()

            # Options for dropdowns
            cursor.execute("SELECT id, name FROM customers ORDER BY name ASC")
            customers_list = cursor.fetchall()

            cursor.execute("SELECT id, name, price FROM services WHERE status = 'Available' ORDER BY name ASC")
            services_list = cursor.fetchall()

            cursor.execute("SELECT id, name, role FROM staff WHERE status = 'Active' ORDER BY name ASC")
            staff_list = cursor.fetchall()

        except Error as e:
            flash(f'Error loading bookings: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return render_template(
        'appointments.html',
        appointments=bookings_list,
        customers=customers_list,
        services=services_list,
        staff=staff_list,
        filter_status=filter_status
    )

@app.route('/appointments/add', methods=['POST'])
@login_required
def add_appointment():
    customer_id = request.form.get('customer_id')
    service_id = request.form.get('service_id')
    staff_id = request.form.get('staff_id')
    booking_date = request.form.get('booking_date')
    booking_time = request.form.get('booking_time')
    status = request.form.get('status', 'Pending')
    notes = request.form.get('notes', '')

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = """
                INSERT INTO appointments (customer_id, service_id, staff_id, booking_date, booking_time, status, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (customer_id, service_id, staff_id, booking_date, booking_time, status, notes))
            conn.commit()
            flash('Appointment scheduled successfully!', 'success')
        except Error as e:
            flash(f'Error booking appointment: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return redirect(url_for('appointments'))

@app.route('/appointments/edit/<int:id>', methods=['POST'])
@login_required
def edit_appointment(id):
    customer_id = request.form.get('customer_id')
    service_id = request.form.get('service_id')
    staff_id = request.form.get('staff_id')
    booking_date = request.form.get('booking_date')
    booking_time = request.form.get('booking_time')
    status = request.form.get('status')
    notes = request.form.get('notes', '')

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = """
                UPDATE appointments
                SET customer_id = %s, service_id = %s, staff_id = %s, booking_date = %s, booking_time = %s, status = %s, notes = %s
                WHERE id = %s
            """
            cursor.execute(query, (customer_id, service_id, staff_id, booking_date, booking_time, status, notes, id))
            conn.commit()
            flash('Appointment updated successfully!', 'success')
        except Error as e:
            flash(f'Error updating appointment: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return redirect(url_for('appointments'))

@app.route('/appointments/delete/<int:id>')
@login_required
def delete_appointment(id):
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM appointments WHERE id = %s", (id,))
            conn.commit()
            flash('Appointment cancelled and removed.', 'info')
        except Error as e:
            flash(f'Error deleting appointment: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return redirect(url_for('appointments'))

# =================================================================
# 7. Billing & Invoicing Routes
# =================================================================
@app.route('/billing')
@login_required
def billing():
    conn = get_db_connection()
    bills_list = []
    customers_list = []
    services_list = []

    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("""
                SELECT b.id, b.bill_number, b.quantity, b.price, b.total_amount, b.payment_status, b.bill_date,
                       c.id AS customer_id, c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email,
                       s.id AS service_id, s.name AS service_name
                FROM bills b
                JOIN customers c ON b.customer_id = c.id
                JOIN services s ON b.service_id = s.id
                ORDER BY b.id DESC
            """)
            bills_list = cursor.fetchall()

            cursor.execute("SELECT id, name FROM customers ORDER BY name ASC")
            customers_list = cursor.fetchall()

            cursor.execute("SELECT id, name, price FROM services WHERE status = 'Available' ORDER BY name ASC")
            services_list = cursor.fetchall()

        except Error as e:
            flash(f'Error loading billing records: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return render_template('billing.html', bills=bills_list, customers=customers_list, services=services_list)

@app.route('/billing/create', methods=['POST'])
@login_required
def create_bill():
    customer_id = request.form.get('customer_id')
    service_id = request.form.get('service_id')
    quantity = int(request.form.get('quantity', 1))
    payment_status = request.form.get('payment_status', 'Unpaid')

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT price FROM services WHERE id = %s", (service_id,))
            service = cursor.fetchone()
            price = float(service['price']) if service else 0.0
            total_amount = price * quantity

            now_str = datetime.now().strftime('%Y%m%d%H%M%S')
            bill_number = f"INV-{now_str[-6:]}"

            insert_query = """
                INSERT INTO bills (bill_number, customer_id, service_id, quantity, price, total_amount, payment_status)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (bill_number, customer_id, service_id, quantity, price, total_amount, payment_status))
            conn.commit()
            flash(f'Invoice {bill_number} generated successfully!', 'success')
        except Error as e:
            flash(f'Error creating bill: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return redirect(url_for('billing'))

@app.route('/billing/status/<int:id>/<status>')
@login_required
def update_bill_status(id, status):
    if status not in ['Paid', 'Unpaid']:
        flash('Invalid status.', 'warning')
        return redirect(url_for('billing'))

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("UPDATE bills SET payment_status = %s WHERE id = %s", (status, id))
            conn.commit()
            flash(f'Bill marked as {status}.', 'success')
        except Error as e:
            flash(f'Error updating bill: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return redirect(url_for('billing'))

@app.route('/billing/delete/<int:id>')
@login_required
@admin_required
def delete_bill(id):
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM bills WHERE id = %s", (id,))
            conn.commit()
            flash('Bill deleted.', 'info')
        except Error as e:
            flash(f'Error deleting bill: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return redirect(url_for('billing'))

# =================================================================
# 8. Analytical Reports Route
# =================================================================
@app.route('/reports')
@login_required
def reports():
    conn = get_db_connection()
    report_data = {
        'total_revenue': 0.0,
        'paid_bills': 0,
        'unpaid_bills': 0,
        'status_breakdown': [],
        'service_popularity': [],
        'staff_workload': [],
        'monthly_revenue': []
    }

    if conn:
        try:
            cursor = conn.cursor(dictionary=True)

            # Revenue summary
            cursor.execute("SELECT COALESCE(SUM(total_amount), 0) AS total FROM bills WHERE payment_status = 'Paid'")
            report_data['total_revenue'] = float(cursor.fetchone()['total'])

            cursor.execute("SELECT COUNT(*) AS count FROM bills WHERE payment_status = 'Paid'")
            report_data['paid_bills'] = cursor.fetchone()['count']

            cursor.execute("SELECT COUNT(*) AS count FROM bills WHERE payment_status = 'Unpaid'")
            report_data['unpaid_bills'] = cursor.fetchone()['count']

            # Appointment status breakdown
            cursor.execute("SELECT status, COUNT(*) AS count FROM appointments GROUP BY status")
            report_data['status_breakdown'] = cursor.fetchall()

            # Service popularity
            cursor.execute("""
                SELECT s.name, COUNT(a.id) AS booking_count, COALESCE(SUM(b.total_amount), 0) AS revenue
                FROM services s
                LEFT JOIN appointments a ON s.id = a.service_id
                LEFT JOIN bills b ON s.id = b.service_id AND b.payment_status = 'Paid'
                GROUP BY s.id, s.name
                ORDER BY booking_count DESC
            """)
            report_data['service_popularity'] = cursor.fetchall()

            # Staff workload
            cursor.execute("""
                SELECT st.name, st.role, COUNT(a.id) AS assigned_bookings
                FROM staff st
                LEFT JOIN appointments a ON st.id = a.staff_id
                GROUP BY st.id, st.name, st.role
                ORDER BY assigned_bookings DESC
            """)
            report_data['staff_workload'] = cursor.fetchall()

        except Error as e:
            flash(f'Error loading reports: {e}', 'danger')
        finally:
            cursor.close()
            conn.close()

    return render_template('reports.html', data=report_data)

# =================================================================
# Entry Point
# =================================================================
if __name__ == '__main__':
    # Default Flask port is 5000, runs with debug=True for local student development
    print("===============================================================")
    print(" Smart Service Management System - Flask Server")
    print(" Database: MySQL (smart_service_db)")
    print(" Default Login: admin / admin123  OR  staff / staff123")
    print(" URL: http://127.0.0.1:5000")
    print("===============================================================")
    app.run(debug=True, port=5000)
