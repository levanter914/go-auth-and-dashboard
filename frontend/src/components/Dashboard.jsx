import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Settings, LogOut, ChevronDown, User, Mail, Phone, Globe, Briefcase } from "lucide-react";
import RecentOrders from "./RecentOrders";

export default function Dashboard({ user, setUser }) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 p-6">

      <nav className="bg-white rounded-xl shadow-lg p-4 mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Dashboard</h1>

        <div className="flex items-center space-x-4">

          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>


          <button className="p-2 rounded-full hover:bg-gray-100">
            <Settings size={20} className="text-gray-600" />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
            >
              <img
                src={user.profilePicURL}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-indigo-200"
              />
              <span className="font-medium text-gray-700 hidden sm:inline">{user.firstName}</span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10">
                <a href="#profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50">
                  <User size={16} className="mr-2" />
                  Profile
                </a>
                <a href="#settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50">
                  <Settings size={16} className="mr-2" />
                  Settings
                </a>
                <hr className="my-1 border-gray-200" />
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden md:col-span-1">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6">
            <div className="flex justify-center">
              <img
                src={user.profilePicURL}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
              Welcome, <span className="text-indigo-600">{user.firstName}</span>!
            </h2>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                  <Mail size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                  <Phone size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium">{user.phoneNumber || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                  <Globe size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Company Name</p>
                  <p className="text-sm font-medium">{user.company || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition duration-300 flex items-center justify-center">
                <User size={18} className="mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Tasks</h3>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-semibold text-indigo-600">5/8</p>
                  <p className="text-sm text-gray-500">Completed today</p>
                </div>
                <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '62.5%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Messages</h3>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-semibold text-indigo-600">12</p>
                  <p className="text-sm text-gray-500">Unread messages</p>
                </div>
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Mail size={24} className="text-indigo-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
            <RecentOrders />
        </div>
      </div>
    </div>
  );
}
