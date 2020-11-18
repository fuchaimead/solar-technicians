import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import distance from '@turf/distance';

mapboxgl.accessToken = 'pk.eyJ1IjoiamZtZWFkMTYiLCJhIjoiY2toa3ExdG93MHdxcjJycDU2b2pnNjY1NCJ9.s_OM0pZ7AnnkN65MaZjpkA';

const Map = (props) => {
  const siteId = 200;
  const mapContainerRef = useRef(null);
  const [inProximity, setInProximity] = useState([]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: props.data[siteId][props.minute].features[0].geometry.coordinates, // starting position [lng, lat]
      zoom: 12 // starting zoom
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    props.data[siteId][props.minute].features.forEach(item => {
      new mapboxgl.Marker()
        .setLngLat(item.geometry.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(item.properties.name)) // todo show name of technician without popup
        .setRotation(item.properties.bearing)
        .addTo(map);
    });

    return () => map.remove();
  }, [props.minute, props.data]);

  useEffect(() => {
    // figure out when technicians are close to each other
    // what if multiple techs are close to each other?
    const techs = [];
    for (let i = 0; i < props.data[siteId][props.minute].features.length; i++) {
      for (let j = i + 1; j < props.data[siteId][props.minute].features.length; j++) {
        const from = props.data[siteId][props.minute].features[i].geometry.coordinates;
        const to = props.data[siteId][props.minute].features[j].geometry.coordinates;
        const options = { units: 'kilometers' };
        const techDistance = distance(from, to, options);
        if (techDistance * 1000 < 304.8) {
          techs.push(props.data[siteId][props.minute].features[i].properties.name);
          techs.push(props.data[siteId][props.minute].features[j].properties.name);
        }
        setInProximity(techs);
        break;
      }
    }
  }, [props.data, props.minute]);


  const renderProximityMessage = () => {
    if (inProximity.length >= 1) {
      const string = inProximity.join(' & ');
      return (<p>{`${string} are close to each other`}</p>);
    }
  }

  // todo handle case of no technicians found
  const timeUpdated = new Date(props.data[siteId][props.minute].features[0].properties.tsecs * 1000).toString();
  return (
    <>
      <p>Updated: <strong>{timeUpdated}</strong></p>
      <div className='sidebarStyle'>
        {renderProximityMessage()}
        <div className='map-container' ref={mapContainerRef} />
      </div>
    </>
  );
}

export default Map;