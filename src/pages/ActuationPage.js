// ActuationPage.js
import React, { useState, useEffect } from 'react';
import circuit from '../images/circuit.png';
import { Link} from 'react-router-dom';
import { GiWaterTower, GiValve} from "react-icons/gi"
import { MdOutlineInbox } from "react-icons/md";
import { FaBoxArchive } from "react-icons/fa6";
import axios from 'axios';
import InstructionBox from '../components/InstructionBox/InstructionBox';


import NavigationBar from '../components/Navigation/Navigation';

function ActuationPage() {
  const [isOn, setIsOn] = useState({
    valve1: true,
    valve2: false,
    valve3: true,
    valve4: false,
  });


  useEffect(() => {
    console.log(`${isOn.valve1 ? 1 : 0},${isOn.valve3 ? 1 : 0}`);
    sendArrayToBackend(); // Call the function to send the array whenever values change
  }, [isOn.valve1, isOn.valve3]);

  const toggleIsOn = (valve) => {
    setIsOn((prevState) => ({ ...prevState, [valve]: !prevState[valve] }));
  };

  const sendArrayToBackend = async () => {
    try {
      // Dynamically generate array based on the state of valve1 and valve3
      const arrayToSend = [isOn.valve1 ? 1 : 0, isOn.valve3 ? 1 : 0];

      const response = await axios.post('http://10.3.1.117:8080/actuation', { array: arrayToSend });
      console.log('Array sent to backend:', arrayToSend);
    } catch (error) {
      console.error('Error sending array to backend:', error);
    }
  };

  return (

    <div>
      <div>
        <NavigationBar/>
      {/* <h1 style={{ textAlign: 'center' }}>Actuation Page</h1> */}
      <div style={{ position: 'relative' }}>
        <img src={circuit} alt="circuit" style={{ width: '100%', marginTop: '100px' }} />
        <GiValve size={40} color={isOn.valve1 ? "green" : "red"} style={{position: 'absolute', top: '74%', left: '33%' }} onClick={() => {toggleIsOn('valve1'); toggleIsOn('valve2')}} />
        <GiValve size={40} color={isOn.valve2 ? "green" : "red"} style={{position: 'absolute', top: '63%', left: '30%', transform: 'rotate(90deg)' }} onClick={() => {toggleIsOn('valve2'); toggleIsOn('valve1')}} />
        <GiValve size={40} color={isOn.valve2 ? "green" : "red"} style={{position: 'absolute', top: '63%', left: '48.6%', transform: 'rotate(270deg)' }} onClick={() => {toggleIsOn('valve2'); toggleIsOn('valve1')}} />
        <FaBoxArchive size={40} color="brown" style={{position: 'absolute', top: '32%', left: '39%' }} />
        <GiValve size={40} color={isOn.valve3 ? "green" : "red"} style={{position: 'absolute', top: '74%', left: '66%' }} onClick={() => {toggleIsOn('valve3'); toggleIsOn('valve4')}} />
        <GiValve size={40} color={isOn.valve4 ? "green" : "red"} style={{position: 'absolute', top: '63%', left: '62.7%', transform: 'rotate(90deg)' }} onClick={() => {toggleIsOn('valve4'); toggleIsOn('valve3')}} />
        <GiValve size={40} color={isOn.valve4 ? "green" : "red"} style={{position: 'absolute', top: '63%', left: '81.2%', transform: 'rotate(270deg)' }} onClick={() => {toggleIsOn('valve4'); toggleIsOn('valve3')}} />
        <FaBoxArchive size={40} color="orange" style={{position: 'absolute', top: '32%', left: '72%' }} />

        <GiWaterTower size={150} color="darkblue" style={{position: 'absolute', top: '38%', left: '2%' }}/>

        <MdOutlineInbox size={50} color="black" style={{position: 'absolute', top: '75%', left: '23%' }} />
        <MdOutlineInbox size={50} color="black" style={{position: 'absolute', top: '75%', left: '55%' }}/>
        <MdOutlineInbox size={50} color="black" style={{position: 'absolute', top: '75%', left: '87%' }}/>

        <div style={{ position: 'absolute', top: '88%', left: '23%', textAlign: 'center' }}>
            <div>Node 1</div>
          </div>
          <div style={{ position: 'absolute', top: '88%', left: '55%', textAlign: 'center' }}>
            <div>Node 2</div>
          </div>
          <div style={{ position: 'absolute', top: '88%', left: '87%', textAlign: 'center' }}>
            <div>Node 3</div>
          </div>

      </div>
      <InstructionBox />
        {/* Table for Icons and Text */}
        <table style={{ margin: 'auto', marginTop: '30px', borderCollapse: 'collapse', width: "300px" }}>
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


      <Link to="/">
          <button style={{ display: 'block', margin: 'auto', marginTop: '30px', padding: '10px' }}>Go to Home Page</button>
      </Link>
      </div>
    </div>

    
  );
}

export default ActuationPage;
