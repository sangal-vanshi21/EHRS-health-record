import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PatientList from './components/PatientManagement/PatientList';
import ClinicalEncountersView from './components/Clinical/ClinicalEncountersView';
import CpoeOrderView from './components/Orders/CpoeOrderView';
import MedicationManager from './components/Medications/MedicationManager';
import InteroperabilityHub from './components/Interoperability/InteroperabilityHub';
import AgileDashboardView from './components/Agile/AgileDashboardView';
import PatientPortalView from './components/PatientPortal/PatientPortalView';

export default function App() {
  const [activeTab, setActiveTab] = useState('patients');
  const [portalMode, setPortalMode] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-800 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        portalMode={portalMode}
        setPortalMode={setPortalMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {portalMode ? (
          <PatientPortalView />
        ) : (
          <>
            {activeTab === 'patients' && <PatientList />}
            {activeTab === 'encounters' && <ClinicalEncountersView />}
            {activeTab === 'orders' && <CpoeOrderView />}
            {activeTab === 'medications' && <MedicationManager />}
            {activeTab === 'interoperability' && <InteroperabilityHub />}
            {activeTab === 'agile' && <AgileDashboardView />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="font-bold text-slate-800">EHRS01 — Electronic Health Record System</span>
            <p className="text-2xs text-slate-400 mt-0.5">
              Domain: Healthcare and Pharma • Compliant with HL7 v2.5.1 and HL7 FHIR Release 4 (R4)
            </p>
          </div>
          <div className="flex items-center gap-4 text-2xs text-slate-500">
            <span>Client: Large Healthcare Enterprise Network</span>
            <span>•</span>
            <span>Project Manager: Gaurav Kumar</span>
            <span>•</span>
            <span className="font-semibold text-blue-600">EdTech Managed Project</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
