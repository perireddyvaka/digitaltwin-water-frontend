
import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Polygon, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import CustomCircleMarker from './components/CustomCircleMarker';
import { IoIosWater } from 'react-icons/io';
import { BsFillBoxFill } from "react-icons/bs";
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import Swal from 'sweetalert2';
import axios from 'axios';
import './App.css';

const dt_node_1 = [17.44773337470836, 78.34853368169597];
const dt_node_2 = [17.44711288989055, 78.34927584903512];
const dt_node_3 = [17.446087802969153, 78.35051801020884];

const newNode1 = [dt_node_1[0] - 0.00005, dt_node_1[1] - 0.00005];
const newNode3 = [dt_node_3[0] - 0.00005, dt_node_3[1] - 0.00005];
const newNode4 = [dt_node_1[0] + 0.00005, dt_node_1[1] + 0.00005];
const newNode6 = [dt_node_3[0] + 0.00005, dt_node_3[1] + 0.00005];

const n1 = [17.4475186984464, 78.34878444671632]
const n2 = [17.447779877527292, 78.34900975227357]
const n3 = [17.447467486818034, 78.34940671920778]
const n4 = [17.4471960649475, 78.3491760492325]
const n5 = [17.44675052251036, 78.34972321987152]
const n6 = [17.446991217985186, 78.34991633892061]
const n7 = [17.446622492872986, 78.3503830432892]
const n8 = [17.446366433328517, 78.35017383098604]

const new1 = [17.447549425416515, 78.34874153137208];
const new2 = [17.447493092634005, 78.34880590438844];
const new3 = [17.447810604453373, 78.34900975227357];
const new4 = [17.447733787128456, 78.34902584552765];
const new5 = [17.44745203101903, 78.34936916828156];
const new6 = [17.447467486818034, 78.34944963455202];
const new7 = [17.447221670801614, 78.34914922714235];
const new8 = [17.447185822604858, 78.34920287132263];

const New1 = [17.44675564369398, 78.34969103336336];
const New2 = [17.446724916590068, 78.34975004196168];
const New3 = [17.447021945044202, 78.34992170333864];
const New4 = [17.446934885030213, 78.3499324321747];
const New5 = [17.446607129310465, 78.3503293991089];
const New6 = [17.446622492872986, 78.3504366874695];
const New7 = [17.44639716049285, 78.35014164447786];
const New8 = [17.44634082735428, 78.35021674633028];


const mapPosition = [17.44695, 78.34891];

// async function getNodeLocation(nodeId) {
//   let url = `http://127.0.0.1:8080/desc/${nodeId}`;

//   try {
//     let response = await fetch(url);
//     let data = await response.json();

//     // Extract and parse Node Location
//     let nodeLocationStr = data['Node Location'];
//     let nodeLocation = JSON.parse(nodeLocationStr);

//     console.log(`Node ${nodeId} Location:`, nodeLocation);
    
//     // Further actions with the node location data can be performed here
//     // For instance, updating state in React, displaying on the UI, etc.
//   } catch (error) {
//     console.error(`Error fetching data for Node ${nodeId}:`, error);
//   }
// }

// // Usage example
// getNodeLocation('Node-1');




// // Call the function to display node location in the console
// displayNodeLocation();


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

