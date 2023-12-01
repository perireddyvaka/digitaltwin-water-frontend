// WaterTank.js
import React from 'react';
import { GiWaterTank } from 'react-icons/gi';

const WaterTank = ({ label, waterUnits }) => (
  <div className="tank">
    <GiWaterTank size={40} />
    <div className="water-tank">
      {waterUnits.map((unit, index) => (
        <div key={index} className="water-unit"></div>
      ))}
    </div>
    <div className="tank-label">{label}</div>
  </div>
);

export default WaterTank;
