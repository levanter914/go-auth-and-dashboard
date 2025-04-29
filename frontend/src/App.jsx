import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/LoginPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the user data from localStorage if the token exists
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Login />}
        />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
