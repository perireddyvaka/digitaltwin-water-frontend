// ActuationPage.js
import React, { useState } from 'react';
import circuit from './circuit.jpg';
import { Link } from 'react-router-dom';
import { GiValve } from "react-icons/gi";
import { FaBoxArchive } from "react-icons/fa6";

function ActuationPage() {
  const [isOn, setIsOn] = useState({
    valve1: true,
    valve2: false,
    valve3: true,
    valve4: false,
  });

  const toggleIsOn = (valve) => {
    setIsOn(prevState => ({ ...prevState, [valve]: !prevState[valve] }));
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Actuation Page</h1>
      <div style={{ position: 'relative' }}>
        <img src={circuit} alt="circuit" style={{ width: '100%', marginTop: '100px' }} />
        <GiValve size={40} color={isOn.valve1 ? "green" : "red"} style={{position: 'absolute', top: '74%', left: '33%' }} onClick={() => {toggleIsOn('valve1'); toggleIsOn('valve2')}} />
        <GiValve size={40} color={isOn.valve2 ? "green" : "red"} style={{position: 'absolute', top: '63%', left: '30%', transform: 'rotate(90deg)' }} onClick={() => {toggleIsOn('valve2'); toggleIsOn('valve1')}} />
        <GiValve size={40} color={isOn.valve2 ? "green" : "red"} style={{position: 'absolute', top: '63%', left: '48.6%', transform: 'rotate(270deg)' }} onClick={() => {toggleIsOn('valve2'); toggleIsOn('valve1')}} />
        <FaBoxArchive size={30} color="brown" style={{position: 'absolute', top: '30%', left: '39%' }} />
        <GiValve size={40} color={isOn.valve3 ? "green" : "red"} style={{position: 'absolute', top: '74%', left: '66%' }} onClick={() => {toggleIsOn('valve3'); toggleIsOn('valve4')}} />
        <GiValve size={40} color={isOn.valve4 ? "green" : "red"} style={{position: 'absolute', top: '63%', left: '62.7%', transform: 'rotate(90deg)' }} onClick={() => {toggleIsOn('valve4'); toggleIsOn('valve3')}} />
        <GiValve size={40} color={isOn.valve4 ? "green" : "red"} style={{position: 'absolute', top: '63%', left: '81.2%', transform: 'rotate(270deg)' }} onClick={() => {toggleIsOn('valve4'); toggleIsOn('valve3')}} />
        <FaBoxArchive size={30} color="orange" style={{position: 'absolute', top: '30%', left: '72%' }} />
      </div>
      <Link to="/">
          <button style={{ display: 'block', margin: 'auto', marginTop: '30px', padding: '10px' }}>Go to Home Page</button>
      </Link>
    </div>
  );
}

export default ActuationPage;
