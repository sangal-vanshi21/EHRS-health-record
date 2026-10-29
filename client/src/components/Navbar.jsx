import React from 'react';
import { 
  Activity, Users, FileText, FlaskConical, Pill, 
  Network, BarChart3, UserCheck, Stethoscope 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, portalMode, setPortalMode }) {
  const tabs = [
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'encounters', label: 'Clinical Encounters', icon: FileText },
    { id: 'orders', label: 'CPOE & Diagnostics', icon: FlaskConical },
    { id: 'medications', label: 'Medications & e-Rx', icon: Pill },
    { id: 'interoperability', label: 'HL7 & FHIR Hub', icon: Network },
    { id: 'agile', label: 'Agile Metrics', icon: BarChart3 },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Project Tag */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-sm flex items-center justify-center">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">EHRS01</span>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                  HL7 & FHIR R4 Ready
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Node API
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Enterprise Electronic Health Record System</p>
            </div>
          </div>

          {/* Role Mode Switcher & User Pill */}
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold border border-slate-200">
              <button
                onClick={() => setPortalMode(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  !portalMode 
                    ? 'bg-white text-blue-700 shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                Clinician View
              </button>
              <button
                onClick={() => setPortalMode(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  portalMode 
                    ? 'bg-blue-600 text-white shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Patient Portal
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
                {!portalMode ? 'RA' : 'EV'}
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-slate-800">
                  {!portalMode ? 'Dr. Rachel Adams, MD' : 'Eleanor Vance (Patient)'}
                </p>
                <p className="text-slate-500">
                  {!portalMode ? 'Internal Medicine' : 'MRN-2026-8941'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Only in Clinician View) */}
      {!portalMode && (
        <div className="border-t border-slate-100 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
