import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.scss";
import { register } from "../../service/authService";
import ToastManager from "../../component/common/Toast/ToastManager";
import { ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Customer", // Default role, adjust as needed
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on input change
    setSuccess(""); // Clear success message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const userData = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    try {
      const result = await register(userData);
      ToastManager.showSuccess("Register successful");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Customer",
      });
    } catch (err) {
      setError(err.message);
      ToastManager.showError(err.message);
    }
  };

  return (
    <div className="dna-register-container">
      {/* DNA Background Animation */}
      <div className="dna-helix-bg">
        <div className="dna-double-helix">
          <div className="helix-strand strand-1"></div>
          <div className="helix-strand strand-2"></div>
          <div className="base-pairs">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="base-pair"
                style={{ "--delay": `${i * 0.2}s` }}
              >
                <div className="base base-a"></div>
                <div className="base base-t"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating DNA Particles */}
      <div className="dna-particles">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              "--delay": `${Math.random() * 5}s`,
              "--duration": `${5 + Math.random() * 10}s`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="register-content">
        <div className="register-form-container">
          <div className="form-header">
            <div className="dna-logo">
              <svg viewBox="0 0 100 100" className="logo-svg">
                <defs>
                  <linearGradient
                    id="dnaGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <path
                  d="M20 20 Q30 30 40 20 T60 20 T80 20"
                  stroke="url(#dnaGradient)"
                  strokeWidth="3"
                  fill="none"
                  className="dna-strand"
                />
                <path
                  d="M20 80 Q30 70 40 80 T60 80 T80 80"
                  stroke="url(#dnaGradient)"
                  strokeWidth="3"
                  fill="none"
                  className="dna-strand"
                />
                <g className="dna-connections">
                  <line
                    x1="25"
                    y1="25"
                    x2="25"
                    y2="75"
                    stroke="#6366f1"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  <line
                    x1="40"
                    y1="20"
                    x2="40"
                    y2="80"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  <line
                    x1="55"
                    y1="25"
                    x2="55"
                    y2="75"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  <line
                    x1="70"
                    y1="20"
                    x2="70"
                    y2="80"
                    stroke="#6366f1"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                </g>
              </svg>
            </div>
            <h1 className="form-title">Create an Account</h1>
            <p className="form-subtitle">
              Join us to explore the secrets of your genes
            </p>
          </div>
          <form
            className="register-form"
            id="registerForm"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  id="fullname"
                  name="fullName" // Added name for handleChange
                  className="form-input"
                  placeholder=" "
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="fullname" className="form-label">
                  Full Name
                </label>
                <div className="input-line"></div>
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email" // Added name for handleChange
                  className="form-input"
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <div className="input-line"></div>
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper" style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder=" "
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-line"></div>
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
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

            <div className="form-group">
              <div className="input-wrapper" style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-input"
                  placeholder=" "
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-line"></div>
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
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
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-container">
                <input type="checkbox" id="terms" required />
                <span className="checkmark">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                </span>
                <span className="checkbox-text">
                  I agree to the{" "}
                  <a href="#" className="terms-link">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="terms-link">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            <button type="submit" className="register-btn">
              <span className="btn-text">Register</span>

              <div className="btn-loading">
                <div className="loading-spinner"></div>
              </div>
            </button>

            <div className="form-footer">
              <p className="login-link-text">
                Already have an account?
                <a href="/login" className="login-link">
                  Log in now
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Info Panel */}
        <div className="info-panel">
          <div className="info-content">
            <h3 className="info-title">Discover Your DNA</h3>
            <div className="info-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 12l2 2 4-4"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>99.9% Accurate</h4>
                  <p>Most advanced technology</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Absolute Security</h4>
                  <p>Information securely encrypted</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Fast Results</h4>
                  <p>Receive results in 7-10 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
