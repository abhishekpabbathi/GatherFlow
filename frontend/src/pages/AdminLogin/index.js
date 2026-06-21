import React, { useState } from "react";
import "./index.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        setMessage("Login successful ✅");

        window.location.href = "/admin/dashboard";
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      console.log(error);
      setMessage("Server error");
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <h1>Admin Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <p>{message}</p>
      </div>
    </div>
  );
}