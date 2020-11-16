import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiamZtZWFkMTYiLCJhIjoiY2toa3ExdG93MHdxcjJycDU2b2pnNjY1NCJ9.s_OM0pZ7AnnkN65MaZjpkA';

const Map = (props) => {
  const mapContainerRef = useRef(null);
  const [lng, setLng] = useState(40.5);
  const [lat, setLat] = useState(60);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat], // starting position [lng, lat]
      zoom: zoom // starting zoom
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    const marker = new mapboxgl.Marker()
    .setLngLat([30.5, 50.5])
    .addTo(map);

    return () => map.remove();
  }, []);

  return (
    <div>
      <div className='map-container' ref={mapContainerRef} />
    </div>
  )
}

export default Map;