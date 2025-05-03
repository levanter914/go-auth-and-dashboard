import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AuthLayout from "./components/AuthLayout";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const handleUserLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };
  
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      
      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading stored user data:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setCheckingAuth(false);
    }
  }, []);
  
  if (checkingAuth) {
    return <div>Loading...</div>;
  }
  
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Dashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" replace={true} />
            )
          }
        />
        
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace={true} />
            ) : (
              <AuthLayout currentPath="login" onLogin={handleUserLogin} />
            )
          }
        />
        
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/" replace={true} />
            ) : (
              <AuthLayout currentPath="signup" onLogin={handleUserLogin} />
            )
          }
        />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace={true} />} />
      </Routes>
    </Router>
  );
}

export default App;