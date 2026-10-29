import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, Plus, Search, Filter, AlertCircle, 
  CheckCircle, Clock, Eye, FileText, ChevronRight, Check 
} from 'lucide-react';
import { api } from '../../api';
import PacsViewerModal from './PacsViewerModal';

export default function CpoeOrderView() {
  const [orders, setOrders] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPacsOrder, setSelectedPacsOrder] = useState(null);

  // New Order Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [newOrderPatientId, setNewOrderPatientId] = useState('');
  const [newOrderType, setNewOrderType] = useState('Laboratory');
  const [newOrderTestName, setNewOrderTestName] = useState('Complete Blood Count (CBC) with Differential');
  const [newOrderPriority, setNewOrderPriority] = useState('Routine');
  const [newOrderLoinc, setNewOrderLoinc] = useState('58410-2');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSuccess, setModalSuccess] = useState('');

  const standardPanels = [
    { type: 'Laboratory', name: 'Complete Blood Count (CBC) with Differential', loinc: '58410-2' },
    { type: 'Laboratory', name: 'Comprehensive Metabolic Panel (CMP-14)', loinc: '24323-8' },
    { type: 'Laboratory', name: 'Hemoglobin A1c & Glycemic Panel', loinc: '4548-4' },
    { type: 'Laboratory', name: 'Lipid Panel (Total, HDL, LDL, Triglycerides)', loinc: '573-7' },
    { type: 'Laboratory', name: 'Urinalysis Complete with Microscopic Exam', loinc: '24356-8' },
    { type: 'Imaging', name: 'Chest X-Ray 2 Views (PA and Lateral)', loinc: '36554-4' },
    { type: 'Imaging', name: 'Lumbar Spine MRI without Contrast', loinc: '24726-2' },
    { type: 'Imaging', name: 'CT Head / Brain without IV Contrast', loinc: '30799-1' },
    { type: 'Imaging', name: 'Echocardiogram Transthoracic (TTE)', loinc: '18053-9' }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordRes, patRes] = await Promise.all([
        api.getOrders({ type: selectedType, status: selectedStatus }),
        api.getPatients()
      ]);
      if (ordRes.success) setOrders(ordRes.data);
      if (patRes.success) {
        setPatients(patRes.data);
        if (patRes.data.length > 0 && !newOrderPatientId) {
          setNewOrderPatientId(patRes.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedType, selectedStatus]);

  const handleTestSelection = (panelName) => {
    setNewOrderTestName(panelName);
    const found = standardPanels.find(p => p.name === panelName);
    if (found) {
      setNewOrderType(found.type);
      setNewOrderLoinc(found.loinc);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const payload = {
        patientId: newOrderPatientId,
        type: newOrderType,
        testName: newOrderTestName,
        loincCode: newOrderLoinc,
        priority: newOrderPriority,
        orderedBy: 'Dr. Rachel Adams, MD',
        clinicalNotes: 'Order entered via CPOE diagnostic portal.'
      };

      const res = await api.createOrder(payload);
      if (res.success) {
        setModalSuccess(`CPOE Order #${res.data.id} placed! Routed to ${res.data.category}.`);
        setTimeout(() => {
          setModalSuccess('');
          setIsOrderModalOpen(false);
          fetchData();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
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
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Epic 3
            </span>
            <h1 className="text-xl font-bold text-slate-900">Computerized Provider Order Entry (CPOE) & Diagnostics</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Order placement for laboratory tests, imaging studies (PACS), and diagnostic procedures with LOINC standards. (Planned: 3 Sprints)
          </p>
        </div>

        <button
          onClick={() => setIsOrderModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Place CPOE Diagnostic Order
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Filter Modality:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg outline-none bg-white"
          >
            <option value="">All Orders</option>
            <option value="Laboratory">Laboratory (LIS)</option>
            <option value="Imaging">Imaging Studies (PACS)</option>
            <option value="Procedure">Diagnostic Procedures</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg outline-none bg-white"
          >
            <option value="">All Statuses</option>
            <option value="Ordered">Ordered / Pending</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Completed">Completed / Resulted</option>
          </select>
        </div>

        <span className="text-slate-400 text-xs ml-auto">
          {orders.length} diagnostic orders
        </span>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Loading CPOE orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No diagnostic orders match criteria.
          </div>
        ) : (
          orders.map((ord) => (
            <div key={ord.id} className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                    ord.type === 'Imaging' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}>
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{ord.testName}</span>
                      <span className="text-2xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                        {ord.id}
                      </span>
                      <span className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                        ord.priority === 'STAT' ? 'bg-red-100 text-red-800 animate-pulse' :
                        ord.priority === 'Urgent' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {ord.priority}
                      </span>
                      <span className={`text-2xs font-semibold px-2 py-0.5 rounded-full ${
                        ord.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Patient: <strong className="text-slate-800">{getPatientDisplay(ord.patientId)}</strong> • LOINC: <span className="font-mono">{ord.loincCode}</span> • Ordered By: {ord.orderedBy}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {ord.type === 'Imaging' && (
                    <button
                      onClick={() => setSelectedPacsOrder(ord)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      Open in PACS Viewer
                    </button>
                  )}
                </div>
              </div>

              {/* Results Section */}
              {ord.results && ord.results.length > 0 && (
                <div className="p-4 bg-slate-50/50">
                  <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Verified Laboratory Findings ({ord.category} Interfaced)
                  </span>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-2xs uppercase">
                        <tr>
                          <th className="p-2.5">Analyte Name</th>
                          <th className="p-2.5">Observed Value</th>
                          <th className="p-2.5">Reference Interval</th>
                          <th className="p-2.5">Clinical Flag</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {ord.results.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50/80">
                            <td className="p-2.5 font-semibold text-slate-900">{r.test}</td>
                            <td className="p-2.5 font-bold text-slate-900">{r.value} {r.unit}</td>
                            <td className="p-2.5 text-slate-500">{r.referenceRange}</td>
                            <td className="p-2.5">
                              <span className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                                r.flag === 'Normal' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {r.flag}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-500 text-2xs">{r.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Radiologist Impression if Imaging */}
              {ord.radiologistImpression && (
                <div className="px-5 py-3 bg-amber-50/60 border-t border-amber-100 text-xs">
                  <strong className="text-amber-900 block mb-0.5">Radiologist Impression:</strong>
                  <p className="text-amber-800">{ord.radiologistImpression}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Place CPOE Order Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-purple-700 px-6 py-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-purple-200" />
                <h2 className="text-base font-bold">New CPOE Diagnostic Order Entry</h2>
              </div>
              <button onClick={() => setIsOrderModalOpen(false)} className="p-1 rounded-lg hover:bg-white/20 text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-6 space-y-4 text-xs">
              {modalSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{modalSuccess}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
                <select
                  value={newOrderPatientId}
                  onChange={(e) => setNewOrderPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.mrn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Standard Diagnostic Catalog</label>
                <select
                  value={newOrderTestName}
                  onChange={(e) => handleTestSelection(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {standardPanels.map((p, idx) => (
                    <option key={idx} value={p.name}>
                      [{p.type}] {p.name} (LOINC: {p.loinc})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newOrderPriority}
                    onChange={(e) => setNewOrderPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="STAT">STAT (Immediate)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">LOINC Standard Code</label>
                  <input
                    type="text"
                    readOnly
                    value={newOrderLoinc}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-sm"
                >
                  {modalLoading ? 'Submitting...' : 'Dispatch CPOE Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PACS Viewer Modal */}
      <PacsViewerModal
        order={selectedPacsOrder}
        isOpen={!!selectedPacsOrder}
        onClose={() => setSelectedPacsOrder(null)}
      />
    </div>
  );
}
