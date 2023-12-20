import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import CustomCircleMarker from './components/CustomCircleMarker';
import { IoIosWater } from 'react-icons/io';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import Swal from 'sweetalert2';
import axios from 'axios';
import './App.css';

const dt_node_1 = [17.44773337470836, 78.34853368169597];
const dt_node_2 = [17.44711288989055, 78.34927584903512];
const dt_node_3 = [17.446087802969153, 78.35051801020884];

const mapPosition = [17.44695, 78.34891];

const data = [
  {
    "Node ID": "Node-1",
    "Node Location": [17.44773337470836, 78.34853368169597],
    "Data String Parameters": [
      "Temperature", 
      "Uncompensated_TDS" , 
      "Compensated_TDS", 
      "Voltage_TDS"
    ]
  },
  {
    "Node ID": "Node-2",
    "Node Location": [17.44711288989055, 78.34927584903512],
    "Data String Parameters": [
      "Temperature", 
      "Uncompensated_TDS" , 
      "Compensated_TDS", 
      "Voltage_TDS"
    ]
  },
  {
    "Node ID": "Node-3",
    "Node Location": [17.446087802969153, 78.35051801020884],
    "Data String Parameters": [
      "Temperature", 
      "Uncompensated_TDS" , 
      "Compensated_TDS", 
      "Voltage_TDS"
    ]
  }
];

function App() {
  const [markers, setMarkers] = useState([]);
  const [clickedNode, setClickedNode] = useState(null);
  const [isAddingMarker, setIsAddingMarker] = useState(false);

  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [clickedCoordinates, setClickedCoordinates] = useState(null);

  const [latitudeInput, setLatitudeInput] = useState('17.447356');
  const [longitudeInput, setLongitudeInput] = useState('78.349047');
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);

  const mapRef = useRef();

  const clearMarkers = () => {
    setMarkers([]);
  };

  const handleRemoveMarker = (index) => {
    if (index !== null) {
      const updatedMarkers = markers.filter((_, i) => i !== index);
      setMarkers(updatedMarkers);
      setSelectedMarkerIndex(null);
    }
  };

  const handleMapClick = (e) => {
    const latitude = e.latlng.lat.toFixed(6);
    const longitude = e.latlng.lng.toFixed(6);
    setClickedLatLng({ latitude, longitude });

    if (latitudeInput && longitudeInput) {
      const newMarker = {
        position: [parseFloat(latitudeInput), parseFloat(longitudeInput)],
        temparature: 0,
        u_tds: 0,
        total_flow: 0,
        v_tds: 0,
      };
      setMarkers([...markers, newMarker]);
      setLatitudeInput('');
      setLongitudeInput('');
    }
  };

  const logMarkerCoordinates = () => {
    markers.forEach((marker, index) => {
      console.log(`Marker ${index + 1}: ${marker.position}`);
    });
  };

  const buildPopupContent = (index) => {
    const marker = markers[index];
    if (marker && clickedLatLng) {
      return (
        <div>
          {`Marker ${index + 1} - Clicked Coordinates:`}
          <br />
          Latitude: {clickedLatLng.latitude}
          <br />
          Longitude: {clickedLatLng.longitude}
        </div>
      );
    } else {
      return (
        <div>
          {`Marker ${index + 1} - Coordinates:`}
          <br />
          Latitude: {marker.position[0].toFixed(6)}
          <br />
          Longitude: {marker.position[1].toFixed(6)}
        </div>
      );
    }
  };

  const addMarker = () => {
    if (latitudeInput && longitudeInput) {
      const newMarker = {
        position: [parseFloat(latitudeInput), parseFloat(longitudeInput)],
        temparature: 0,
        u_tds: 0,
        total_flow: 0,
        v_tds: 0,
      };
      setMarkers([...markers, newMarker]);
      setLatitudeInput((prev) => (prev === '' ? '' : (parseFloat(prev)).toString()));
      setLongitudeInput((prev) => (prev === '' ? '' : (parseFloat(prev)).toString()));
    }
  };

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.on('click', handleMapClick);
    }

    const nodes = ["Node-1", "Node-2"];
    for (let i = 0; i < nodes.length; i++) {
      let url = "http://localhost:8080/desc/" + nodes[i];
      axios.get(url).then((response) => {
        data[nodes[i]] = response.data;
      });
    }
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Digital Twin Water Simulation</h1>
      <div className="main" id="map" style={{ width: '100%', textAlign: 'center' }}>
        <MapContainer
          ref={mapRef}
          center={mapPosition}
          zoom={18}
          style={{ maxWidth: '100%', height: '60vh' }}
          scrollWheelZoom={false}
        >
          <TileLayer url='https://tile.openstreetmap.org/{z}/{x}/{y}.png' />
          {data.map((nodeData, index) => (
            <CustomCircleMarker
              key={index}
              nodeData={nodeData}
              setClickedNode={setClickedNode}
            />
          ))}
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              icon={
                new L.divIcon({
                  className: 'custom-icon',
                  html: ReactDOMServer.renderToString(<IoIosWater size={30} color="blue" />),
                  iconSize: [30, 30],
                })
              }
            >
              <Popup>{buildPopupContent(index)}</Popup>
            </Marker>
          ))}
          <Polyline pathOptions={{ color: 'green', dashArray: '5' }} positions={[dt_node_1, dt_node_2, dt_node_3]} />
        </MapContainer>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <div>
          <label>Latitude:</label>
          <input
            type="number"
            value={latitudeInput}
            // defaultValue={17.447356}
            onChange={(e) => setLatitudeInput(e.target.value)}
          />

          <label>Longitude:</label>
          <input
            type="number"
            value={longitudeInput}
            // defaultValue={78.349047}
            onChange={(e) => setLongitudeInput(e.target.value)}
          />
        </div>
        <button onClick={() => handleRemoveMarker(selectedMarkerIndex)}>Remove Marker</button>
        <button onClick={addMarker}>Add Marker</button>
        <button onClick={clearMarkers}>Clear Markers</button>
        <button onClick={logMarkerCoordinates}>Log Marker Coordinates</button>

        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Marker Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Remove Marker</th>
            </tr>
          </thead>
          <tbody>
            {markers.map((marker, index) => (
              <tr key={index}>
                <td>Marker {index + 1}</td>
                <td>{marker.position[0].toFixed(6)}</td>
                <td>{marker.position[1].toFixed(6)}</td>
                <td>
                  <button onClick={() => handleRemoveMarker(index)}>
                    Remove Marker
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
