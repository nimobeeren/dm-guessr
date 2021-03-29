import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvent,
  useMap,
} from 'react-leaflet';
import './App.css';

function App() {
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch('/answers.json')
      .then((res) => res.json())
      .then(setAnswer);
  }, []);

  return (
    <div className="App">
      <div>Score: {score}</div>
      <Round answer={answer} onComplete={setScore} />
    </div>
  );
}

function Round({ answer, onComplete }) {
  const [guess, setGuess] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [distance, setDistance] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const s = 5000.3 / 2 ** (distance / 10 ** 6);
    setScore(Math.floor(Math.min(s, 5000)));
  }, [distance, setScore]);

  return (
    <form
      className="App-round"
      action="#"
      onSubmit={() => {
        setSubmitted(true);
        onComplete(score);
      }}
    >
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
          <DistanceMeasurer
            guess={guess}
            answer={answer}
            onChange={setDistance}
          />
          {guess ? <Marker position={guess} /> : null}
          {submitted ? <Marker position={answer} /> : null}
        </MapContainer>
      </div>
      <button type="submit" disabled={guess == null || submitted}>
        Guess
      </button>
      {!submitted ? null : (
        <div className="App-result">
          Nice try! Your guess was {Math.round(distance)} m off. You got {score}{' '}
          points for that one.
        </div>
      )}
    </form>
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
  }, [guess, answer, map, onChange]);

  return null;
}

export default App;
