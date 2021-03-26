import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvent } from 'react-leaflet';
import './App.css';

function App() {
  const [guess, setGuess] = useState();

  return (
    <div className="App">
      <div className="App-map">
        <MapContainer center={[30, 0]} zoom={1} minZoom={1}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onClick={(e) => setGuess(e.latlng)} />
          {guess == null ? null : <Marker position={guess} />}
        </MapContainer>
      </div>
    </div>
  );
}

function ClickHandler({ onClick }) {
  useMapEvent('click', onClick);
  return null;
}

export default App;
