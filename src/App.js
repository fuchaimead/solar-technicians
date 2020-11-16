import './App.css';
import React, { useEffect, useState } from 'react';
import { fetchTechnicians } from './actions';
import Map from './Map';

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchTechnicians(data => setData(data));
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Solar Technicians</h1>
      </header>
      <Map data={data}/>
    </div>
  );
}

export default App;
