// App.js
import React, { useState, useEffect } from 'react';
import WaterTank from './components/WaterTank';
import Pipeline from './components/Pipeline';
import { simulateWaterFlow } from './components/Simulation';
import { GiWaterTank } from 'react-icons/gi';

// CSS Files
import './simulation.css';
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
        simulateWaterFlow(waterUnitsAtA, setWaterUnitsAtA, setWaterUnitsAtB, setWaterUnitsAtC, setWaterUnitsAtD);
      }, 1000)
    );
  };

  const stopSimulation = () => {
    setSimulationStarted(false);
    clearInterval(simulationInterval);
  };

  const calculateAmountSent = () => {
    const amountAtA = waterUnitsAtA.length;
    const amountAtB = waterUnitsAtB.length;
    const amountAtC = waterUnitsAtC.length;
    const amountAtD = waterUnitsAtD.length;

    setCalculatedAmountAtA(amountAtA);
    setCalculatedAmountAtB(amountAtB);
    setCalculatedAmountAtC(amountAtC);
    setCalculatedAmountAtD(amountAtD);
  };

  useEffect(() => {
    if (!simulationStarted) {
      clearInterval(simulationInterval);
    }
  }, [simulationStarted, simulationInterval]);

  return (
    <div className="App">
      <WaterTank label="A" waterUnits={waterUnitsAtA} />
      <Pipeline waterUnits={waterUnitsAtA} />
      <WaterTank label="B" waterUnits={waterUnitsAtB} />
      <Pipeline waterUnits={waterUnitsAtB} />
      <WaterTank label="C" waterUnits={waterUnitsAtC} />
      <Pipeline waterUnits={waterUnitsAtC} />
      <WaterTank label="D" waterUnits={waterUnitsAtD} />
      <Pipeline waterUnits={waterUnitsAtD} />
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
