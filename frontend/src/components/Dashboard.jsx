import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6 relative">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold italic">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Centered Card */}
      <div className="flex justify-center">
        <div className="bg-gray-50 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold mb-4 text-center">
            Welcome, <i>{user.firstName}!</i>
          </h2>
          <div className="space-y-2">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phoneNumber || "N/A"}
            </p>
            <p>
              <strong>Country:</strong> {user.country || "N/A"}
            </p>
            <p>
              <strong>Job:</strong> {user.job || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
