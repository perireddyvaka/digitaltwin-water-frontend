// ActuationPage.js
import React, { useState, useEffect } from 'react';
import circuit from '../images/circuit.png';
import { Link} from 'react-router-dom';
import { GiWaterTower, GiValve} from "react-icons/gi"
import { MdOutlineInbox } from "react-icons/md";
import { FaBoxArchive } from "react-icons/fa6";
import axios from 'axios';
import InstructionBox from '../components/InstructionBox/InstructionBox';
// import demopic from '../images/demopic.png';
import Motor from '../images/Motor.png';
import WaterQualityNode from '../images/wqn.png';
import Circuit2 from '../images/final.png'


import NavigationBar from '../components/Navigation/Navigation';

function ActuationPage() {
  const [isOn, setIsOn] = useState({
    valve1: true,
    valve2: false,
    valve3: true,
    valve4: false,
  });

  const [motorState, setMotorState] = useState(false); // Motor is initially off

  const data = [
    { parameter: 'Temperature', value: '25', units: '°C' },
    { parameter: 'Pressure', value: '1.5', units: 'bar' },
    { parameter: 'Flow Rate', value: '10', units: 'L/min' },
    { parameter: 'pH Level', value: '7', units: 'pH' },
  ];


  useEffect(() => {
    console.log(`${isOn.valve1 ? 0 : 1},${isOn.valve3 ? 0 : 1}`);
    sendArrayToBackend(); // Call the function to send the array whenever values change
  }, [isOn.valve1, isOn.valve3]);

  const toggleIsOn = (valve) => {
    setIsOn((prevState) => ({ ...prevState, [valve]: !prevState[valve] }));
  };

  const sendArrayToBackend = async () => {
    try {
      // Dynamically generate array based on the state of valve1 and valve3
      const arrayToSend = [isOn.valve1 ? 0 : 1, isOn.valve3 ? 0 : 1];

      const response = await axios.post('http://10.3.1.117:8080/actuation', { array: arrayToSend });
      console.log('Array sent to backend:', arrayToSend);
    } catch (error) {
      console.error('Error sending array to backend:', error);
    }
  };

  const toggleMotor = async (state) => {
    setMotorState(state);
    const url = state
      ? 'https://smartcitylivinglab.iiit.ac.in/zf-backend-api/motor/actuation/1'
      : 'https://smartcitylivinglab.iiit.ac.in/zf-backend-api/motor/actuation/0';
    
    try {
      const response = await axios.post(url);
      console.log(`Motor ${state ? 'On' : 'Off'} request sent`);
    } catch (error) {
      console.error('Error sending motor request:', error);
    }
  };

  return (

    <div>
      <div>
        <NavigationBar/>
      {/* <h1 style={{ textAlign: 'center' }}>Actuation Page</h1> */}
      <div style={{ position: 'relative' }}>
        <img src={Circuit2} alt="circuit" style={{ width: '100%', marginTop: '80px' }} />
        {/* Motor Image and Buttons */}
        <img 
            src={Motor} 
            alt="Motor" 
            style={{
              position: 'relative',
              width: '4%',
              top: '-9vw',
              left: '17%',
              cursor: 'pointer',
              transform: 'rotate(180deg)'
            }} 
          />
          <div style={{ position: 'absolute', top: '50%', left: '16%' }}>
            <button onClick={() => toggleMotor(true)}>On</button>
            <button onClick={() => toggleMotor(false)}>Off</button>
          </div>

        <GiValve size={40} color={isOn.valve1 ? "green" : "red"} style={{position: 'absolute', top: '60%', left: '45%' }} onClick={() => {toggleIsOn('valve1'); toggleIsOn('valve2')}} />
        <GiValve size={40} color={isOn.valve2 ? "green" : "red"} style={{position: 'absolute', top: '45%', left: '36%', transform: 'rotate(90deg)' }} onClick={() => {toggleIsOn('valve2'); toggleIsOn('valve1')}} />
        <GiValve size={40} color={isOn.valve2 ? "green" : "red"} style={{position: 'absolute', top: '45%', left: '57.5%', transform: 'rotate(270deg)' }} onClick={() => {toggleIsOn('valve2'); toggleIsOn('valve1')}} />
        <FaBoxArchive size={40} color="brown" style={{position: 'absolute', top: '18%', left: '46%' }} />
        <div style={{ position: 'absolute', top: '27%', left: '45.5%', textAlign: 'center' }}>
            <div>Soil tank</div>
          </div>
        <GiValve size={40} color={isOn.valve3 ? "green" : "red"} style={{position: 'absolute', top: '60%', left: '76%' }} onClick={() => {toggleIsOn('valve3'); toggleIsOn('valve4')}} />
        <GiValve size={40} color={isOn.valve4 ? "green" : "red"} style={{position: 'absolute', top: '45%', left: '66.4%', transform: 'rotate(90deg)' }} onClick={() => {toggleIsOn('valve4'); toggleIsOn('valve3')}} />
        <GiValve size={40} color={isOn.valve4 ? "green" : "red"} style={{position: 'absolute', top: '45%', left: '88%', transform: 'rotate(270deg)' }} onClick={() => {toggleIsOn('valve4'); toggleIsOn('valve3')}} />
        <FaBoxArchive size={40} color="orange" style={{position: 'absolute', top: '17.9%', left: '77%' }} />
          <div style={{ position: 'absolute', top: '27%', left: '76.5%', textAlign: 'center' }}>
            <div>Sand tank</div>
          </div>

        <GiWaterTower size={150} color="darkblue" style={{position: 'absolute', top: '48.5%', left: '3%' }}/>

        <img src={WaterQualityNode} alt="Water Quality Node" style={{position: 'absolute', cursor: 'pointer', top: '60%', left: '26%', width: '50px', height: '50px', color: 'black' }} />
        <img src={WaterQualityNode} alt="Water Quality Node" style={{position: 'absolute', cursor: 'pointer', top: '60%', left: '61.5%', width: '50px', height: '50px', color: 'black' }} />
        <img src={WaterQualityNode} alt="Water Quality Node" style={{position: 'absolute', cursor: 'pointer', top: '60%', left: '92%', width: '50px', height: '50px', color: 'black' }} />


        <div style={{ position: 'absolute', top: '71%', left: '26%', textAlign: 'center' }}>
            <div>Node 1</div>
          </div>
          <div style={{ position: 'absolute', top: '71%', left: '61.5%', textAlign: 'center' }}>
            <div>Node 2</div>
          </div>
          <div style={{ position: 'absolute', top: '71%', left: '92%', textAlign: 'center' }}>
            <div>Node 3</div>
          </div>
      </div>

      <div style={{ padding: '1vw', maxWidth: '60vw', marginLeft: '15vw', marginTop: '-3vw' }}>
      <h2>Node Table</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Parameter</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Value</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Units</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.parameter}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.value}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.units}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
            <InstructionBox 
            style={{top: '2vw'}}
            />

        <div >
        {/* Table for Icons and Text */}
        <table style={{  marginTop: '-300px', borderCollapse: 'collapse', width: "14vw", marginLeft: '83vw' }}>
          <thead>
            <tr>
              <th>Icon</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><GiWaterTower size={30} color="darkblue" /></td>
              <td>Water Source</td>
            </tr>
            <tr>
              <td><hr style={{ width: '30px', borderTop: '1px solid black', margin: '10px 0' }} /></td>
              <td>Pipe</td>
            </tr>
            <tr>
              <td><GiValve size={30} color="green" /></td>
              <td>Solenoid Valve Turned On</td>
            </tr>
            <tr>
              <td><GiValve size={30} color="red" /></td>
              <td>Solenoid Valve Turned Off</td>
            </tr>
            <tr>
              <td><MdOutlineInbox size={30} color="black" /></td>
              <td>Water Quality Node</td>
            </tr>
            
            <tr>
              <td><FaBoxArchive size={30} color="brown" /></td>
              <td>Soil Tank</td>
            </tr>
            <tr>
              <td><FaBoxArchive size={30} color="orange" /></td>
              <td>Sand Tank</td>
            </tr>
          </tbody>
        </table>
        </div>


      <Link to="/">
          <button style={{ display: 'block', margin: 'auto', marginTop: '30px', padding: '10px', marginLeft: '83vw' }}>Go to Home Page</button>
      </Link>
      </div>
    </div>

    
  );
}

export default ActuationPage;
