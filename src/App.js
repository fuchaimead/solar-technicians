import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import { fetchTechnicians } from './actions';
import Map from './Map';

function App() {
  const [data, setData] = useState(null);
  const [minute, setMinute] = useState(0);
  const timer = () => setMinute(minute + 1);

  useEffect(() => {
    fetchTechnicians(data => setData(data));
  }, []);

  useEffect(() => {
      if (minute === 15) { return; }
      const id = setInterval(timer, 1000);
      return () => clearInterval(id);
    },[minute]);

  if(data === null ) { return(<div>Loading data....</div>) }

  return (
    <div className="App">
      <header>
        <h1>Solar Technicians</h1>
      </header>
      <Map data={data} minute={minute}/>
    </div>
  );
}

export default App;
