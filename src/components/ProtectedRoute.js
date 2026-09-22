import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api";

function isTokenFormatValid(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false; // Token expired
    }
    return true;
  } catch {
    return false;
  }
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isTokenFormatValid(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setIsValidating(false);
      return;
    }

    // Verify session actively with the backend
    API.get("/auth/me")
      .then((res) => {
        if (res.data) {
          localStorage.setItem("user", JSON.stringify(res.data));
        }
        setIsAuthenticated(true);
      })
      .catch((err) => {
        // Backend rejected token (401 or 403)
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.setItem("auth_expired_message", "Please log in to continue.");
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsValidating(false);
      });
  }, [token]);

  if (isValidating) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <div className="spin" style={{ display: "inline-block", width: "32px", height: "32px", border: "3px solid #e2e8f0", borderTopColor: "#4f46e5", borderRadius: "50%", marginBottom: "16px" }} />
          <p style={{ color: "#64748b", fontSize: "14px", fontWeight: 500 }}>Verifying your secure session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;