function HomePage() {
    const [markers, setMarkers] = useState([]);
    const [saltmarkers, setSaltMarkers] = useState([]);
    const [soilmarkers, setSoilMarkers] = useState([]);
    const [clickedNode, setClickedNode] = useState(null);
    const [isAddingMarker, setIsAddingMarker] = useState(false);
  
    const [clickedLatLng, setClickedLatLng] = useState(null);
    const [clickedCoordinates, setClickedCoordinates] = useState(null);
  
    const [latitudeInput, setLatitudeInput] = useState('17.447356');
    const [longitudeInput, setLongitudeInput] = useState('78.349047');
    const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
  
    const [lastNodeCrossed, setLastNodeCrossed] = useState(null); 
  
    const mapRef = useRef();
  
    const clearMarkers = () => {
      setMarkers([]);
    };
    const clearSaltMarkers = () => {
      setSaltMarkers([]);
    };
    const clearSoilMarkers = () => {
      setSoilMarkers([]);
    };
  
    const handleRemoveMarker = (index) => {
      if (index !== null) {
        const updatedMarkers = markers.filter((_, i) => i !== index);
        setMarkers(updatedMarkers);
        setSelectedMarkerIndex(null);
      }
    };
    const handleRemoveSaltMarker = (index) => {
      if (index !== null) {
        const updatedSaltMarkers = saltmarkers.filter((_, i) => i !== index);
        setSaltMarkers(updatedSaltMarkers);
        setSelectedMarkerIndex(null);
      }
    };
    const handleRemoveSoilMarker = (index) => {
      if (index !== null) {
        const updatedSoilMarkers = soilmarkers.filter((_, i) => i !== index);
        setSoilMarkers(updatedSoilMarkers);
        setSelectedMarkerIndex(null);
      }
    };
  
    const isPointNearLine2 = (point, fps) => {
      const [x,y] = point; 
      const [x1,y1] = fps[0];
      const [x2,y2] = fps[1];
      const [x3,y3] = fps[2];
      const [x4,y4] = fps[3];
  
      const slope1 = (y2-y1)/(x2-x1);
      const slope2 = (y4-y3)/(x4-x3);
  
      const slope3 = (y3-y1)/(x3-x1);
      const slope4 = (y4-y2)/(x4-x2);
  
      const val1 = (y-y1) - slope1*(x-x1);
      const val2 = (y-y3) - slope2*(x-x3);
  
      const val3 = (y-y1) - slope3*(x-x1);
      const val4 = (y-y2) - slope4*(x-x2); 

      console.log(val1);
      console.log(val2);
      console.log(val3);
      console.log(val4);
  
      if(val1>0 && val2<0 && val3>0 && val4<0) 
      {
        return true;
      }
      return false;
  
    };
    
    const getNearestNode = (markerPosition) => {
      const distances = {
        Node1: mapRef.current.distance(markerPosition, [dt_node_1[0], dt_node_1[1]]),
        Node2: mapRef.current.distance(markerPosition, [dt_node_2[0], dt_node_2[1]]),
        Node3: mapRef.current.distance(markerPosition, [dt_node_3[0], dt_node_3[1]]),
      };
    
      const nearestNode = Object.keys(distances).reduce((a, b) => (distances[a] < distances[b] ? a : b));
    
      return { node: nearestNode, distance: distances[nearestNode] };
    };
    
  
    const handleMapClick = (e) => {
      console.log("handleMapClick Called ");
      const latitude = e.latlng.lat;
      const longitude = e.latlng.lng;
      setClickedLatLng({ latitude, longitude });
      console.log(latitude, longitude);
    
      console.log(
        'Is point near rectangle:',
        isPointNearLine2([latitude, longitude], [newNode1, newNode3, newNode4, newNode6], 0.0001)
      );
    
      // Check if the clicked point is inside the rectangle
      if (isPointNearLine2([latitude, longitude], [newNode1,newNode3, newNode4, newNode6])) {
        console.log("Marker added");
    
        // Get the distances to neighboring nodes
        const distanceToNode1 = mapRef.current.distance([latitude, longitude], dt_node_1);
        const distanceToNode2 = mapRef.current.distance([latitude, longitude], dt_node_2);
        const distanceToNode3 = mapRef.current.distance([latitude, longitude], dt_node_3);
    
        // Calculate the total distance between neighboring nodes
        const totalDistance1 = mapRef.current.distance(dt_node_1,dt_node_2);
        const totalDistance2 = mapRef.current.distance(dt_node_2, dt_node_3);
        const totalDistance3 = mapRef.current.distance(dt_node_3, dt_node_1);
    
        // Calculate the percentages along the line segment
        const percentage1 = (distanceToNode1 / totalDistance1) * 100;
        let percentage2 = (distanceToNode2 / totalDistance2) * 100;
        const percentage3 = (distanceToNode3 / totalDistance3) * 100;
  
        if (percentage1 < 100) {
          percentage2 = percentage2 - 100;
        }
    
        console.log('Nearest Node 1:', dt_node_1);
        console.log('Nearest Node 2:', dt_node_2);
        console.log('Nearest Node 3:', dt_node_3);
        console.log('Distance to Nearest Node 1:', distanceToNode1.toFixed(2), 'meters');
        console.log('Distance to Nearest Node 2:', distanceToNode2.toFixed(2), 'meters');
        console.log('Distance to Nearest Node 3:', distanceToNode3.toFixed(2), 'meters');
        console.log('Percentage along the Line 1-2:', percentage1.toFixed(2), '%');
        console.log('Percentage along the Line 2-3:', percentage2.toFixed(2), '%');
        console.log('Percentage along the Line 3-1:', percentage3.toFixed(2), '%');
    
        // Proceed to add a marker
        const newMarker = {
          position: [latitude, longitude],
          flowrate: 0,
          totalflow: 0,
        };
        setLatitudeInput(latitude);
        setLongitudeInput(longitude);
      }
      else if(isPointNearLine2([latitude, longitude], [new1,new2, new3, new4]))
      {
        console.log("Marker added");
        const newMarker = {
          position: [latitude, longitude],
          flowrate: 0,
          totalflow: 0,
        };
        setLatitudeInput(latitude);
        setLongitudeInput(longitude);
      } 
      else if(isPointNearLine2([latitude, longitude], [new4 ,new5, new3, new6]))
      {
        console.log("Marker added");
        const newMarker = {
          position: [latitude, longitude],
          flowrate: 0,
          totalflow: 0,
        };
        setLatitudeInput(latitude);
        setLongitudeInput(longitude);
      } 
      else if(isPointNearLine2([latitude, longitude], [new7 ,new8, new5, new6]))
      {
        console.log("Marker added");
        const newMarker = {
          position: [latitude, longitude],
          flowrate: 0,
          totalflow: 0,
        };
        setLatitudeInput(latitude);
        setLongitudeInput(longitude);
      }
      else if(isPointNearLine2([latitude, longitude], [New1, New2, New3, New4]))
      {
        console.log("Marker added");
        const newMarker = {
          position: [latitude, longitude],
          flowrate: 0,
          totalflow: 0,
        };
        setLatitudeInput(latitude);
        setLongitudeInput(longitude);
      } 
      else if(isPointNearLine2([latitude, longitude], [New4, New5, New3, New6]))
      {
        console.log("Marker added");
        const newMarker = {
          position: [latitude, longitude],
          flowrate: 0,
          totalflow: 0,
        };
        setLatitudeInput(latitude);
        setLongitudeInput(longitude);
      } 
      else if(isPointNearLine2([latitude, longitude], [New7, New8, New5, New6]))
      {
        console.log("Marker added");
        const newMarker = {
          position: [latitude, longitude],
          flowrate: 0,
          totalflow: 0,
        };
        setLatitudeInput(latitude);
        setLongitudeInput(longitude);
      } 
      else {
        // The clicked point is not inside the rectangle, show an alert
        console.log("Invalid Placement - Outside Rectangle");
        Swal.fire({
          title: 'Invalid Placement',
          text: 'Please place the marker inside the rectangle.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    };
    
    
  
    // Nearest Node Calculator with distance
    // const handleMapClick = (e) => {
    //   console.log("handleMapClick Called ");
    //   const latitude = e.latlng.lat;
    //   const longitude = e.latlng.lng;
    //   setClickedLatLng({ latitude, longitude });
    //   console.log(latitude, longitude);
    
    //   const rectangleBounds = L.latLngBounds([newNode1, newNode2, newNode3, newNode6]);
    
    //   // Check if the clicked point is inside the rectangle
    //   if (rectangleBounds.contains([latitude, longitude])) {
    //     console.log("Marker added");
    //     const newMarker = {
    //       position: [latitude, longitude],
    //       flowrate: 0,
    //       totalflow: 0,
    //     };
    //     setMarkers([...markers, newMarker]);
    //     setLatitudeInput('');
    //     setLongitudeInput('');
    
    //     // Get the nearest node details
    //     const nearestNodeDetails = getNearestNode([latitude, longitude]);
    //     console.log('Nearest Node:', nearestNodeDetails.node);
    //     console.log('Distance to Nearest Node:', nearestNodeDetails.distance.toFixed(2), 'meters');
    //   } else {
    //     // The clicked point is not inside the rectangle, show an alert
    //     console.log("Invalid Placement");
    //     Swal.fire({
    //       title: 'Invalid Placement',
    //       text: 'Please place the marker inside the rectangle.',
    //       icon: 'error',
    //       confirmButtonText: 'OK',
    //     });
    //   }
    // };
  
    
  //Rectangle Working Code 
  //   const handleMapClick = (e) => {
  //   console.log("handleMapClick Called ");
  //   const latitude = e.latlng.lat;
  //   const longitude = e.latlng.lng;
  //   setClickedLatLng({ latitude, longitude });
  //   console.log(latitude, longitude);
  
  //   // Log if the point is near the rectangle
  //   console.log(
  //     'Is point near rectangle:',
  //     isPointNearLine([latitude, longitude], [newNode1, newNode2, newNode3, newNode6, newNode5, newNode4], 0.0001)
  //   );
  
  //   // Check if the clicked point is close enough to the rectangle
  //   if (isPointNearLine([latitude, longitude], [newNode1, newNode2, newNode3, newNode6, newNode5, newNode4], 0.0001)) {
  //     // The clicked point is inside the rectangle, proceed to add a marker
  //     console.log("Marker added");
  //     const newMarker = {
  //       position: [latitude, longitude],
  //       flowrate: 0,
  //       totalflow: 0,
  //     };
  //     setMarkers([...markers, newMarker]);
  //     setLatitudeInput('');
  //     setLongitudeInput('');
  //   } else {
  //     // The clicked point is not inside the rectangle, show an alert
  //     console.log("Invalid Placement");
  //     Swal.fire({
  //       title: 'Invalid Placement',
  //       text: 'Please place the marker inside the rectangle.',
  //       icon: 'error',
  //       confirmButtonText: 'OK',
  //     });
  //   }
  // };
  
  // const isPointInsideRectangle = (point, rectangle) => {
  //   const [x, y] = point;
  //   const [x1, y1, x2, y2, x3, y3, x4, y4] = rectangle;
  
  //   const isInside = (x, y, x1, y1, x2, y2, x3, y3) => {
  //     const d1 = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1);
  //     const d2 = (x - x2) * (y3 - y2) - (y - y2) * (x3 - x2);
  //     const d3 = (x - x3) * (y4 - y3) - (y - y3) * (x4 - x3);
  //     const d4 = (x - x4) * (y1 - y4) - (y - y4) * (x1 - x4);
  //     return (d1 > 0 && d2 > 0 && d3 > 0 && d4 > 0) || (d1 < 0 && d2 < 0 && d3 < 0 && d4 < 0);
  //   };
  
  //   return isInside(x, y, x1, y1, x2, y2, x3, y3) || isInside(x, y, x1, y1, x4, y4, x3, y3);
  // };
  
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
  
    const buildSaltPopupContent = (index) => {
      const marker = saltmarkers[index];
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
  
    const buildSoilPopupContent = (index) => {
      const marker = soilmarkers[index];
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
  
    const addSaltMarker = () => {
      if (latitudeInput && longitudeInput) {
        const newMarker = {
          position: [parseFloat(latitudeInput), parseFloat(longitudeInput)],
          temparature: 0,
          u_tds: 0,
          total_flow: 0,
          v_tds: 0,
        };
        setSaltMarkers([...saltmarkers, newMarker]);
        setLatitudeInput((prev) => (prev === '' ? '' : (parseFloat(prev)).toString()));
        setLongitudeInput((prev) => (prev === '' ? '' : (parseFloat(prev)).toString()));
      }
    };
  
    const addSoilMarker = () => {
      if (latitudeInput && longitudeInput) {
        const newMarker = {
          position: [parseFloat(latitudeInput), parseFloat(longitudeInput)],
          temparature: 0,
          u_tds: 0,
          total_flow: 0,
          v_tds: 0,
        };
        setSoilMarkers([...soilmarkers, newMarker]);
        setLatitudeInput((prev) => (prev === '' ? '' : (parseFloat(prev)).toString()));
        setLongitudeInput((prev) => (prev === '' ? '' : (parseFloat(prev)).toString()));
      }
    };
  
    
  
    useEffect(() => {
      const map = mapRef.current;
      if (map) {
        map.on('click', handleMapClick);
  
      // }
      const node1 = L.latLng(dt_node_1[0], dt_node_1[1]);
      const node2 = L.latLng(dt_node_2[0], dt_node_2[1]);
      const node3 = L.latLng(dt_node_3[0], dt_node_3[1]);
  
      const distanceNode1ToNode2 = node1.distanceTo(node2);
      const distanceNode2ToNode3 = node2.distanceTo(node3);
      const distanceNode1ToNode3 = node1.distanceTo(node3);
  
      console.log('Distance between Node 1 and Node 2:', distanceNode1ToNode2.toFixed(2), 'meters');
      console.log('Distance between Node 2 and Node 3:', distanceNode2ToNode3.toFixed(2), 'meters');
      console.log('Distance between Node 1 and Node 3:', distanceNode1ToNode3.toFixed(2), 'meters');
  
  
      // Log new coordinates
      console.log('New Node 1:', newNode1);
      console.log('New Node 3:', newNode3);
      console.log('New Node 4:', newNode4);
      console.log('New Node 6:', newNode6);
  
      // Draw a polygon with the new coordinates in red color
      // L.polygon(polygonCoordinates, { color: 'red' }).addTo(mapRef.current);
  
    }
  
      const nodes = ["Node-1", "Node-2", "Node-3"];
      for (let i = 0; i < nodes.length; i++) {
        let url = "http://localhost:8080/desc/" + nodes[i];
        axios.get(url).then((response) => {
          data[nodes[i]] = response.data;
        });
      }
    }, [mapRef.current]);
    
    const [popupContent, setPopupContent] = useState(null);
  
    // const handleRectangleClick = (rectangleId) => {
    //   // Define the content for the popup based on the clicked rectangle
    //   if (rectangleId === 1) {
    //     setPopupContent('Soil Tank!');
    //   } else if (rectangleId === 2) {
    //     setPopupContent('Salt Tank!');
    //   }
    //   // Add more conditions for other rectangles if needed
    // };
    const handleRectangleClick = (name) => {
      setPopupContent(`Clicked on ${name}`);
    };
  
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
  
            {saltmarkers.map((marker, index) => (
              <Marker
                key={index}
                position={marker.position}
                icon={
                  new L.divIcon({
                    className: 'custom-icon',
                    html: ReactDOMServer.renderToString(<BsFillBoxFill size={30} color="orange" />),
                    iconSize: [30, 30],
                  })
                }
              >
                <Popup>{buildSaltPopupContent(index)}</Popup>
              </Marker>
            ))}
  
            {soilmarkers.map((marker, index) => (
              <Marker
                key={index}
                position={marker.position}
                icon={
                  new L.divIcon({
                    className: 'custom-icon',
                    html: ReactDOMServer.renderToString(<BsFillBoxFill size={30} color="brown" />),
                    iconSize: [30, 30],
                  })
                }
              >
                <Popup>{buildSoilPopupContent(index)}</Popup>
              </Marker>
            ))}
            <Polyline pathOptions={{ color: 'green', dashArray: '5' }} positions={[dt_node_1, dt_node_2, dt_node_3]} />
            <Polyline pathOptions={{ color: 'green', dashArray: '5' }} positions={[n1, n2, n3, n4]} />
            <Polyline pathOptions={{ color: 'green', dashArray: '5' }} positions={[n5, n6, n7, n8]} />
            {/* Add Rectangle components */}
            <Rectangle bounds={[[17.447590394701948, 78.34924042224885], 
          [17.4476620909293, 78.34914386272432]]}  
            pathOptions={{ color: 'brown' }} 
            eventHandlers={{ click: () => handleRectangleClick('Rectangle 1') }}
            >
            {popupContent && <Popup>{popupContent}</Popup>}
            </Rectangle>
            <Rectangle bounds={[[17.446760764877457, 78.35020601749422], 
          [17.44685294615552, 78.35008263587953]]}  
            pathOptions={{ color: 'orange' }}
            eventHandlers={{ click: () => handleRectangleClick('Rectangle 2') }}
            >
            {popupContent && <Popup>{popupContent}</Popup>}
            </Rectangle>
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
          
          <button onClick={addMarker}>Add Marker</button>
          <button onClick={clearMarkers}>Clear Markers</button>
          <button onClick={addSaltMarker}>Add Salt Marker</button>
          <button onClick={clearSaltMarkers}>Clear Salt Markers</button>
          <button onClick={addSoilMarker}>Add Soil Marker</button>
          <button onClick={clearSoilMarkers}>Clear Soil Markers</button>
  
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
                  <td>Water Marker {index + 1}</td>
                  <td>{marker.position[0].toFixed(6)}</td>
                  <td>{marker.position[1].toFixed(6)}</td>
                  <td>
                    <button onClick={() => handleRemoveMarker(index)}>
                      Remove Marker
                    </button>
                  </td>
                </tr>
              ))}
              {saltmarkers.map((marker, index) => (
                <tr key={index}>
                  <td>Salt Marker {index + 1}</td>
                  <td>{marker.position[0].toFixed(6)}</td>
                  <td>{marker.position[1].toFixed(6)}</td>
                  <td>
                    <button onClick={() => handleRemoveSaltMarker(index)}>
                      Remove Marker
                    </button>
                  </td>
                </tr>
              ))}
              {soilmarkers.map((marker, index) => (
                <tr key={index}>
                  <td>Soil Marker {index + 1}</td>
                  <td>{marker.position[0].toFixed(6)}</td>
                  <td>{marker.position[1].toFixed(6)}</td>
                  <td>
                    <button onClick={() => handleRemoveSoilMarker(index)}>
                      Remove Marker
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to="/actuation">
          <button style={{ display: 'block', margin: 'auto', marginTop: '10px', padding: '10px' }} >Go to Actuation Page</button>
        </Link>
      </div>
    );
}

export default HomePage;

  