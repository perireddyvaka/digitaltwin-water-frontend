import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [waterUnitsAtA, setWaterUnitsAtA] = useState(Array(10).fill(1));
  const [waterUnitsAtB, setWaterUnitsAtB] = useState([]);
  const [simulationInterval, setSimulationInterval] = useState(null);
  const [calculatedAmountAtA, setCalculatedAmountAtA] = useState(null);
  const [calculatedAmountAtB, setCalculatedAmountAtB] = useState(null);

  const startSimulation = () => {
    setSimulationStarted(true);
    setSimulationInterval(
      setInterval(() => {
        setWaterUnitsAtA((prevUnits) => (prevUnits.length > 0 ? prevUnits.slice(0, -1) : []));
        setWaterUnitsAtB((prevUnits) => (prevUnits.length < 10 ? [...prevUnits, 1] : prevUnits));
      }, 1000) // 1 second interval
    );
  };

  const stopSimulation = () => {
    setSimulationStarted(false);
    clearInterval(simulationInterval);
  };

  const calculateAmountSent = async () => {
    try {
      const response = await axios.post('http://localhost:2345/calculateAmount', {
        waterUnitsAtA,
      });
      setWaterUnitsAtA(response.data.waterUnitsAtA);
      setWaterUnitsAtB(response.data.waterUnitsAtB);
      setCalculatedAmountAtA(response.data.calculatedAmountAtA);
      setCalculatedAmountAtB(response.data.calculatedAmountAtB);
    } catch (error) {
      console.error('Error calculating amount sent:', error.message);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup interval on component unmount
      clearInterval(simulationInterval);
    };
  }, [simulationInterval]);

  return (
    <div className="App">
      <div className="tank">
        <div className="water-tank">
          {waterUnitsAtA.map((unit, index) => (
            <div key={index} className="water-unit"></div>
          ))}
        </div>
        <div className="tank-label">Tank A</div>
      </div>
      <div className="pipe">
        <div className={`water-flow ${simulationStarted ? 'flowing' : ''}`}>
          {waterUnitsAtA.map((unit, index) => (
            <div key={index} className="water-unit"></div>
          ))}
        </div>
        <div className="point pointA">
          <p>A</p>
        </div>
        <div className="dotted-line"></div>
        <div className="point pointB">
          <p>B</p>
          {waterUnitsAtB.map((unit, index) => (
            <div key={index} className="water-unit-vertical"></div>
          ))}
        </div>
      </div>
      <div className="tank">
        <div className="water-tank">
          {waterUnitsAtB.map((unit, index) => (
            <div key={index} className="water-unit"></div>
          ))}
        </div>
        <div className="tank-label">Tank B</div>
      </div>
      <div className="result-container">
        <p>Calculated Amount at A: {calculatedAmountAtA}</p>
        <p>Calculated Amount at B: {calculatedAmountAtB}</p>
      </div>
      <div>
        <button onClick={startSimulation} disabled={simulationStarted}>
          Start Simulation
        </button>
        <button onClick={stopSimulation} disabled={!simulationStarted}>
          Stop Simulation
        </button>
        <button onClick={calculateAmountSent} disabled={simulationStarted}>
          Calculate Amount Sent
        </button>
      </div>
    </div>
  );
}

export default App;
