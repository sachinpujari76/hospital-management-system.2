export type DoctorStatus = 'on_duty' | 'in_surgery' | 'in_clinic' | 'on_call' | 'off_duty';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  department: string;
  qualification: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  cabinRoom: string;
  opdHours: string;
  scheduleDays: string[];
  contactEmail: string;
  contactPhone: string;
  avatarUrl: string;
  status: DoctorStatus;
  biography: string;
  consultationFee: number;
  acceptsEmergency: boolean;
  activeSurgeriesToday?: number;
}

export type TriageLevel = 'resuscitation' | 'emergent' | 'urgent' | 'standard';

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  contactPhone: string;
  roomBed: string;
  department: string;
  admissionDate: string;
  attendingDoctorId: string;
  attendingDoctorName: string;
  diagnosis: string;
  condition: 'Stable' | 'Critical' | 'Guarded' | 'Recovering';
  triageLevel?: TriageLevel;
  allergies: string[];
  insuranceProvider: string;
}

export interface LabParameter {
  name: string;
  result: string | number;
  unit: string;
  normalRangeText: string;
  normalRangeMin?: number;
  normalRangeMax?: number;
  flag: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL_HIGH' | 'CRITICAL_LOW';
  methodology?: string;
}

export type LabOrderStatus = 'Pending Sample' | 'Sample Received' | 'Analyzing' | 'Pending Review' | 'Verified';
export type LabPriority = 'Routine' | 'Urgent' | 'STAT';

export interface LabReport {
  id: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientMrn: string;
  doctorId: string;
  doctorName: string;
  testName: string;
  testCode: string;
  category: 'Hematology' | 'Biochemistry' | 'Microbiology' | 'Endocrinology' | 'Immunology' | 'Molecular' | 'Cardiology Diagnostic';
  specimenType: string;
  specimenBarcode: string;
  priority: LabPriority;
  status: LabOrderStatus;
  orderedAt: string;
  collectedAt?: string;
  reportedAt?: string;
  parameters: LabParameter[];
  clinicalInterpretation?: string;
  pathologistName: string;
  pathologistLicense: string;
  departmentNotes?: string;
}

export interface LabCatalogItem {
  id: string;
  code: string;
  name: string;
  category: string;
  specimen: string;
  turnaroundTime: string;
  standardFee: number;
  fastingRequired: boolean;
  commonIndications: string;
}

export interface StaffMember {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  shift: 'Morning (07:00-15:30)' | 'Evening (15:00-23:30)' | 'Night (23:00-07:30)';
  onDuty: boolean;
  extension: string;
  email: string;
  assignedWard: string;
  joiningYear: number;
}

export interface HospitalService {
  id: string;
  code: string;
  name: string;
  category: 'Emergency & Trauma' | 'Critical Care' | 'Surgical Services' | 'Diagnostics & Imaging' | 'Inpatient Care' | 'Outpatient Clinics' | 'Support Services';
  headDoctor: string;
  bedOrStationCount: number;
  currentOccupancy: number;
  location: string;
  emergencyAvailable24x7: boolean;
  description: string;
  keyEquipments: string[];
  contactDirect: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  timeSlot: string;
  type: 'OPD Consultation' | 'Follow-up' | 'Pre-Op Evaluation' | 'Second Opinion';
  notes: string;
  status: 'Scheduled' | 'Completed' | 'In Consultation' | 'Cancelled';
}

export interface ClinicalAlert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  detail: string;
  timeAgo: string;
  department: string;
}

export interface BillItem {
  id: string;
  description: string;
  category: 'Consultation' | 'Bed Charge' | 'Laboratory' | 'Surgery' | 'Pharmacy' | 'Emergency' | 'Nursing';
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface HospitalBill {
  id: string;
  billNumber: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  billDate: string;
  doctorName: string;
  department: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Partially Paid';
  paymentMethod: 'Cash' | 'Credit Card' | 'Health Insurance' | 'UPI / Online';
  remarks?: string;
}

export interface UserSession {
  username: string;
  name: string;
  role: 'admin' | 'doctor' | 'staff';
  email: string;
  avatar?: string;
}
