import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paymentAPI, appointmentAPI } from '../services/api';

export default function PaymentPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

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
  }, [appointmentId]);

  const handlePayment = async () => {
    if (!appointment) return;

    setProcessing(true);

    try {
      // Step 1: Create order
      const clinic = appointment.clinics || {};
      const amount = clinic.consultation_fee || 300;

      const orderRes = await paymentAPI.createOrder(appointmentId, amount);

      if (!orderRes.data.success) {
        alert('Failed to create payment order');
        setProcessing(false);
        return;
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: orderRes.data.key_id,
        amount: orderRes.data.amount * 100,
        currency: orderRes.data.currency,
        name: clinic.name || 'Clinic Appointment',
        description: 'Appointment Booking',
        order_id: orderRes.data.order_id,
        handler: async (response) => {
          // Step 3: Verify payment
          try {
            const verifyRes = await paymentAPI.verifyPayment(
              orderRes.data.order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (verifyRes.data.success) {
              setPaymentStatus('success');
              alert('Payment successful! Your appointment is confirmed.');
              setTimeout(() => navigate('/dashboard'), 2000);
            } else {
              setPaymentStatus('failed');
              alert('Payment verification failed');
            }
          } catch (err) {
            setPaymentStatus('failed');
            alert('Payment verification error');
          }
        },
        prefill: {
          name: appointment.patients?.name || '',
          contact: appointment.patients?.whatsapp_number || '',
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            alert('Payment cancelled');
          },
        },
      };

      // Load Razorpay script and open checkout
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
        setProcessing(false);
      };
      document.body.appendChild(script);
    } catch (err) {
      console.error(err);
      alert('Payment initiation failed');
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!appointment) return <div className="p-8">Appointment not found</div>;

  const clinic = appointment.clinics || {};
  const slot = appointment.slots || {};
  const amount = clinic.consultation_fee || 300;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 text-blue-500 hover:underline"
        >
          ← Back
        </button>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">💳 Payment</h1>

          {paymentStatus === 'success' && (
            <div className="bg-green-100 text-green-700 p-4 rounded mb-6">
              ✓ Payment successful! Your appointment is confirmed.
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
              ✕ Payment failed. Please try again.
            </div>
          )}

          {/* Appointment Summary */}
          <div className="bg-gray-50 p-4 rounded mb-6">
            <h2 className="font-bold text-gray-800 mb-3">Appointment Summary</h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Clinic:</strong> {clinic.name}
              </p>
              <p>
                <strong>Date:</strong> {slot.slot_date}
              </p>
              <p>
                <strong>Time:</strong> {slot.start_time?.substring(0, 5)}
              </p>
              <p>
                <strong>Patient:</strong> {appointment.patients?.whatsapp_number}
              </p>
            </div>
          </div>

          {/* Amount */}
          <div className="bg-blue-50 p-4 rounded mb-6 border-2 border-blue-200">
            <p className="text-gray-600 text-sm mb-1">Amount to Pay</p>
            <p className="text-3xl font-bold text-blue-600">₹{amount}</p>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={processing || paymentStatus === 'success'}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
          >
            {processing ? 'Processing...' : 'Pay Now with Razorpay'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Secure payment powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
}
