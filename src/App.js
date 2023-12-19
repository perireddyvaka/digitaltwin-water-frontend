import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import CustomCircleMarker from './components/CustomCircleMarker';
import { IoIosWater } from 'react-icons/io';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import Swal from 'sweetalert2';
import axios from 'axios';


const position1 = [17.44774477348508, 78.3485408555236];
const position2 = [17.446987521805, 78.34955172607279];
const position3 = [17.44626262836117, 78.35030479071011];

const mapPosition = [17.44645, 78.34891];

const data = [
  {
    "Node ID": "Node-1",
    "Node Location": [17.44774477348508, 78.3485408555236],
    "Data String Parameters": [
      "Flowrate",
      "Total Flow"
    ]
  },
  {
    "Node ID": "Node-2",
    "Node Location": [17.446987521805, 78.34955172607279],
    "Data String Parameters": [
      "Flow Volume",
      "Flow Time",
      "Flow Rate"
    ]
  },
  {
    "Node ID": "Node-3",
    "Node Location": [17.44626262836117, 78.35030479071011],
    "Data String Parameters": [ 
      "Flow Volume",
      "Flow Time",
      "Flow Rate"
    ]
  }
];

function App() {
  const [markers, setMarkers] = useState([]);
  const [clickedNode, setClickedNode] = useState(null);
  const [isAddingMarker, setIsAddingMarker] = useState(false);


  

  const addMarker = () => {
    const newMarker = {
      position: [17.4474, 78.3491],
      flowrate: 0,
      totalflow: 0,
    };
    setMarkers([...markers, newMarker]);
    setIsAddingMarker(true);
  };

const handleMapClick = (e) => {
  const content = `You clicked at: ${e.latlng.toString()}`;
  console.log("Event Called:");
  console.log(e.latlng.toString());// Fix the syntax here

  // Ensure that mapRef.current is defined before accessing leafletElement
  if (mapRef.current && mapRef.current.leafletElement) {
    L.popup()
      .setLatLng(e.latlng)
      .setContent(content)
      .openOn(mapRef.current.leafletElement);
  }

  if (isAddingMarker) {
    setMarkers((prevMarkers) => {
      const newMarker = {
        position: [e.latlng.lat, e.latlng.lng],
        flowrate: 0,
        totalflow: 0,
      };
      setIsAddingMarker(false);
      return [...prevMarkers, newMarker];
    });
  }
};

  

  const mapRef = useRef();

  const handleMarkerDragEnd = (index, event) => {
    const updatedMarkers = [...markers];
    const { lat, lng } = event.target._latlng;
    updatedMarkers[index].position = [lat, lng];
    setMarkers(updatedMarkers);
  };

  const isPointNearPolyline = (point, polyline, tolerance = 0.0005) => {
    for (let i = 0; i < polyline.length - 1; i++) {
      const segmentStart = L.latLng(polyline[i]);
      const segmentEnd = L.latLng(polyline[i + 1]);
      const distanceToSegment = point.distanceToSegment(segmentStart, segmentEnd);

      if (distanceToSegment < tolerance) {
        return true;
      }
    }

    return false;
  };

  const clearMarkers = () => {
    setMarkers([]);
  };

  const handleMarkerClick = (index) => {
    const marker = markers[index];
    if (marker) {
      const updatedPosition = marker.position;
      const updatedMarkers = markers.map((m, i) => {
        if (i === index) {
          return { ...m, position: [updatedPosition[0], updatedPosition[1]] };
        }
        return m;
      });
      setMarkers(updatedMarkers);
      setClickedNode(marker);
    }
  };

  const handlePopupClick = (index) => {
    const marker = markers[index];
    if (marker) {
      Swal.fire({
        icon: 'info',
        title: `Marker ${index + 1}`,
        html: `<p>Latitude: ${marker.position[0]}</p><p>Longitude: ${marker.position[1]}</p>`,
      });
    }
  };

  const logMarkerCoordinates = () => {
    markers.forEach((marker, index) => {
      console.log(`Marker ${index + 1}: ${marker.position}`);
    });
  };

  useEffect(() => {
    // mapRef.current = null;   
    const map = mapRef.current;
    if (map) {
      console.log("I am clicked")
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
          style={{ maxWidth: '100%', height: '80vh' }}
          scrollWheelZoom={false}
          onClick={handleMapClick}
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
              draggable={true}
              onDragEnd={(event) => handleMarkerDragEnd(index, event)}
              icon={
                new L.divIcon({
                  className: 'custom-icon',
                  html: ReactDOMServer.renderToString(<IoIosWater size={30} color="blue" />),
                  iconSize: [30, 30],
                })
              }
            >
              <Popup>
                {`Marker ${index + 1}`}
                <br />
                Latitude: {marker.position[0]}
                <br />
                Longitude: {marker.position[1]}
              </Popup>
            </Marker>
          ))}
          <Polyline pathOptions={{ color: 'green', dashArray: '5' }} positions={[position1, position2, position3]} />
        </MapContainer>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button onClick={addMarker}>Add Marker</button>
        <button onClick={clearMarkers}>Clear Markers</button>
        <button onClick={logMarkerCoordinates}>Log Marker Coordinates</button>
      </div>
    </div>
  );
}

export default App;
