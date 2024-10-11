import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';
import IITHLOGO from './images/iiith.png';
import SCRCLOGO from './images/scrc_logo.png';

const NavigationBar = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 1000, }}>
      <nav className="navbar">
        <Link to="/">
          <div className="navbar__logo">
            <img src={IITHLOGO} alt="IIITH Logo" />
            <img src={SCRCLOGO} alt="Smart City Living Lab Logo" />
          </div>
        </Link>
        <div className="navbar__dashboard">Digital Twin</div>
        <Link to="/" className="navbar__button">
          Dashboard
        </Link>
        <Link to="/actuation2" className="navbar__button">
          Actuation
        </Link>
        <Link to="/simulation" className="navbar__button">
          Simulation
        </Link>
        <Link to="/">
        </Link>
      </nav>
    </div>
  );
};

export default NavigationBar;
