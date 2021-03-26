import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="App-map">
        <MapContainer center={[30, 0]} zoom={1} minZoom={1}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[51.505, -0.09]} />
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
