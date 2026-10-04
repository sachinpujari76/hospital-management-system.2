# Smart Service Management System (Full-Stack Python Flask & MySQL)

A beginner-friendly, production-grade **Full-Stack Management System** built with **Python Flask**, **MySQL**, and **Bootstrap 5**. Designed specifically for BTech AI & Data Science / Computer Science college mini-projects, full-stack evaluations, and viva presentations.

---

## 🛠️ Technology Stack

* **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.3, Bootstrap Icons, FontAwesome
* **Backend**: Python Flask 3.0+
* **Database**: MySQL 8.0+ (Database Name: `smart_service_db`)
* **Environment**: VS Code / Command Line

---

## 🚀 Key Modules & Features

1. **Authentication & Roles**:
   * Admin Login (`admin` / `admin123`) & Staff Login (`staff` / `staff123`)
   * Session-based access control, role authorization, and secure logout
2. **Operational Dashboard**:
   * Metrics for total customers, staff, services, bookings, and revenue
   * Recent bookings table and latest generated invoices
3. **Customer Management**:
   * Add, view, edit, delete, and live search customers by name, phone, or email
4. **Staff Management**:
   * Technician & staff directory, designation management, and availability status
5. **Service Catalog**:
   * Service name, pricing in INR (₹), description, and Available/Unavailable toggle
6. **Appointment & Booking Management**:
   * Schedule customer appointments with assigned technicians, date, time, and status filter
7. **Billing & Invoices**:
   * Instant invoice generation with dynamic price calculation, payment status toggle, and printable PDF receipt
8. **Reports & Analytics**:
   * Status distribution bar charts, technician workload allocation, and service popularity revenue breakdown

---

## 📋 Step-by-Step Local Setup Guide (VS Code)

### Step 1: Open the Project in VS Code
1. Launch **Visual Studio Code**.
2. Go to **File** > **Open Folder...** and select the `smart_service_system` directory.
3. Open a new terminal inside VS Code: `Ctrl + ~` (Windows/Linux) or `Cmd + ~` (Mac).

---

### Step 2: Set Up MySQL Database
1. Open your **MySQL Workbench**, **XAMPP / phpMyAdmin**, or **MySQL Command Line**.
2. Run the provided SQL script to automatically create the database and sample data:

```bash
# If using MySQL Command Line (enter your MySQL root password when prompted):
mysql -u root -p < database.sql
```

*Or inside MySQL Workbench / phpMyAdmin:*
1. Create database: `CREATE DATABASE smart_service_db;`
2. Open `database.sql` and click **Execute**.

---

### Step 3: Configure Database Credentials in `app.py`
Open `app.py` and verify line 17 (`DB_CONFIG`):
```python
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '', # <--- Enter your MySQL root password here (leave empty if using default XAMPP)
    'database': 'smart_service_db'
}
```

---

### Step 4: Create Virtual Environment & Install Dependencies

Run the following commands in the VS Code terminal:

```bash
# 1. Create a virtual environment (optional but recommended)
python -m venv venv

# 2. Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# 3. Install required packages
pip install -r requirements.txt
```

---

### Step 5: Run the Flask Application

Run:
```bash
python app.py
```

You will see:
```text
===============================================================
 Smart Service Management System - Flask Server
 Database: MySQL (smart_service_db)
 Default Login: admin / admin123  OR  staff / staff123
 URL: http://127.0.0.1:5000
===============================================================
 * Running on http://127.0.0.1:5000
```

Open your browser and navigate to:
👉 **`http://127.0.0.1:5000`**

---

## 🔑 Default Login Credentials

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | Full Access (Add/Edit/Delete all records) |
| **Technician / Staff** | `staff` | `staff123` | Operational Access (Bookings, Billing, Customers) |

---

## 🎓 College Viva & Presentation Tips

* **Database Architecture**: Explain normalization between `customers`, `services`, `staff`, `appointments`, and `bills`.
* **Foreign Keys**: Show how cascading foreign keys prevent orphaned appointments when a customer is removed.
* **Security**: Demonstrate session authentication and how `@login_required` and `@admin_required` decorators prevent unauthorized access.
* **Real-world Value**: Explain how this system saves manual paperwork, tracks technician productivity, and automates tax invoice generation.
