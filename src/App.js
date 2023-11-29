import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GiWaterTank } from 'react-icons/gi';
import './App.css';

function App() {
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [waterUnitsAtA, setWaterUnitsAtA] = useState(Array(10).fill(1));
  const [waterUnitsAtB, setWaterUnitsAtB] = useState([]);
  const [waterUnitsAtC, setWaterUnitsAtC] = useState([]);
  const [waterUnitsAtD, setWaterUnitsAtD] = useState([]);
  const [simulationInterval, setSimulationInterval] = useState(null);
  const [calculatedAmountAtA, setCalculatedAmountAtA] = useState(null);
  const [calculatedAmountAtB, setCalculatedAmountAtB] = useState(null);
  const [calculatedAmountAtC, setCalculatedAmountAtC] = useState(null);
  const [calculatedAmountAtD, setCalculatedAmountAtD] = useState(null);

  const startSimulation = () => {
    setSimulationStarted(true);
    setSimulationInterval(
      setInterval(() => {
        setWaterUnitsAtA((prevUnits) => (prevUnits.length > 0 ? prevUnits.slice(0, -1) : []));
        setWaterUnitsAtB((prevUnits) => (prevUnits.length < 10 ? [...prevUnits, 1] : prevUnits));
        setWaterUnitsAtC((prevUnits) => (prevUnits.length < 10 ? [...prevUnits, 1] : prevUnits));
        setWaterUnitsAtD((prevUnits) => (prevUnits.length < 10 ? [...prevUnits, 1] : prevUnits));
      }, 1000)
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
      setWaterUnitsAtC(response.data.waterUnitsAtC);
      setWaterUnitsAtD(response.data.waterUnitsAtD);
      setCalculatedAmountAtA(response.data.calculatedAmountAtA);
      setCalculatedAmountAtB(response.data.calculatedAmountAtB);
      setCalculatedAmountAtC(response.data.calculatedAmountAtC);
      setCalculatedAmountAtD(response.data.calculatedAmountAtD);
    } catch (error) {
      console.error('Error calculating amount sent:', error.message);
    }
  };

  useEffect(() => {
    if (!simulationStarted) {
      clearInterval(simulationInterval);
    }
  }, [simulationStarted, simulationInterval]);

  return (
    <div className="App">
      <div className="tank">
        <GiWaterTank size={40} />
        <div className="water-tank">
          {waterUnitsAtA.map((unit, index) => (
            <div key={index} className="water-unit"></div>
          ))}
        </div>
        <div className="tank-label">A</div>
      </div>
      <div className="pipe">
        <div className="water-flow">
          {waterUnitsAtA.map((unit, index) => (
            <div key={index} className="water-unit"></div>
          ))}
          <div className="dotted-line"></div>
          <div className="point pointA">
            <p>A</p>
          </div>
        </div>
      </div>
      <div className="tank">
        <GiWaterTank size={40} />
        <div className="water-tank">
          {waterUnitsAtB.map((unit, index) => (
            <div key={index} className="water-unit"></div>
          ))}
        </div>
        <div className="tank-label">B</div>
      </div>
      <div className="pipe">
        <div className="water-flow">
          {waterUnitsAtB.map((unit, index) => (
            <div key={index} className="water-unit"></div>
          ))}
          <div className="dotted-line"></div>
          <div className="point pointB">
            <p>B</p>
          </div>
        </div>
      </div>
      <div className="pipe">
        <div className="water-flow">
          {waterUnitsAtC.map((unit, index) => (
            <div key={index} className="water-unit"></div>
          ))}
          <div className="dotted-line"></div>
          <div className="point pointC">
            <p>C</p>
          </div>
        </div>
      </div>
      <div className="tank">
        <GiWaterTank size={40} />
        <div className="water-tank">
          {waterUnitsAtD.map((unit, index) => (
            <div key={index} className="water-unit"></div>
          ))}
        </div>
        <div className="tank-label">D</div>
      </div>
      <div className="pipe">
        <div className="water-flow">
          {waterUnitsAtD.map((unit, index) => (
            <div key={index} className="water-unit"></div>
          ))}
          <div className="dotted-line"></div>
          <div className="point pointD">
            <p>D</p>
          </div>
        </div>
      </div>
      <div className="result-container">
        <p>Calculated Amount at A: {calculatedAmountAtA}</p>
        <p>Calculated Amount at B: {calculatedAmountAtB}</p>
        <p>Calculated Amount at C: {calculatedAmountAtC}</p>
        <p>Calculated Amount at D: {calculatedAmountAtD}</p>
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
