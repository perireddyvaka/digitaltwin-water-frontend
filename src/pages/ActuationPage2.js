import React, { useState, useEffect } from 'react';
// import circuit from '../images/circuit.png';
import { GiWaterTower, GiValve } from "react-icons/gi";
// import { MdOutlineInbox } from "react-icons/md";
import { FaArchive } from "react-icons/fa"; // Import FaArchive instead of FaBoxArchive
import axios from 'axios';
// import InstructionBox from '../components/InstructionBox/InstructionBox';
import Motor from '../images/Motor.png';
import WaterQualityNode from '../images/wqn.png';
import Circuit2 from '../images/final4.png';
import NavigationBar from '../components/Navigation/Navigation';

function ActuationPage() {
  const [isOn, setIsOn] = useState({
    valve1: true,
    valve2: false,
    valve3: true,
    valve4: false,
  });

  const [motorRunning, setMotorRunning] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeData, setNodeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(''); // State for feedback messages

  const [units, setUnits] = useState({
    Temperature: "°C",
    Uncompensated_TDS: "ppm",
    Compensated_TDS: "ppm",
    Voltage_TDS: "V",
  });

  useEffect(() => {
    console.log(`${isOn.valve1 ? 0 : 1},${isOn.valve3 ? 0 : 1}`);
    sendArrayToBackend(); // Call the function to send the array whenever values change
  }, [isOn.valve1, isOn.valve3]);

  const toggleIsOn = (valve) => {
    setIsOn((prevState) => ({ ...prevState, [valve]: !prevState[valve] }));
  };

   // Function to send the contamination request
   const sendContaminationRequest = async (quantity, type) => {
    try {
        console.log('Sending request with data:', { quantity, type });
        const response = await axios.post('http://localhost:8081/calculate_contamination', {
            quantity,
            type,
        });
        setFeedbackMessage(`Success: ${response.data.message}`);
    } catch (error) {
        if (error.response) {
            console.error("Error response data:", error.response.data);
            setFeedbackMessage(`Error: ${error.response.data.message || error.response.statusText}`);
        } else if (error.request) {
            console.error("Error request:", error.request);
            setFeedbackMessage('Error: No response from the server');
        } else {
            console.error("Error message:", error.message);
            setFeedbackMessage(`Error: ${error.message}`);
        }
    }
};

// Handlers for button clicks
const handleSandClick = (weight) => {
    sendContaminationRequest(weight, 'sand');
};

const handleSoilClick = (weight) => {
    sendContaminationRequest(weight, 'soil');
};

  const sendArrayToBackend = async () => {
    try {
      // Dynamically generate array based on the state of valve1 and valve3
      const arrayToSend = [isOn.valve1 ? 0 : 1, isOn.valve3 ? 0 : 1];

      const response = await axios.post('http://localhost:8081/actuation', { array: arrayToSend });
      console.log('Array sent to backend:', arrayToSend);
    } catch (error) {
      console.error('Error sending array to backend:', error);
    }
  };

  const toggleMotor = async () => {
    const newMotorState = !motorRunning;
    setMotorRunning(newMotorState);

    const url = newMotorState
      ? 'https://smartcitylivinglab.iiit.ac.in/zf-backend-api/motor/actuation/1'
      : 'https://smartcitylivinglab.iiit.ac.in/zf-backend-api/motor/actuation/0';

    try {
      await axios.post(url);
      console.log(`Motor ${newMotorState ? 'On' : 'Off'} request sent`);
    } catch (error) {
      console.error('Error sending motor request:', error);
    }
  };

  const handleNodeClick = (nodeName) => {
    setSelectedNode(nodeName);
    setHighlightedNode(nodeName);
    fetchNodeData(nodeName);
  };

  const fetchNodeData = async (nodeName) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8081/data/${nodeName}`);
      const data = response.data;
      const dataArray = Object.entries(data).map(([key, value]) => ({
        parameter: key,
        value: value,
        units: units[key] || '',
      }));
      console.log(dataArray)
      console.log(data)
      setNodeData(dataArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching node data:', error);
      setLoading(false);
    }
  };

  // Define the inline styles for the spinning animation
  const spinningStyle = {
    animation: 'spin 2s linear infinite',
  };

  // Define the keyframes for spinning animation
  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={{ overflowY: 'hidden', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavigationBar />
      {/* <div style={{ position: 'relative', flex: 1 }}> */}
        <img src={Circuit2} alt="circuit" style={{ width: '100vw', height: '70vh', objectFit: 'contain' }} />
           {/* Motor Image */}
          <div style={{ position: 'absolute', top: '6.1vw', left: '16vw' }}>
          <style>{keyframes}</style>
          <img
            src={Motor}
            alt="Motor"
            onClick={toggleMotor}
            style={{
              width: '4.5vw',
              cursor: 'pointer',
              transform: "scaleX(-1)",
              ...(motorRunning ? spinningStyle : {}),
            }}
          />
          
          </div>
        {/* Valves and Tanks */}
        <GiValve
          size={45}
          color={isOn.valve1 ? 'green' : 'red'}
          style={{ position: 'absolute', top: '23vw', left: '37.5vw' }}
          onClick={() => {
            toggleIsOn('valve1');
            toggleIsOn('valve2');
          }}
        />
        <GiValve
          size={45}
          color={isOn.valve2 ? 'green' : 'red'}
          style={{ position: 'absolute', top: '15vw', left: '26vw', transform: 'rotate(90deg)' }}
          onClick={() => {
            toggleIsOn('valve2'); 
            toggleIsOn('valve1');
          }}
        />
        <GiValve
          size={45}
          color={isOn.valve2 ? 'green' : 'red'}
          style={{ position: 'absolute', top: '15vw', left: '50.7vw', transform: 'rotate(270deg)' }}
          onClick={() => {
            toggleIsOn('valve2');
            toggleIsOn('valve1');
          }}
        />
        <FaArchive size={50} color="brown" style={{ position: 'absolute', top: '9vw', left: '38vw' }} />
        <div style={{ position: 'absolute', top: '12.4vw', left: '37vw', textAlign: 'center' }}>
          <div>Container1</div>
        </div>
        <GiValve
          size={45}
          color={isOn.valve3 ? 'green' : 'red'}
          style={{ position: 'absolute', top: '23.3vw', left: '77vw' }}
          onClick={() => {
            toggleIsOn('valve3');
            toggleIsOn('valve4');
          }}
        />
        <GiValve
          size={45}
          color={isOn.valve4 ? 'green' : 'red'}
          style={{ position: 'absolute', top: '15.5vw', left: '64.3vw', transform: 'rotate(90deg)' }}
          onClick={() => {
            toggleIsOn('valve4');
            toggleIsOn('valve3');
          }}
        />
        <GiValve
          size={45}
          color={isOn.valve4 ? 'green' : 'red'}
          style={{ position: 'absolute', top: '15.5vw', left: '88.9vw', transform: 'rotate(270deg)' }}
          onClick={() => {
            toggleIsOn('valve4');
            toggleIsOn('valve3');
          }}
        />
        <FaArchive size={50} color="orange" style={{ position: 'absolute', top: '9.5vw', left: '77vw' }} />
        <div style={{ position: 'absolute', top: '13vw', left: '76vw', textAlign: 'center' }}>
          <div>Container2</div>
        </div>

        <GiWaterTower size={150} color="darkblue" style={{ position: 'absolute', top: '3.8vw', left: '-0.5vw', height:
          '10.5vw' }} />

        {/* Nodes with Click Handlers */}
       {/* Node 1 */}
      {/* <div
        style={{
          position: 'absolute',
          cursor: 'pointer',
          top: '4.5vw',
          left: '12.5vw',
          border: highlightedNode === 'Node-1' ? '0.3vw solid yellow' : 'none',
          width: '3.3vw',
          height: '6.9vh',
          boxSizing: 'border-box',
        }}
      >
        <img
          src={WaterQualityNode}
          alt="Water Quality Node"
          style={{
            width: '100%',
            height: '100%',
          }}
          onClick={() => handleNodeClick('Node-1')}
        />
      </div> */}

        
         {/* Node 2 */}
      {/* <div
        style={{
          position: 'absolute',
          cursor: 'pointer',
          top: '45%',
          left: '46%',
          border: highlightedNode === 'Node-2' ? '0.3vw solid yellow' : 'none',
          width: '3.3vw',
          height: '6.9vh',
          boxSizing: 'border-box',
        }}
      >
        <img
          src={WaterQualityNode}
          alt="Water Quality Node"
          style={{
            width: '100%',
            height: '100%',
          }}
          onClick={() => handleNodeClick('Node-2')}
        />
      </div> */}
         {/* Node 3 */}
      {/* <div
        style={{
          position: 'absolute',
          cursor: 'pointer',
          top: '45%',
          left: '83%',
          border: highlightedNode === 'Node-3' ? '0.3vw solid yellow' : 'none',
          width: '3.3vw',
          height: '6.9vh',
          boxSizing: 'border-box',
        }}
      >
        <img
          src={WaterQualityNode}
          alt="Water Quality Node"
          style={{
            width: '100%',
            height: '100%',
          }}
          onClick={() => handleNodeClick('Node-3')}
        />
      </div> */}

        {/* <div style={{ position: 'absolute', top: '8vw', left: '12.5vw', textAlign: 'center' }}>
        <div>Node 1</div>
        </div>
        <div style={{ position: 'absolute', top: '55.5%', left: '46%', textAlign: 'center' }}>
          <div>Node 2</div>
        </div>
        <div style={{ position: 'absolute', top: '55.5%', left: '83%', textAlign: 'center' }}>
          <div>Node 3</div>
        </div> */}
      {/* </div> */}


      <div style={{ display: 'flex', position: 'absolute', top: '60vh', left: '29vw', gap: '26vw' }}>
                <div style={{ textAlign: 'center' }}>
                    <h3>Sand Configuration</h3>
                    <button onClick={() => handleSandClick(200)}>200g</button>
                    <button onClick={() => handleSandClick(600)}>600g</button>
                    <button onClick={() => handleSandClick(800)}>800g</button>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h3>Soil Configuration</h3>
                    <button onClick={() => handleSoilClick(200)}>200g</button>
                    <button onClick={() => handleSoilClick(300)}>300g</button>
                    <button onClick={() => handleSoilClick(800)}>800g</button>
                </div>
            </div>
      {/* Container for Node Data Table, InstructionBox, and Icons and Description table */}
      {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '-4vw', padding: '0 0vw', marginLeft: '2vw' }}> */}
        
        {/* Node Data Table */}
        {/* <div style={{ flex: 2, marginRight: '10px', width: '50vw', marginTop: '-25px', }}>
          <h2> {selectedNode && `  ${selectedNode}`}</h2>
          <div style={{ maxHeight: '30vw' }}>
            {loading ? (
              <p>Loading data...</p>
            ) : nodeData.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ display: 'table', width: '100%',height: '3vw', tableLayout: 'fixed' }}>
                  <tr>
                    <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'left' }}>Parameter</th>
                    <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'left' }}>Value</th>
                    <th style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'left' }}>Units</th>
                  </tr>
                </thead>
                <tbody
                  style={{
                    display: 'block',
                    width: '100%',
                    overflowY: 'auto',
                    maxHeight: '28vw',
                    tableLayout: 'fixed',
                  }}
                >
                  {nodeData.map((row, index) => (
                    <tr
                      key={index}
                      style={{
                        display: 'table',
                        width: '99.8%',
                        height: '2.5vw',
                        tableLayout: 'fixed',
                      }}
                    >
                      <td style={{ border: '1px solid #ddd', padding: '4px' }}>{row.parameter}</td>
                      <td style={{ border: '1px solid #ddd', padding: '4px' }}>{row.value}</td>
                      <td style={{ border: '1px solid #ddd', padding: '4px' }}>{row.units}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Please select a node to view data.</p>
            )}
          </div>
        </div> */}

       {/* InstructionBox */}
        {/* <div style={{ flex: 1, marginRight: '1px' }}>
          <InstructionBox />
        </div> */}

        {/* Icons and Description Table */}
        {/* <div style={{ flex: 1,  }}>
          <div style={{ marginTop: '0', width: '80%',height: '35vh', overflowY: 'hidden' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Description</th>
                </tr>
              </thead>
            </table>
            <div
              style={{
                maxHeight: ' 13vw',
                overflowY: 'auto',
                scrollbarWidth: 'none', // For Firefox
                msOverflowStyle: 'none', // For Internet Explorer and Edge
              }}
            >
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td>
                      <GiWaterTower size={25} color="darkblue" />
                    </td>
                    <td>Water Source</td>
                  </tr>
                  <tr>
                    <td>
                      <hr
                        style={{
                          width: '30px',
                          borderTop: '1px solid black',
                          margin: '10px 0',
                        }}
                      />
                    </td>
                    <td>Pipe</td>
                  </tr>
                  <tr>
                    <td>
                      <GiValve size={25} color="green" />
                    </td>
                    <td>Solenoid Valve Turned On</td>
                  </tr>
                  <tr>
                    <td>
                      <GiValve size={25} color="red" />
                    </td>
                    <td>Solenoid Valve Turned Off</td>
                  </tr>
                  <tr>
                    <td>
                      <MdOutlineInbox size={25} color="black" />
                    </td>
                    <td>Water Quality Node</td>
                  </tr>
                  <tr>
                    <td>
                      <FaArchive size={25} color="brown" />
                    </td>
                    <td>Soil Tank</td>
                  </tr>
                  <tr>
                    <td>
                      <FaArchive size={25} color="orange" />
                    </td>
                    <td>Sand Tank</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        </div> */}

      </div>
   
  );
}

export default ActuationPage;