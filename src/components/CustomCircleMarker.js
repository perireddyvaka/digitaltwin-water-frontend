import React, { useEffect, useState } from 'react';
import { CircleMarker, Popup, Tooltip } from 'react-leaflet';
import axios from 'axios';

const fetchNodeData = async (nodeName, setNodeData, setLoading) => {
  setLoading(true);
  try {
    const response = await axios.get(`http://localhost:8080/data/${nodeName}`);
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
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    if (nodeID) {
      fetchNodeData(nodeID, setNodeData, setLoading);
    }

    const interval = setInterval(() => {
      if (nodeID) {
        fetchNodeData(nodeID, setNodeData, setLoading);
      }
    }, 10000); // Adjust interval as needed

    return () => clearInterval(interval);
  }, [nodeID]);

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const response = await axios.post('http://localhost:8080/real-time-location');
        const data = response.data;
        setLatitude(data.latitude || 'N/A');
        setLongitude(data.longitude || 'N/A');
      } catch (error) {
        console.error('Error fetching real-time location data:', error);
      }
    };

    fetchRealTimeData(); // Initial fetch
    const intervalId = setInterval(fetchRealTimeData, 15000); // Adjust interval as needed

    return () => clearInterval(intervalId);
  }, []);

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
