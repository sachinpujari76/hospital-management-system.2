/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Doctor, 
  Patient, 
  LabReport, 
  LabCatalogItem, 
  StaffMember, 
  HospitalService, 
  Appointment, 
  ClinicalAlert,
  HospitalBill,
  UserSession
} from './types/hospital';

import { 
  INITIAL_DOCTORS, 
  INITIAL_PATIENTS, 
  INITIAL_LAB_REPORTS, 
  INITIAL_LAB_CATALOG, 
  INITIAL_STAFF, 
  INITIAL_SERVICES, 
  INITIAL_APPOINTMENTS, 
  INITIAL_ALERTS,
  INITIAL_BILLS,
  INITIAL_HOSPITAL_USER
} from './data/initialData';

import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { DoctorsView } from './components/DoctorsView';
import { PatientsView } from './components/PatientsView';
import { AppointmentsView } from './components/AppointmentsView';
import { LaboratoryView } from './components/LaboratoryView';
import { TestsReportsView } from './components/TestsReportsView';
import { StaffView } from './components/StaffView';
import { HospitalBillingView } from './components/HospitalBillingView';
import { PharmacyView } from './components/PharmacyView';
import { RoomsBedsView } from './components/RoomsBedsView';
import { LoginScreen } from './components/LoginScreen';

