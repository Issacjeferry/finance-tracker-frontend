import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Register() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const handleSubmit = async (event) => {
    event.preventDefault(); setLoading(true); setError("");
    try { await API.post("/auth/register", form); navigate("/login"); }
    catch (err) { setError("We couldn’t create your account. The email may already be registered."); }
    finally { setLoading(false); }
  };
  return <div className="auth-container"><div className="auth-card"><div className="brand-mark">₹</div><p className="eyebrow">PERSONAL FINANCE</p><h1>Create your account</h1><p className="auth-sub">A simpler way to understand your money.</p><form onSubmit={handleSubmit}><label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required /></label><label>Password<input name="password" type="password" minLength="6" autoComplete="new-password" placeholder="At least 6 characters" value={form.password} onChange={handleChange} required /></label>{error && <div className="form-error" role="alert">{error}</div>}<button className="primary-btn" disabled={loading}>{loading ? "Creating account…" : "Create account"}</button></form><p className="auth-link">Already have an account? <Link to="/login">Sign in</Link></p></div></div>;
}
export default Register;
