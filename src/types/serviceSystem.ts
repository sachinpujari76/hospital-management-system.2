export type UserRole = 'admin' | 'staff';

export interface UserSession {
  id: number;
  username: string;
  fullName: string;
  role: UserRole;
  isLoggedIn: boolean;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Staff {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface ServiceItem {
  id: number;
  name: string;
  description: string;
  price: number;
  status: 'Available' | 'Unavailable';
  createdAt: string;
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: number;
  customerId: number;
  customerName: string;
  customerPhone: string;
  serviceId: number;
  serviceName: string;
  servicePrice: number;
  staffId: number;
  staffName: string;
  bookingDate: string;
  bookingTime: string;
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
}

export interface Bill {
  id: number;
  billNumber: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: number;
  serviceName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Unpaid';
  billDate: string;
}
