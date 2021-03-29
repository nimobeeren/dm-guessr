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
  const [answers, setAnswers] = useState(null);
  const [score, setScore] = useState(0);
  const [roundNum, setRoundNum] = useState(0);

  useEffect(() => {
    fetch('/answers.json')
      .then((res) => res.json())
      .then(setAnswers);
  }, []);

  return (
    <div className="App">
      {answers ? (
        <>
          <table>
            <tbody>
              <tr>
                <td>Score:</td>
                <td>{score}</td>
              </tr>
              <tr>
                <td>Round:</td>
                <td>
                  {roundNum + 1} of {answers.length}
                </td>
              </tr>
            </tbody>
          </table>
          <Round
            key={roundNum}
            answer={answers[roundNum]}
            onComplete={(roundScore) => {
              setScore((prev) => prev + roundScore);
            }}
            onNext={() => {
              if (roundNum < answers.length - 1) {
                setRoundNum((prev) => prev + 1);
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

function Round({ answer, onComplete, onNext }) {
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
        <MapContainer center={[30, 0]} zoom={1} minZoom={1}>
          <TileLayer
            attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
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
          {submitted ? <Marker position={answer} /> : null}
        </MapContainer>
      </div>
      {submitted ? (
        <>
          <div className="App-result">
            Nice try! Your guess was {Math.round(distance)} m off. You got{' '}
            {score} points for that one.
          </div>
          <button type="button" onClick={onNext}>
            Next
          </button>
        </>
      ) : (
        <button type="submit" disabled={guess == null || submitted}>
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
