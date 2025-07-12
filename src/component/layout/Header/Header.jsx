import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Menu, X, Zap } from "lucide-react";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import AccountDropdown from "../AccountDropdown/AccountDropdown";
import "./Header.scss";
// import ToastManager from "../../../common/Toast/ToastManager";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../../hook/useAuth";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="itc-header">
      <nav
        className={`itc-header__nav ${
          isScrolled ? "itc-header__nav--scrolled" : ""
        }`}
      >
        <div className="itc-header__container">
          <div className="itc-header__nav-content">
            {/* Logo */}
            <div
              className="itc-header__logo"
              onClick={() => handleNavigation("/client/")}
            >
              <div className="itc-header__logo-icon">
                {/* <Image
                  className="itc-header__logo-svg"
                  src="logo"
                  alt="Inter-Trans Connect Logo"
                /> */}
                <div className="itc-header__logo-glow"></div>
              </div>
              <div className="itc-header__logo-text">
                <h1 className="itc-header__brand-name">DNA Testing</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <NavigationMenu
              user={user}
              className="itc-navigation-menu itc-navigation-menu--desktop"
            />

            {/* Right Section */}
            <div className="itc-header__actions">
              {user ? (
                <div className="itc-header__user-section">
                  <AccountDropdown user={user} onLogout={handleLogout} />
                </div>
              ) : (
                <div className="itc-header__auth-buttons">
                  <Button
                    className="itc-header__auth-btn itc-header__auth-btn"
                    onClick={() => handleNavigation("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    className="itc-header__auth-btn itc-header__auth-btn"
                    onClick={() => handleNavigation("/register")}
                  >
                    Register
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="itc-header__mobile-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="itc-header__mobile-menu">
              <NavigationMenu
                user={user}
                className="itc-navigation-menu itc-navigation-menu--mobile"
                mobile={true}
                onItemClick={() => setIsMobileMenuOpen(false)}
              />
              {user ? (
                <div className="itc-header__mobile-user">
                  <AccountDropdown user={user} onLogout={handleLogout} mobile />
                </div>
              ) : (
                <div className="itc-header__mobile-auth">
                  <Button
                    variant="ghost"
                    className="itc-header__mobile-auth-btn"
                    onClick={() => handleNavigation("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    className="itc-header__mobile-auth-btn itc-header__mobile-auth-btn--register"
                    onClick={() => handleNavigation("/register")}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
