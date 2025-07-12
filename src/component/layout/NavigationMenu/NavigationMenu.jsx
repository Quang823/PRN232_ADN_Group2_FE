import React from "react";
import { NavLink } from "react-router-dom";
import "./NavigationMenu.scss";

const NavigationMenu = ({
  user,
  onPostClick,
  className = "",
  mobile = false,
  onItemClick,
}) => {
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/services", label: "DNA Services" },
    { path: "/blog", label: "Blog" },
    { path: "/booking", label: "Book Appointment" },
    { path: "/pricing", label: "Pricing" },
  ];

  return (
    <nav
      className={`itc-navigation-menu ${
        mobile ? "itc-navigation-menu--mobile" : ""
      } ${className}`}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `itc-navigation-menu__link ${
              isActive ? "itc-navigation-menu__link--active" : ""
            }`
          }
          onClick={(e) => {
            if (item.onClick) item.onClick(e);
            if (onItemClick) onItemClick();
          }}
        >
          <span className="itc-navigation-menu__text">{item.label}</span>
          {!mobile && <div className="itc-navigation-menu__underline"></div>}
        </NavLink>
      ))}
    </nav>
  );
};

export default NavigationMenu;
