import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../services/api';

export default function AppointmentDetailPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const { data } = await appointmentAPI.get(appointmentId);
        setAppointment(data);
      } catch (err) {
        alert('Failed to load appointment');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [appointmentId, navigate]);

  const handleComplete = async () => {
    if (!window.confirm('Mark this appointment as completed?')) return;
    setActionLoading(true);
    try {
      await appointmentAPI.complete(appointmentId);
      alert('Appointment completed');
      setAppointment({ ...appointment, status: 'completed' });
    } catch (err) {
      alert('Failed to complete appointment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancel this appointment? The slot will be released.')) return;
    setActionLoading(true);
    try {
      await appointmentAPI.cancel(appointmentId);
      alert('Appointment cancelled');
      setAppointment({ ...appointment, status: 'cancelled' });
    } catch (err) {
      alert('Failed to cancel appointment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!window.confirm('Process refund for this appointment?')) return;
    setActionLoading(true);
    try {
      await appointmentAPI.refund(appointmentId);
      alert('Refund processed');
      setAppointment({ ...appointment, payment_status: 'refunded', status: 'cancelled' });
    } catch (err) {
      alert('Failed to process refund');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!appointment) return <div className="p-8">Appointment not found</div>;

  const patient = appointment.patients || {};
  const slot = appointment.slots || {};

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-4 text-blue-500 hover:underline"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Appointment Details</h1>

        <div className="mb-6 bg-blue-50 p-6 rounded">
          <h2 className="text-xl font-bold mb-3">👤 Patient Information</h2>
          <p className="mb-2"><strong>WhatsApp:</strong> {patient.whatsapp_number}</p>
          <p><strong>Name:</strong> {patient.name || 'N/A'}</p>
        </div>

        <div className="mb-6 bg-gray-50 p-6 rounded">
          <h2 className="text-xl font-bold mb-3">📅 Appointment Details</h2>
          <p className="mb-2"><strong>Date:</strong> {slot.slot_date}</p>
          <p className="mb-2"><strong>Time:</strong> {slot.start_time?.substring(0, 5)}</p>
          <p className="mb-2">
            <strong>Status:</strong>{' '}
            <span className={`px-2 py-1 rounded text-white text-sm ${
              appointment.status === 'confirmed' ? 'bg-green-500' :
              appointment.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'
            }`}>
              {appointment.status.toUpperCase()}
            </span>
          </p>
          <p>
            <strong>Payment Status:</strong>{' '}
            <span className={`px-2 py-1 rounded text-white text-sm ${
              appointment.payment_status === 'paid' ? 'bg-green-500' :
              appointment.payment_status === 'refunded' ? 'bg-gray-500' : 'bg-yellow-500'
            }`}>
              {appointment.payment_status.toUpperCase()}
            </span>
          </p>
        </div>

        <div className="mb-6 bg-gray-50 p-6 rounded">
          <h2 className="text-xl font-bold mb-3">📋 Additional Info</h2>
          <p className="mb-2"><strong>Appointment ID:</strong> {appointment.id}</p>
          <p className="mb-2"><strong>Created:</strong> {new Date(appointment.created_at).toLocaleString()}</p>
          <p><strong>Reminder Sent:</strong> {appointment.reminder_sent ? 'Yes' : 'No'}</p>
        </div>

        <div className="bg-yellow-50 p-6 rounded">
          <h2 className="text-xl font-bold mb-4">⚙️ Actions</h2>
          <div className="flex gap-3 flex-wrap">
            {appointment.status !== 'completed' && (
              <button
                onClick={handleComplete}
                disabled={actionLoading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                ✓ Mark Complete
              </button>
            )}

            {appointment.status !== 'cancelled' && (
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
              >
                ✕ Cancel Appointment
              </button>
            )}

            {appointment.payment_status === 'paid' && appointment.status !== 'cancelled' && (
              <button
                onClick={handleRefund}
                disabled={actionLoading}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
              >
                💰 Process Refund
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
