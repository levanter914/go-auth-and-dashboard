import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ user, setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  if (!user) return null;
  useEffect(() => {
    if (user) {
      console.log("User:", user);
      console.log("Profile Pic URL:", user.profilePicURL);
    }
  }, [user]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-6 text-gray-800">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-semibold italic text-gray-900">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
        >
          Logout
        </button>
      </div>
      
      <div className="flex justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <img
              src={user.profilePicURL}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover shadow-md mb-4 border-4 border-indigo-100"
            />
            <h2 className="text-xl font-bold text-center text-gray-800">
              Welcome, <span className="italic">{user.firstName}</span>!
            </h2>
          </div>

          <div className="space-y-3 text-sm">
            <p>
              <span className="font-semibold text-gray-700">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Phone:</span>{" "}
              {user.phoneNumber || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Country:</span>{" "}
              {user.country || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Job:</span>{" "}
              {user.job || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
