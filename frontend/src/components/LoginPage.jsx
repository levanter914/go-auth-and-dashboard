import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if the user is already logged in (token exists)
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const response = await fetch("http://localhost:8080/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              token
              user {
                id
                email
                firstName
                lastName
                phoneNumber
                country
                job
              }
            }
          }
        `,
        variables: { email, password },
      }),
    });
  
    const result = await response.json();
    console.log(result);  // Log the full response to see the result
  
    if (result.data?.login?.token) {
      const { token, user } = result.data.login;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));  // Store user data in localStorage
      navigate("/dashboard");
    } else {
      setError("Invalid credentials, please try again.");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-1 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-1 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Login
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
