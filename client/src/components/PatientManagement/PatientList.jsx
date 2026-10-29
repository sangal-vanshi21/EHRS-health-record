import React, { useState, useEffect } from 'react';
import { 
  Search, UserPlus, Filter, AlertTriangle, ShieldCheck, 
  ChevronRight, HeartPulse, Activity, Phone, Mail 
} from 'lucide-react';
import { api } from '../../api';
import PatientRegisterModal from './PatientRegisterModal';
import PatientDetailsModal from './PatientDetailsModal';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await api.getPatients({ search: searchQuery, status: statusFilter });
      if (res.success) {
        setPatients(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch patients', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [searchQuery, statusFilter]);

  const handlePatientCreated = (newPat) => {
    fetchPatients();
    setSelectedPatient(newPat);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Epic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Epic 1
            </span>
            <h1 className="text-xl font-bold text-slate-900">Patient Management & Demographics</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise patient master index, insurance verification, medical histories, and allergy safety records. (Planned: 3 Sprints)
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          <UserPlus className="w-4 h-4" />
          Register New Patient
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Registered Patients</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{patients.length}</p>
          <span className="text-2xs text-emerald-600 font-semibold">100% Master Index synced</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Documented Allergies</span>
          <p className="text-2xl font-bold text-rose-600 mt-1">
            {patients.reduce((acc, p) => acc + (p.allergies?.length || 0), 0)}
          </p>
          <span className="text-2xs text-slate-400">Clinical cross-checks active</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Active Insurance Coverage</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {patients.filter(p => p.insurance?.status === 'Active').length}
          </p>
          <span className="text-2xs text-slate-400">Payer verification live</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Chronic Care Cohorts</span>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {patients.filter(p => p.chronicConditions?.length > 0).length}
          </p>
          <span className="text-2xs text-slate-400">Hypertension & Diabetes</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search patients by name, MRN (e.g. MRN-2026-8941), email, or diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none shadow-2xs"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Patients Grid / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-2xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Patient & MRN</th>
                <th className="py-3.5 px-4">Demographics</th>
                <th className="py-3.5 px-4">Insurance Coverage</th>
                <th className="py-3.5 px-4">Allergies & Risk</th>
                <th className="py-3.5 px-4">Primary Conditions</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400">Loading patients...</td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400">
                    No matching patients found.
                  </td>
                </tr>
              ) : (
                patients.map((pat) => (
                  <tr 
                    key={pat.id} 
                    onClick={() => setSelectedPatient(pat)}
                    className="hover:bg-blue-50/40 transition cursor-pointer group"
                  >
                    {/* Patient & MRN */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition">
                          {pat.firstName.charAt(0)}{pat.lastName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 group-hover:text-blue-600 transition block">
                            {pat.firstName} {pat.lastName}
                          </span>
                          <span className="text-2xs font-mono text-slate-400">
                            {pat.mrn}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Demographics */}
                    <td className="py-3 px-4">
                      <span className="text-slate-700 font-medium">{pat.gender}, {pat.dob}</span>
                      <p className="text-2xs text-slate-400 mt-0.5">{pat.phone || 'No phone'}</p>
                    </td>

                    {/* Insurance */}
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 block">
                        {pat.insurance?.provider || 'Self-Pay'}
                      </span>
                      <span className="text-2xs text-slate-400">
                        {pat.insurance?.coverageType} • {pat.insurance?.status}
                      </span>
                    </td>

                    {/* Allergies */}
                    <td className="py-3 px-4">
                      {pat.allergies && pat.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {pat.allergies.map((alg, i) => (
                            <span 
                              key={i} 
                              className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 text-2xs px-2 py-0.5 rounded-full font-semibold"
                            >
                              <AlertTriangle className="w-3 h-3 text-rose-500" />
                              {alg.allergen}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-emerald-600 text-2xs font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> NKDA
                        </span>
                      )}
                    </td>

                    {/* Chronic Conditions */}
                    <td className="py-3 px-4">
                      {pat.chronicConditions && pat.chronicConditions.length > 0 ? (
                        <div className="space-y-0.5">
                          {pat.chronicConditions.slice(0, 2).map((c, i) => (
                            <span key={i} className="block text-2xs text-slate-600 truncate max-w-xs font-medium">
                              • {c.name}
                            </span>
                          ))}
                          {pat.chronicConditions.length > 2 && (
                            <span className="text-2xs text-slate-400">+{pat.chronicConditions.length - 2} more</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-2xs">None recorded</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <button className="text-blue-600 group-hover:translate-x-1 transition p-1 rounded-lg">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Modal */}
      <PatientRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onPatientCreated={handlePatientCreated}
      />

      {/* 360 Patient Details Modal */}
      <PatientDetailsModal
        patient={selectedPatient}
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
    </div>
  );
}
