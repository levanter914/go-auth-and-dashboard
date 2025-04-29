import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import Signup from "./components/SignupPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Redirect root based on auth */}
        <Route
          path="/"
          element={
            user ? (
              <Dashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Login route redirects if already logged in */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" />
            ) : (
              <Login setUser={setUser} />
            )
          }
        />

        <Route
          path="/signup"
          element={<Signup />}
        />
      </Routes>
    </Router>
  );
}

export default App;
