import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login after logout
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto text-gray-800">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user.firstName}!</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phoneNumber || "N/A"}</p>
        <p><strong>Country:</strong> {user.country || "N/A"}</p>
        <p><strong>Job:</strong> {user.job || "N/A"}</p>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
         Logout
        </button>
      </div>
    </div>
  );
}
