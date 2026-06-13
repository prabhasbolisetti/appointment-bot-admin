import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { admin, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </nav>

      <div className="p-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Welcome, {admin?.full_name}</h2>
          <p className="text-gray-600 mb-2">Email: {admin?.email}</p>
          <p className="text-gray-600">Clinic ID: {admin?.clinic_id}</p>

          <div className="mt-8 grid grid-cols-4 gap-4">
            <div className="bg-blue-100 p-4 rounded">
              <h3 className="font-bold">Appointments</h3>
              <p className="text-2xl text-blue-600">0</p>
            </div>
            <div className="bg-green-100 p-4 rounded">
              <h3 className="font-bold">Patients</h3>
              <p className="text-2xl text-green-600">0</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded">
              <h3 className="font-bold">Revenue</h3>
              <p className="text-2xl text-yellow-600">₹0</p>
            </div>
            <div className="bg-purple-100 p-4 rounded">
              <h3 className="font-bold">Slots</h3>
              <p className="text-2xl text-purple-600">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}