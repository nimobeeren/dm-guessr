import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvent, useMap } from 'react-leaflet';
import './App.css';

function App() {
  const [guess, setGuess] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [distance, setDistance] = useState(null);
  const [answer, setAnswer] = useState(null);

  useEffect(() => {
    fetch('/answers.json')
      .then((res) => res.json())
      .then(setAnswer);
  }, []);

  return (
    <div className="App">
      <div className="App-map">
        <MapContainer
          center={[30, 0]}
          zoom={1}
          minZoom={1}
          attributionControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler
            onClick={(e) => {
              if (!submitted) setGuess(e.latlng);
            }}
          />
          <DistanceMeasurer guess={guess} answer={answer} onChange={setDistance} />
          {guess ? <Marker position={guess} /> : null}
          {submitted ? <Marker position={answer} /> : null}
        </MapContainer>
      </div>
      <button
        type="submit"
        disabled={guess == null || submitted}
        onClick={() => {
          setSubmitted(true);
        }}
      >
        Guess
      </button>
      {!submitted ? null : (
        <div className="App-result">
          Nice try! Your guess was {Math.round(distance)} m off.
        </div>
      )}
    </div>
  );
}

function ClickHandler({ onClick }) {
  useMapEvent('click', onClick);
  return null;
}

function DistanceMeasurer({ guess, answer, onChange }) {
  const map = useMap();

  useEffect(() => {
    if (guess && answer) {
      const dist = map.distance(guess, answer);
      onChange(dist);
    }
  }, [guess, answer, map, onChange])
  
  return null;
}

export default App;
