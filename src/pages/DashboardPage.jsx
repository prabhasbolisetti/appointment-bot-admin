import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  clinicAPI,
  appointmentAPI,
  patientAPI
} from '../services/api';
export default function DashboardPage() {
  const navigate = useNavigate();
  const { admin, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">Clinic Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">{admin?.full_name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Menu</h2>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === 'overview'
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveTab('clinic')}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === 'clinic'
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                🏥 Clinic Settings
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === 'appointments'
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                📅 Appointments
              </button>
              <button
                onClick={() => setActiveTab('patients')}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === 'patients'
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                👥 Patients
              </button>
              <button
                onClick={() => setActiveTab('slots')}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === 'slots'
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                🗓️ Slots
              </button>
            </nav>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'overview' && <OverviewTab admin={admin} />}
          {activeTab === 'clinic' && <ClinicTab clinicId={admin?.clinic_id} />}
          {activeTab === 'appointments' && <AppointmentsTab clinicId={admin?.clinic_id} />}
          {activeTab === 'patients' && <PatientsTab clinicId={admin?.clinic_id} />}
          {activeTab === 'slots' && <SlotsTab clinicId={admin?.clinic_id} />}
        </div>
      </div>
    </div>
  );
}
// Overview Tab
function OverviewTab({ admin }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Welcome, {admin?.full_name}!</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-100 p-6 rounded-lg shadow">
          <h3 className="font-bold text-gray-700">Appointments Today</h3>
          <p className="text-3xl text-blue-600 font-bold">0</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow">
          <h3 className="font-bold text-gray-700">Total Patients</h3>
          <p className="text-3xl text-green-600 font-bold">0</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg shadow">
          <h3 className="font-bold text-gray-700">Revenue This Month</h3>
          <p className="text-3xl text-yellow-600 font-bold">₹0</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg shadow">
          <h3 className="font-bold text-gray-700">Available Slots</h3>
          <p className="text-3xl text-purple-600 font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
// Clinic Settings Tab
function ClinicTab({ clinicId }) {
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  React.useEffect(() => {
    const fetchClinic = async () => {
      try {
        const { data } = await clinicAPI.getClinic(clinicId);
        setClinic(data);
        setFormData(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchClinic();
  }, [clinicId]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = async () => {
    try {
      const { data } = await clinicAPI.updateClinic(clinicId, formData);
      setClinic(data);
      setEditing(false);
      alert('Clinic updated successfully');
    } catch (err) {
      alert('Failed to update clinic');
    }
  };
  if (loading) return <div>Loading...</div>;
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Clinic Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Clinic Name</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            disabled={!editing}
            className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            disabled={!editing}
            className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Open Time</label>
            <input
              type="time"
              name="open_time"
              value={formData.open_time || ''}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Close Time</label>
            <input
              type="time"
              name="close_time"
              value={formData.close_time || ''}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Slot Duration (min)</label>
            <input
              type="number"
              name="slot_duration_minutes"
              value={formData.slot_duration_minutes || ''}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Consultation Fee (₹)</label>
            <input
              type="number"
              name="consultation_fee"
              value={formData.consultation_fee || ''}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
// Appointments Tab
function AppointmentsTab({ clinicId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(null);
  React.useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await appointmentAPI.list(filter);
        setAppointments(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [filter]);
  const handleCancel = async (appointmentId) => {
    try {
      await appointmentAPI.cancel(appointmentId);
      setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
      alert('Appointment cancelled');
    } catch (err) {
      alert('Failed to cancel appointment');
    }
  };
  const handleComplete = async (appointmentId) => {
    try {
      await appointmentAPI.complete(appointmentId);
      const updated = appointments.map((a) =>
        a.id === appointmentId ? { ...a, status: 'completed' } : a
      );
      setAppointments(updated);
      alert('Appointment marked as completed');
    } catch (err) {
      alert('Failed to complete appointment');
    }
  };
  if (loading) return <div>Loading...</div>;
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Appointments</h2>
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`px-4 py-2 rounded ${filter === null ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('confirmed')}
          className={`px-4 py-2 rounded ${filter === 'confirmed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Confirmed
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Pending
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-3 text-left">ID</th>
            <th className="border p-3 text-left">Patient</th>
            <th className="border p-3 text-left">Status</th>
            <th className="border p-3 text-left">Payment</th>
            <th className="border p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id} className="border hover:bg-gray-50">
              <td className="border p-3 text-sm">{appt.id.slice(0, 8)}...</td>
              <td className="border p-3">{appt.patient_id}</td>
              <td className="border p-3">
                <span className={`px-2 py-1 rounded text-white text-sm ${
                  appt.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'
                }`}>
                  {appt.status}
                </span>
              </td>
              <td className="border p-3">{appt.payment_status}</td>
              <td className="border p-3 space-x-2">
                <button
                  onClick={() => handleComplete(appt.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                >
                  Complete
                </button>
                <button
                  onClick={() => handleCancel(appt.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// Patients Tab
function PatientsTab({ clinicId }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await patientAPI.list(clinicId);
        setPatients(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchPatients();
  }, [clinicId]);
  if (loading) return <div>Loading...</div>;
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Patients ({patients.length})</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-3 text-left">WhatsApp</th>
            <th className="border p-3 text-left">Name</th>
            <th className="border p-3 text-left">Joined</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className="border hover:bg-gray-50">
              <td className="border p-3">{patient.whatsapp_number}</td>
              <td className="border p-3">{patient.name || 'N/A'}</td>
              <td className="border p-3 text-sm">
                {patient.created_at
                  ? new Date(patient.created_at).toLocaleDateString()
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// Slots Tab
function SlotsTab({ clinicId }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Slot Management</h2>
      <p className="text-gray-600">Slot management coming in Phase 5.2</p>
    </div>
  );
}