import React, { useEffect, useState } from 'react';
import { CircleMarker, Popup, Tooltip } from 'react-leaflet';
import axios from 'axios';

const fetchData = (setDescriptorsData, arr, nodeID) => {
  // ?fetch onem2m data 
  // Get all data of descriptors
  // create a descriptor: data mapping
  // console.log(nodeID)
  const url = "http://127.0.0.1:8080/data/" + nodeID;
  axios.get(url).then((response) => {
    const descData = {}

    // let data = response.data;
    let con = response.data
    for (let i = 0; i < arr.length; i++) {
      descData[arr[i]] = con[i];
    }
    setDescriptorsData(descData)
  })

  // console.log("I am running every second")
}



function CustomCircleMarker({ nodeData, setClickedNode }) {
  const { "Node Location": position, "Node ID": nodeID, "Data String Parameters": arr } = nodeData;
  const [descriptorsData, setDescriptorsData] = useState({})

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(setDescriptorsData, arr, nodeID)
    }, 1000);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.

  }, )

  return (
    <CircleMarker center={position} pathOptions={{ fillColor: 'blue' }} radius={5}
      eventHandlers={{
        click: () => {
          console.log(nodeData['Node ID'])
          setClickedNode(nodeData['Node ID'])

        }
      }}
    >
      <Popup >
        <b>{nodeID}</b> <br />
        {arr.map((element, index) => (
          <p key={index}>{element} :{descriptorsData[element]}</p>

        ))}
      </Popup>
      <Tooltip>{nodeID}</Tooltip>
    </CircleMarker>
  );
}

export default CustomCircleMarker;