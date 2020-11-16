import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiamZtZWFkMTYiLCJhIjoiY2toa3ExdG93MHdxcjJycDU2b2pnNjY1NCJ9.s_OM0pZ7AnnkN65MaZjpkA';

const Map = (props) => {
  const siteId = 200;
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: props.data[siteId][props.minute].features[0].geometry.coordinates, // starting position [lng, lat]
      zoom: 12 // starting zoom
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    props.data[siteId][props.minute].features.map(item => {
      new mapboxgl.Marker()
      .setLngLat(item.geometry.coordinates)
      .setRotation(item.properties.bearing)
      .setPopup(new mapboxgl.Popup().setHTML(item.properties.name)) // todo show name of technician without popup
      .addTo(map);  
    });

    return () => map.remove();
  }, [props.minute, props.data]);

  // handle case of no technicians found
  const timeUpdated = new Date(props.data[siteId][props.minute].features[0].properties.tsecs * 1000).toString();
  return (
    <div>
      <p>Updated: <strong>{timeUpdated}</strong></p>
      <div className='map-container' ref={mapContainerRef} />
    </div>
  )
}

export default Map;