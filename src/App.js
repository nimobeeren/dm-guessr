import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvent,
  useMap,
} from 'react-leaflet';
import './App.css';

function App() {
  const [photos, setPhotos] = useState(null);
  const [score, setScore] = useState(0);
  const [currentRoundNum, setCurrentRoundNum] = useState(0);

  useEffect(() => {
    fetch('/photos.json')
      .then((res) => res.json())
      .then(setPhotos);
  }, []);

  return (
    <div className="App">
      {photos ? (
        <>
          <header>
            <div className="App-score">{score} points</div>
            <div className="App-round">
              Round {currentRoundNum + 1} of {photos.length}
            </div>
          </header>
          <Round
            key={currentRoundNum}
            photo={photos[currentRoundNum]}
            onComplete={(roundScore) => {
              setScore((prev) => prev + roundScore);
            }}
            onNext={() => {
              if (currentRoundNum < photos.length - 1) {
                setCurrentRoundNum((prev) => prev + 1);
              } else {
                alert('This is the eeeeeend');
              }
            }}
          />
        </>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
}

function Round({ photo, onComplete, onNext }) {
  const [guess, setGuess] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [distance, setDistance] = useState(null);
  const [score, setScore] = useState(0);

  const answer = [photo.lat, photo.lon];

  let distanceWithUnit;
  if (distance > 1000) {
    distanceWithUnit = Math.round(distance / 1000) + ' km';
  } else {
    distanceWithUnit = Math.round(distance) + ' m';
  }

  useEffect(() => {
    const s = 5000.3 / 2 ** (distance / 10 ** 6);
    setScore(Math.floor(Math.min(s, 5000)));
  }, [distance, setScore]);

  return (
    <form
      className="Round"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        onComplete(score);
      }}
    >
      <div className="Round-map">
        <MapContainer
          center={[30, 0]}
          zoom={1}
          minZoom={1}
          maxBounds={[
            [-90, Number.NEGATIVE_INFINITY],
            [90, Number.POSITIVE_INFINITY],
          ]}
          worldCopyJump
        >
          <TileLayer
            attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
            url={
              'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}'
            }
            maxZoom={18}
            id="mapbox/streets-v11"
            tileSize={512}
            zoomOffset={-1}
            accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
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
          {/* @ts-ignore */}
          {submitted ? <Marker position={answer} /> : null}
        </MapContainer>
      </div>
      {submitted ? (
        <>
          <div className="App-result">
            Nice try! Your guess was {distanceWithUnit} off. You got {score}{' '}
            points for that one.
          </div>
          <button type="button" onClick={onNext}>
            Next
          </button>
        </>
      ) : (
        <button type="submit" disabled={guess == null}>
          Guess
        </button>
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
