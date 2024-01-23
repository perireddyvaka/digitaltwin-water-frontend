import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './NavigationBar.css';
import IITHLOGO from './images/iiith.png';
import SCRCLOGO from './images/scrc_logo.png';

const NavigationBar = () => {
  return (
    <nav className="navbar">
      <Link to="/"> {/* Add Link to the root route */}
        <div className="navbar__logo">
          <img src={IITHLOGO} alt="IIITH Logo" />
        </div>
      </Link>
      <div className="navbar__dashboard">Digital Twin</div>
      <Link to="/"> {/* Add Link to the root route */}
        <div className="navbar__logo">
          <img src={SCRCLOGO} alt="Smart City Living Lab Logo" />
        </div>
      </Link>
    </nav>
  );
};

export default NavigationBar;
