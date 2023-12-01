// Pipeline.js
import React from 'react';

const Pipeline = ({ waterUnits }) => (
  <div className="pipe">
    <div className="water-flow">
      {waterUnits.map((unit, index) => (
        <div key={index} className="water-unit"></div>
      ))}
    </div>
  </div>
);

export default Pipeline;
