import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const handleSubmit = async (event) => {
    event.preventDefault(); setLoading(true); setError("");
    try { const response = await API.post("/auth/login", form); localStorage.setItem("token", response.data.token); navigate("/"); }
    catch (err) { setError("Those details didn’t match an account."); }
    finally { setLoading(false); }
  };
  return <div className="auth-container"><div className="auth-card"><div className="brand-mark">₹</div><p className="eyebrow">PERSONAL FINANCE</p><h1>Welcome back</h1><p className="auth-sub">Your financial overview is waiting for you.</p><form onSubmit={handleSubmit}><label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required /></label><label>Password<input name="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={handleChange} required /></label>{error && <div className="form-error" role="alert">{error}</div>}<button className="primary-btn" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button></form><p className="auth-link">New here? <Link to="/register">Create an account</Link></p></div></div>;
}
export default Login;