// Modals
import { AiAssistantModal } from './components/AiAssistantModal';
import { NewPatientModal } from './components/NewPatientModal';
import { AddDoctorModal } from './components/AddDoctorModal';
import { BookAppointmentModal } from './components/BookAppointmentModal';
import { OrderLabModal } from './components/OrderLabModal';
import { ReportViewerModal } from './components/ReportViewerModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('hospital_logged_in') === 'true';
  });

  const [userSession, setUserSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('hospital_user_session');
    return saved ? JSON.parse(saved) : INITIAL_HOSPITAL_USER;
  });

  // Clinical Datasets with LocalStorage Persistence
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('hospital_doctors');
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('hospital_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [labReports, setLabReports] = useState<LabReport[]>(() => {
    const saved = localStorage.getItem('hospital_lab_reports');
    return saved ? JSON.parse(saved) : INITIAL_LAB_REPORTS;
  });

  const [labCatalog, setLabCatalog] = useState<LabCatalogItem[]>(() => {
    const saved = localStorage.getItem('hospital_lab_catalog');
    return saved ? JSON.parse(saved) : INITIAL_LAB_CATALOG;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('hospital_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('hospital_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [bills, setBills] = useState<HospitalBill[]>(() => {
    const saved = localStorage.getItem('hospital_bills');
    return saved ? JSON.parse(saved) : INITIAL_BILLS;
  });

  // Modals Visibility
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [isBookApptModalOpen, setIsBookApptModalOpen] = useState(false);
  const [isOrderLabModalOpen, setIsOrderLabModalOpen] = useState(false);
  const [isCreateBillModalOpen, setIsCreateBillModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [bookingDoctorId, setBookingDoctorId] = useState<string | undefined>(undefined);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hospital_logged_in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('hospital_user_session', JSON.stringify(userSession));
  }, [userSession]);

  useEffect(() => {
    localStorage.setItem('hospital_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('hospital_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('hospital_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('hospital_lab_reports', JSON.stringify(labReports));
  }, [labReports]);

  useEffect(() => {
    localStorage.setItem('hospital_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('hospital_staff', JSON.stringify(staff));
  }, [staff]);

  // Auth Handlers
  const handleLogin = (user: UserSession) => {
    setUserSession(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // CRUD Handlers
  const handleAdmitPatient = (newPatient: Patient) => {
    setPatients(prev => [newPatient, ...prev]);
  };

  const handleDeletePatient = (patientId: string) => {
    setPatients(prev => prev.filter(p => p.id !== patientId));
  };

  const handleAddDoctor = (newDoc: Doctor) => {
    setDoctors(prev => [newDoc, ...prev]);
    setIsAddDoctorModalOpen(false);
  };

  const handleBookAppointment = (newAppt: Appointment) => {
    setAppointments(prev => [newAppt, ...prev]);
  };

  const handleAdvanceLabStatus = (reportId: string) => {
    setLabReports(prev => prev.map(report => {
      if (report.id !== reportId) return report;
      const statusFlow: LabReport['status'][] = [
        'Pending Sample',
        'Sample Received',
        'Analyzing',
        'Pending Review',
        'Verified'
      ];
      const currentIndex = statusFlow.indexOf(report.status);
      const nextStatus = statusFlow[Math.min(currentIndex + 1, statusFlow.length - 1)];
      return {
        ...report,
        status: nextStatus,
        reportedAt: nextStatus === 'Verified' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : report.reportedAt
      };
    }));
  };

  const handleToggleStaffDuty = (staffId: string) => {
    setStaff(prev => prev.map(s => {
      if (s.id !== staffId) return s;
      return { ...s, onDuty: !s.onDuty };
    }));
  };

  const handleAddBill = (newBill: Omit<HospitalBill, 'id'>) => {
    const created: HospitalBill = {
      ...newBill,
      id: `bill-${Date.now()}`
    };
    setBills(prev => [created, ...prev]);
  };

  const handleTogglePaymentStatus = (billId: string) => {
    setBills(prev => prev.map(b => {
      if (b.id !== billId) return b;
      return {
        ...b,
        paymentStatus: b.paymentStatus === 'Paid' ? 'Pending' : 'Paid'
      };
    }));
  };

  const handleDeleteBill = (billId: string) => {
    setBills(prev => prev.filter(b => b.id !== billId));
  };

  const handleOpenDoctorBooking = (doctorId: string) => {
    setBookingDoctorId(doctorId);
    setIsBookApptModalOpen(true);
  };

  // If user is not logged in, render the Login Screen with username & password
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-900 flex antialiased selection:bg-blue-600 selection:text-white">
      {/* Left Sidebar Only (No up navbar) */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        userSession={userSession}
        onLogout={handleLogout}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto max-w-[1600px]">
        {currentTab === 'dashboard' && (
          <DashboardView
            patients={patients}
            doctors={doctors}
            appointments={appointments}
            userSession={userSession}
            onOpenAdmit={() => setIsNewPatientModalOpen(true)}
            onOpenAddDoctor={() => setIsAddDoctorModalOpen(true)}
            onOpenBook={() => { setBookingDoctorId(undefined); setIsBookApptModalOpen(true); }}
            onOpenNewBill={() => { setCurrentTab('billing'); setIsCreateBillModalOpen(true); }}
            onOpenAiAssistant={() => setIsAiModalOpen(true)}
            onLogout={handleLogout}
          />
        )}

        {currentTab === 'patients' && (
          <PatientsView
            patients={patients}
            doctors={doctors}
            onOpenAdmit={() => setIsNewPatientModalOpen(true)}
            onDeletePatient={handleDeletePatient}
            onOpenAiAssistant={() => setIsAiModalOpen(true)}
          />
        )}

        {currentTab === 'doctors' && (
          <DoctorsView
            doctors={doctors}
            onBookDoctor={handleOpenDoctorBooking}
            searchQuery={searchQuery}
          />
        )}

        {currentTab === 'appointments' && (
          <AppointmentsView
            appointments={appointments}
            doctors={doctors}
            onOpenBook={() => { setBookingDoctorId(undefined); setIsBookApptModalOpen(true); }}
            onUpdateStatus={(id: string, status: Appointment['status']) => {
              setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
            }}
          />
        )}

        {currentTab === 'billing' && (
          <HospitalBillingView
            bills={bills}
            patients={patients}
            doctors={doctors}
            onAddBill={handleAddBill}
            onTogglePaymentStatus={handleTogglePaymentStatus}
            onDeleteBill={handleDeleteBill}
            isCreateOpenInitially={isCreateBillModalOpen}
            onCloseCreateModal={() => setIsCreateBillModalOpen(false)}
          />
        )}

        {currentTab === 'pharmacy' && (
          <PharmacyView />
        )}

        {currentTab === 'laboratory' && (
          <LaboratoryView
            labReports={labReports}
            catalog={labCatalog}
            onOpenOrderLab={() => setIsOrderLabModalOpen(true)}
            onAdvanceOrderStatus={handleAdvanceLabStatus}
            onSelectReport={setSelectedReport}
          />
        )}

        {currentTab === 'rooms_beds' && (
          <RoomsBedsView />
        )}

        {currentTab === 'staff' && (
          <StaffView
            staff={staff}
            onToggleDuty={handleToggleStaffDuty}
            onAddStaff={(newMember: StaffMember) => setStaff(prev => [newMember, ...prev])}
          />
        )}
      </main>

      {/* Modals */}
      {isAiModalOpen && (
        <AiAssistantModal
          onClose={() => setIsAiModalOpen(false)}
          doctors={doctors}
          labReports={labReports}
          patients={patients}
          onBookDoctor={(docId: string) => {
            setIsAiModalOpen(false);
            handleOpenDoctorBooking(docId);
          }}
          onOrderLab={() => {
            setIsAiModalOpen(false);
            setIsOrderLabModalOpen(true);
          }}
          onAdmitPatient={() => {
            setIsAiModalOpen(false);
            setIsNewPatientModalOpen(true);
          }}
        />
      )}

      {isNewPatientModalOpen && (
        <NewPatientModal
          doctors={doctors}
          onClose={() => setIsNewPatientModalOpen(false)}
          onSubmit={(newPt) => {
            handleAdmitPatient(newPt);
            setIsNewPatientModalOpen(false);
          }}
        />
      )}

      {isAddDoctorModalOpen && (
        <AddDoctorModal
          onClose={() => setIsAddDoctorModalOpen(false)}
          onSubmit={handleAddDoctor}
        />
      )}

      {isBookApptModalOpen && (
        <BookAppointmentModal
          doctors={doctors}
          preselectedDoctorId={bookingDoctorId}
          onClose={() => setIsBookApptModalOpen(false)}
          onSubmit={(newApt) => {
            handleBookAppointment(newApt);
            setIsBookApptModalOpen(false);
          }}
        />
      )}

      {isOrderLabModalOpen && (
        <OrderLabModal
          catalog={labCatalog}
          doctors={doctors}
          patients={patients}
          onClose={() => setIsOrderLabModalOpen(false)}
          onSubmit={(newReport) => {
            setLabReports(prev => [newReport, ...prev]);
            setIsOrderLabModalOpen(false);
          }}
        />
      )}

      {selectedReport && (
        <ReportViewerModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}
