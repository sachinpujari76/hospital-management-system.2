import { Customer, Staff, ServiceItem, Appointment, Bill, UserSession } from '../types/serviceSystem';

export const INITIAL_USER: UserSession = {
  id: 1,
  username: 'admin',
  fullName: 'System Administrator',
  role: 'admin',
  isLoggedIn: true
};

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '9876543210',
    address: '124 Park Avenue, South Extension, New Delhi',
    createdAt: '2026-10-01'
  },
  {
    id: 2,
    name: 'Ananya Patel',
    email: 'ananya.p@example.com',
    phone: '9812345678',
    address: 'Plot 45, Jubilee Hills, Hyderabad',
    createdAt: '2026-10-01'
  },
  {
    id: 3,
    name: 'Michael Dsouza',
    email: 'michael.d@example.com',
    phone: '9723456789',
    address: 'B-12 Sea View Apartments, Bandra, Mumbai',
    createdAt: '2026-10-02'
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    phone: '9634567890',
    address: '7th Cross Road, Indiranagar, Bengaluru',
    createdAt: '2026-10-03'
  }
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: 1,
    name: 'Alex Morgan',
    role: 'Senior Diagnostic Specialist',
    email: 'alex.m@smartservice.com',
    phone: '9870011223',
    status: 'Active',
    createdAt: '2026-09-15'
  },
  {
    id: 2,
    name: 'John Technician',
    role: 'Field Installation Lead',
    email: 'john.t@smartservice.com',
    phone: '9870044556',
    status: 'Active',
    createdAt: '2026-09-20'
  },
  {
    id: 3,
    name: 'Priya Sharma',
    role: 'Customer Care & Diagnostics',
    email: 'priya.s@smartservice.com',
    phone: '9870077889',
    status: 'Active',
    createdAt: '2026-09-25'
  },
  {
    id: 4,
    name: 'Karan Verma',
    role: 'Hardware Maintenance Engineer',
    email: 'karan.v@smartservice.com',
    phone: '9870099001',
    status: 'Active',
    createdAt: '2026-10-01'
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 1,
    name: 'Full System Diagnostics',
    description: 'Comprehensive hardware, software, and performance diagnostic checkup.',
    price: 799.00,
    status: 'Available',
    createdAt: '2026-09-10'
  },
  {
    id: 2,
    name: 'Deep Cleaning & Maintenance',
    description: 'Complete thermal paste overhaul, dust extraction, and fan optimization.',
    price: 1299.00,
    status: 'Available',
    createdAt: '2026-09-10'
  },
  {
    id: 3,
    name: 'Express Hardware Repair',
    description: 'Component-level motherboard and electronic part repair with warranty.',
    price: 2499.00,
    status: 'Available',
    createdAt: '2026-09-12'
  },
  {
    id: 4,
    name: 'OS & Security Setup',
    description: 'Clean operating system installation, drivers, firewall, and security patch suite.',
    price: 899.00,
    status: 'Available',
    createdAt: '2026-09-15'
  },
  {
    id: 5,
    name: 'Annual Maintenance Contract (AMC)',
    description: 'Unlimited emergency visits and quarterly preventive servicing for one year.',
    price: 4999.00,
    status: 'Available',
    createdAt: '2026-09-18'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    customerId: 1,
    customerName: 'Rahul Sharma',
    customerPhone: '9876543210',
    serviceId: 1,
    serviceName: 'Full System Diagnostics',
    servicePrice: 799.00,
    staffId: 1,
    staffName: 'Alex Morgan',
    bookingDate: '2026-10-04',
    bookingTime: '10:00 AM',
    status: 'Confirmed',
    notes: 'Customer reported overheating issues and random rebooting.',
    createdAt: '2026-10-02'
  },
  {
    id: 2,
    customerId: 2,
    customerName: 'Ananya Patel',
    customerPhone: '9812345678',
    serviceId: 2,
    serviceName: 'Deep Cleaning & Maintenance',
    servicePrice: 1299.00,
    staffId: 2,
    staffName: 'John Technician',
    bookingDate: '2026-10-04',
    bookingTime: '11:30 AM',
    status: 'Pending',
    notes: 'Urgent annual servicing before client presentation.',
    createdAt: '2026-10-03'
  },
  {
    id: 3,
    customerId: 3,
    customerName: 'Michael Dsouza',
    customerPhone: '9723456789',
    serviceId: 3,
    serviceName: 'Express Hardware Repair',
    servicePrice: 2499.00,
    staffId: 3,
    staffName: 'Priya Sharma',
    bookingDate: '2026-10-05',
    bookingTime: '02:00 PM',
    status: 'Confirmed',
    notes: 'Power supply failure replacement requested.',
    createdAt: '2026-10-03'
  },
  {
    id: 4,
    customerId: 4,
    customerName: 'Sneha Reddy',
    customerPhone: '9634567890',
    serviceId: 4,
    serviceName: 'OS & Security Setup',
    servicePrice: 899.00,
    staffId: 4,
    staffName: 'Karan Verma',
    bookingDate: '2026-10-06',
    bookingTime: '04:00 PM',
    status: 'Pending',
    notes: 'New workstation software installation.',
    createdAt: '2026-10-03'
  }
];

export const INITIAL_BILLS: Bill[] = [
  {
    id: 1,
    billNumber: 'INV-2026-001',
    customerId: 1,
    customerName: 'Rahul Sharma',
    customerPhone: '9876543210',
    customerEmail: 'rahul.sharma@example.com',
    serviceId: 1,
    serviceName: 'Full System Diagnostics',
    quantity: 1,
    price: 799.00,
    totalAmount: 799.00,
    paymentStatus: 'Paid',
    billDate: '2026-10-02 14:30'
  },
  {
    id: 2,
    billNumber: 'INV-2026-002',
    customerId: 3,
    customerName: 'Michael Dsouza',
    customerPhone: '9723456789',
    customerEmail: 'michael.d@example.com',
    serviceId: 3,
    serviceName: 'Express Hardware Repair',
    quantity: 1,
    price: 2499.00,
    totalAmount: 2499.00,
    paymentStatus: 'Paid',
    billDate: '2026-10-03 16:45'
  },
  {
    id: 3,
    billNumber: 'INV-2026-003',
    customerId: 2,
    customerName: 'Ananya Patel',
    customerPhone: '9812345678',
    customerEmail: 'ananya.p@example.com',
    serviceId: 2,
    serviceName: 'Deep Cleaning & Maintenance',
    quantity: 1,
    price: 1299.00,
    totalAmount: 1299.00,
    paymentStatus: 'Unpaid',
    billDate: '2026-10-03 17:10'
  }
];
