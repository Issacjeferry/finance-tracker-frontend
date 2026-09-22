import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { useToast } from "../components/Toast/ToastContext";
import GoogleSignInButton from "../components/Auth/GoogleSignInButton";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    // If redirected due to token expiry, show notification
    const expiredMsg = sessionStorage.getItem("auth_expired_message");
    if (expiredMsg) {
      toast.warning(expiredMsg);
      sessionStorage.removeItem("auth_expired_message");
    }
  }, [toast]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.warning("Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      toast.success(res.data.message || "Welcome back!");
      navigate("/");
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Invalid email or password. Please try again.";
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
      toast.success(`Signed in as ${res.data.user?.name || res.data.user?.email}`);
      navigate("/");
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        "Google sign-in failed. Please try again or use email login.";
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
            <Lock size={22} />
          </div>
          <h2>Welcome Back</h2>
          <p className="auth-sub">Manage your personal finances with clarity</p>
        </div>

        {/* Google Sign In */}
        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
          onError={(msg) => toast.error(msg)}
          disabled={loading}
        />

        <div className="auth-divider">
          <span>or sign in with email</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="Enter your password"
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
                <Loader2 size={18} className="spin" /> Signing in...
              </span>
            ) : (
              <span className="btn-content">
                Sign In <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link-bold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;