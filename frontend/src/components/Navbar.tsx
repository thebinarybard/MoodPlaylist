import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <h4>MOODSYNC</h4>
          </Link>
        </div>

        <button className="mobile-menu-toggle" onClick={toggleMenu}>
          ☰
        </button>

        <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <Link to="/" className="nav-item">
            Home
          </Link>
          <Link to="/library" className="nav-item">
            Library
          </Link>
          <Link to="/" className="nav-item">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
