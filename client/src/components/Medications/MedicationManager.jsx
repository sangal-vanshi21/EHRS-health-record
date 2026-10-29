import React, { useState, useEffect } from 'react';
import { Pill, Plus, Search, Filter, AlertTriangle, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '../../api';
import NewPrescriptionModal from './NewPrescriptionModal';

export default function MedicationManager() {
  const [medications, setMedications] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatientFilter, setSelectedPatientFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [medRes, patRes] = await Promise.all([
        api.getMedications({ 
          patientId: selectedPatientFilter, 
          status: selectedStatusFilter 
        }),
        api.getPatients()
      ]);
      if (medRes.success) setMedications(medRes.data);
      if (patRes.success) setPatients(patRes.data);
    } catch (err) {
      console.error('Failed to load medications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedPatientFilter, selectedStatusFilter]);

  const handleDiscontinue = async (medId, drugName) => {
    const reason = window.prompt(`Reason for discontinuing ${drugName}:`, "Therapy completed / clinical re-evaluation");
    if (!reason) return;

    try {
      const res = await api.discontinueMedication(medId, reason);
      if (res.success) {
        fetchData();
      }
    } catch (e) {
      alert(e.message || "Failed to discontinue");
    }
  };

  const getPatientDisplay = (id) => {
    const p = patients.find(pat => pat.id === id);
    return p ? `${p.firstName} ${p.lastName} (${p.mrn})` : id;
  };

  return (
    <div className="space-y-6">
      {/* Epic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Epic 4
            </span>
            <h1 className="text-xl font-bold text-slate-900">Medication Management & Electronic Prescribing (e-Rx)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time allergy contraindication safety checking, active medication lists, and pharmacy network dispatch. (Planned: 3 Sprints)
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Create e-Prescription (e-Rx)
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Filter Patient:</span>
          <select
            value={selectedPatientFilter}
            onChange={(e) => setSelectedPatientFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg outline-none bg-white max-w-xs"
          >
            <option value="">All Patients ({patients.length})</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} — {p.mrn}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Status:</span>
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg outline-none bg-white"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active Regimens</option>
            <option value="Discontinued">Discontinued Regimens</option>
          </select>
        </div>

        <span className="text-slate-400 text-xs ml-auto">
          {medications.length} prescriptions on file
        </span>
      </div>

      {/* Medications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Loading medications...
          </div>
        ) : medications.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No medication orders found. Click "Create e-Prescription" to issue an order.
          </div>
        ) : (
          medications.map(med => (
            <div key={med.id} className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  med.status === 'Active' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{med.drugName}</span>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {med.dosage}
                    </span>
                    <span className="text-2xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {med.id}
                    </span>
                    <span className={`text-2xs font-semibold px-2 py-0.5 rounded-full ${
                      med.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {med.status}
                    </span>
                    {med.overrideReason && (
                      <span className="text-2xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-700" /> Allergy Override
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 mt-1 font-medium">
                    Patient: <strong className="text-slate-900">{getPatientDisplay(med.patientId)}</strong> • <strong>Instructions:</strong> {med.frequency} ({med.route}) • Duration: {med.duration} • Refills: {med.refills}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-2xs text-slate-400 mt-1.5">
                    <span>Prescribed: {med.prescribedDate} by {med.prescribedBy}</span>
                    <span>•</span>
                    <span className="text-indigo-600 font-medium">Pharmacy: {med.pharmacyStatus}</span>
                  </div>

                  {med.overrideReason && (
                    <p className="text-2xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-2">
                      <strong>Clinical Override Note:</strong> {med.overrideReason}
                    </p>
                  )}

                  {med.discontinuedReason && (
                    <p className="text-2xs text-rose-800 bg-rose-50 p-2 rounded-lg border border-rose-200 mt-2">
                      <strong>Discontinuation Reason:</strong> {med.discontinuedReason}
                    </p>
                  )}
                </div>
              </div>

              {med.status === 'Active' && (
                <button
                  onClick={() => handleDiscontinue(med.id, med.drugName)}
                  className="px-3 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold transition shrink-0 self-end sm:self-auto"
                >
                  Discontinue Regimen
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Prescription Modal */}
      <NewPrescriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPrescribed={() => fetchData()}
        patients={patients}
      />
    </div>
  );
}
