import React, { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import "./LoginPage.scss";
import { login } from "../../service/authService";
import useAuth from "../../hook/useAuth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ apiError: "" });
  const navigate = useNavigate();
  const { login: loginContext, user } = useAuth();

  useEffect(() => {
    if (user) {
      const redirectPath =
        user.role === "Customer"
          ? "/"
          : user.role === "Staff"
          ? "/staff/"
          : user.role === "Admin"
          ? "/admin/"
          : null;

      if (redirectPath) {
        navigate(redirectPath);
      } else {
        setErrors((prev) => ({
          ...prev,
          apiError: "Invalid role. Please contact support.",
        }));
      }
    }
  }, [user, navigate, setErrors]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ apiError: "" }); // Clear previous errors on new submit
    try {
      await login(email, password, loginContext);
    } catch (error) {
      console.error("Login failed:", error.message);
      setErrors((prev) => ({
        ...prev,
        apiError: error.message || "Login failed. Please try again.",
      }));
      // Handle error (e.g., show a notification to the user)
    }
  };

  return (
    <div className="dna-login-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
      </div>

      {/* Main Login Form */}
      <div className="login-wrapper">
        <div className="login-card">
          <div className="logo-section">
            <div className="dna-logo">
              <svg viewBox="0 0 100 100" className="dna-icon">
                <path
                  d="M20 10 Q30 20 20 30 Q30 40 20 50 Q30 60 20 70 Q30 80 20 90"
                  className="dna-strand-left"
                />
                <path
                  d="M80 10 Q70 20 80 30 Q70 40 80 50 Q70 60 80 70 Q70 80 80 90"
                  className="dna-strand-right"
                />
                <circle cx="25" cy="20" r="2" className="base-pair" />
                <circle cx="75" cy="20" r="2" className="base-pair" />
                <circle cx="25" cy="40" r="2" className="base-pair" />
                <circle cx="75" cy="40" r="2" className="base-pair" />
                <circle cx="25" cy="60" r="2" className="base-pair" />
                <circle cx="75" cy="60" r="2" className="base-pair" />
                <circle cx="25" cy="80" r="2" className="base-pair" />
                <circle cx="75" cy="80" r="2" className="base-pair" />
                <line x1="25" y1="20" x2="75" y2="20" className="connection" />
                <line x1="25" y1="40" x2="75" y2="40" className="connection" />
                <line x1="25" y1="60" x2="75" y2="60" className="connection" />
                <line x1="25" y1="80" x2="75" y2="80" className="connection" />
              </svg>
            </div>
            <h1 className="company-title">DNA Testing Service</h1>
            <p className="company-subtitle">Genetic Testing Solutions</p>
          </div>

          <form className="login-form" id="loginForm" onSubmit={handleSubmit}>
            {errors.apiError && (
              <div
                className="error-message"
                style={{
                  color: "red",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
              >
                {errors.apiError}
              </div>
            )}

            {/* Email Input */}
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <div className="input-line"></div>
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-line"></div>
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                  style={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-wrapper">
                <input type="checkbox" id="rememberMe" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#" className="forgot-password">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="login-btn">
              <span className="btn-text">Sign In</span>
              <div className="btn-loading">
                <div className="spinner"></div>
              </div>
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <div className="social-login">
              <button type="button" className="social-btn google-btn">
                <svg viewBox="0 0 24 24" className="social-icon">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="signup-link">
              Don't have an account? <a href="/register">Sign up here</a>
            </div>
          </form>
        </div>
      </div>

      {/* Loading Overlay */}
      <div className="loading-overlay" id="loadingOverlay">
        <div className="dna-loading">
          <div className="dna-spinner">
            <div className="spinner-helix"></div>
            <div className="spinner-text">Authenticating...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
