import React, { useEffect, useState } from 'react';
import { CircleMarker, Popup, Tooltip } from 'react-leaflet';
import axios from 'axios';

// Define the lat/lng for each node
const nodeLocations = {
  "Node_1": { lat: 17.44773337470836, lng: 78.34853368169597 },
  "Node_2": { lat: 17.44711288989055, lng: 78.34927584903512 },
  "Node_3": { lat: 17.446087802969153, lng: 78.35051801020884 },
};

const fetchNodeData = async (nodeName, setNodeData, setLoading) => {
  setLoading(true);
  try {
    const response = await axios.get(`http://localhost:8081/data/${nodeName}`);
    const data = response.data;
    const units = {
      // Define units for each parameter if applicable
      Temperature: '°C',
      Uncompensated_TDS: 'ppm',
      Compensated_TDS: 'ppm',
      Voltage_TDS: 'V',
    };
    const dataArray = Object.entries(data).map(([key, value]) => ({
      parameter: key,
      value: value,
      units: units[key] || '',
    }));
    console.log(dataArray);
    setNodeData(dataArray);
  } catch (error) {
    console.error('Error fetching node data:', error);
  } finally {
    setLoading(false);
  }
};

function CustomCircleMarker({ nodeData, setClickedNode }) {
  const { "Node Location": position, "Node ID": nodeID } = nodeData;
  const [nodeDataArray, setNodeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  useEffect(() => {
    if (nodeID) {
      fetchNodeData(nodeID, setNodeData, setLoading);
      // Set latitude and longitude based on the nodeID
      const location = nodeLocations[nodeID];
      if (location) {
        setLatitude(location.lat);
        setLongitude(location.lng);
      }
    }

    const interval = setInterval(() => {
      if (nodeID) {
        fetchNodeData(nodeID, setNodeData, setLoading);
      }
    }, 10000); // Adjust interval as needed

    return () => clearInterval(interval);
  }, [nodeID]);

  return (
    <CircleMarker
      center={position}
      pathOptions={{ fillColor: 'blue' }}
      radius={5}
      eventHandlers={{
        click: () => {
          setClickedNode(nodeID);
        }
      }}
    >
      <Popup>
        <b>{nodeID}</b> <br />
        <p>Latitude: {latitude}</p>
        <p>Longitude: {longitude}</p>
        {loading ? (
          <p>Loading data...</p>
        ) : nodeDataArray.length > 0 ? (
          nodeDataArray.map((item, index) => (
            <p key={index}>{item.parameter}: {item.value} {item.units}</p>
          ))
        ) : (
          <p>No data available</p>
        )}
      </Popup>
      <Tooltip>{nodeID}</Tooltip>
    </CircleMarker>
  );
}

export default CustomCircleMarker;
