import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { useToast } from "../components/Toast/ToastContext";
import GoogleSignInButton from "../components/Auth/GoogleSignInButton";
import { Eye, EyeOff, Lock, Mail, User as UserIcon, ArrowRight, Loader2 } from "lucide-react";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.warning("Please fill in all required fields");
      return;
    }

    if (form.password.length < 6) {
      toast.warning("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      toast.success(res.data.message || "Account created successfully!");
      navigate("/");
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.errors?.password ||
        err.response?.data?.errors?.email ||
        "Registration failed. Email may already be in use.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (idToken) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/google", { idToken });
      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      toast.success(`Account connected as ${res.data.user?.name || res.data.user?.email}`);
      navigate("/");
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        "Google sign-up failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <UserIcon size={22} />
          </div>
          <h2>Create Account</h2>
          <p className="auth-sub">Start tracking and growing your wealth</p>
        </div>

        {/* Google Sign In */}
        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
          onError={(msg) => toast.error(msg)}
          disabled={loading}
        />

        <div className="auth-divider">
          <span>or register with email</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <UserIcon size={18} className="input-icon" />
            <input
              name="name"
              type="text"
              placeholder="Full Name (optional)"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password (min 6 chars)"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span className="btn-spinner">
                <Loader2 size={18} className="spin" /> Creating account...
              </span>
            ) : (
              <span className="btn-content">
                Get Started <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link-bold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;