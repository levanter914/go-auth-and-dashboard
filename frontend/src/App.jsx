import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import Signup from "./components/SignupPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser)); // Set the user if token and user exist
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Login />}
        />
      </Routes>
    </Router>
  );
}

export default App;
