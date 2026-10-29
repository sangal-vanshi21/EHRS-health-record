import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, User, Calendar, Stethoscope, Activity, 
  Search, CheckCircle2, HeartPulse, Clock 
} from 'lucide-react';
import { api } from '../../api';
import NewEncounterModal from './NewEncounterModal';

export default function ClinicalEncountersView() {
  const [encounters, setEncounters] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatientFilter, setSelectedPatientFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [encRes, patRes] = await Promise.all([
        api.getEncounters(selectedPatientFilter),
        api.getPatients()
      ]);
      if (encRes.success) setEncounters(encRes.data);
      if (patRes.success) setPatients(patRes.data);
    } catch (err) {
      console.error('Failed to load encounters', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedPatientFilter]);

  const getPatientName = (patientId) => {
    const p = patients.find(pat => pat.id === patientId);
    return p ? `${p.firstName} ${p.lastName} (${p.mrn})` : patientId;
  };

  return (
    <div className="space-y-6">
      {/* Epic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Epic 2
            </span>
            <h1 className="text-xl font-bold text-slate-900">Clinical Documentation & SOAP Notes</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardized physician encounter tracking, biometric vital trends, and structured SOAP clinical assessments. (Planned: 4 Sprints)
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Document New Encounter
        </button>
      </div>

      {/* Filter by Patient */}
      <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-xs">
        <span className="font-semibold text-slate-700 whitespace-nowrap">Filter by Patient:</span>
        <select
          value={selectedPatientFilter}
          onChange={(e) => setSelectedPatientFilter(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white max-w-xs"
        >
          <option value="">All Patients ({patients.length})</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName} — {p.mrn}
            </option>
          ))}
        </select>
        <span className="text-slate-400 text-xs ml-auto">
          Showing {encounters.length} clinical records
        </span>
      </div>

      {/* Encounters Timeline */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Loading clinical encounters...
          </div>
        ) : encounters.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No clinical documentation found. Click "Document New Encounter" to record a consultation.
          </div>
        ) : (
          encounters.map(enc => (
            <div key={enc.id} className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              {/* Encounter Header Strip */}
              <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{enc.type}</span>
                      <span className="text-2xs font-mono bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                        {enc.id}
                      </span>
                      <span className="text-2xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {enc.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Patient: <strong className="text-slate-800">{getPatientName(enc.patientId)}</strong> • {enc.department}
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-700 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(enc.date).toLocaleDateString()} at {new Date(enc.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-2xs text-slate-400 block mt-0.5">By {enc.provider}</span>
                </div>
              </div>

              {/* Encounter Body */}
              <div className="p-6 space-y-4">
                {/* Reason for Visit */}
                <div className="text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-2xs block mb-1">
                    Chief Complaint / Clinical Indication:
                  </span>
                  <p className="font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    "{enc.reasonForVisit}"
                  </p>
                </div>

                {/* Vitals Summary */}
                {enc.vitals && (
                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-2xs block mb-1.5 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-rose-500" /> Objective Biometric Vitals
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-2xs text-slate-400 uppercase">Blood Pressure</span>
                        <p className="font-bold text-slate-800 text-sm">{enc.vitals.systolicBP}/{enc.vitals.diastolicBP} <span className="text-2xs font-normal text-slate-400">mmHg</span></p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-2xs text-slate-400 uppercase">Heart Rate</span>
                        <p className="font-bold text-slate-800 text-sm">{enc.vitals.heartRate} <span className="text-2xs font-normal text-slate-400">bpm</span></p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-2xs text-slate-400 uppercase">SpO2 (Pulse Ox)</span>
                        <p className="font-bold text-slate-800 text-sm">{enc.vitals.oxygenSaturation}%</p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-2xs text-slate-400 uppercase">Temperature</span>
                        <p className="font-bold text-slate-800 text-sm">{enc.vitals.temperatureF}°F</p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-2xs text-slate-400 uppercase">Resp Rate</span>
                        <p className="font-bold text-slate-800 text-sm">{enc.vitals.respiratoryRate} <span className="text-2xs font-normal text-slate-400">/min</span></p>
                      </div>
                      <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                        <span className="text-2xs text-blue-600 uppercase font-semibold">Body Mass Index</span>
                        <p className="font-bold text-blue-800 text-sm">{enc.vitals.bmi || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SOAP Note 4-Quadrant Cards */}
                {enc.soapNote && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                    {/* Subjective */}
                    <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-200 shadow-2xs">
                      <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-2">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xs">S</span>
                        <span>Subjective (HPI & Patient Report)</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{enc.soapNote.subjective}</p>
                    </div>

                    {/* Objective */}
                    <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-200 shadow-2xs">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xs">O</span>
                        <span>Objective (Physical Exam & Findings)</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{enc.soapNote.objective}</p>
                    </div>

                    {/* Assessment */}
                    <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-200 shadow-2xs">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-2">
                        <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-2xs">A</span>
                        <span>Assessment (Diagnoses & ICD-10)</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">{enc.soapNote.assessment}</p>
                    </div>

                    {/* Plan */}
                    <div className="bg-purple-50/40 p-4 rounded-xl border border-purple-200 shadow-2xs">
                      <div className="flex items-center gap-1.5 font-bold text-purple-900 mb-2">
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xs">P</span>
                        <span>Plan (Orders, Rx & Follow-up)</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{enc.soapNote.plan}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Encounter Modal */}
      <NewEncounterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEncounterCreated={() => fetchData()}
        patients={patients}
      />
    </div>
  );
}
