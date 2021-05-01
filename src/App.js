import React, { useEffect, useState } from 'react';
import { Marker } from 'react-leaflet';
import './App.css';
import { ClickHandler, DistanceMeasurer, Map } from './components/Map';

function App() {
  const [photos, setPhotos] = useState(null);
  const [score, setScore] = useState(0);
  const [currentRoundNum, setCurrentRoundNum] = useState(0);
  const currentPhoto = photos?.[currentRoundNum];
  const answer = currentPhoto ? [currentPhoto.lat, currentPhoto.lon] : undefined;

  useEffect(() => {
    fetch('/photos.json')
      .then((res) => res.json())
      .then(setPhotos);
  }, []);

  return (
    <div className="App">
      {photos ? (
        <>
          <div className="App-status">
            <div className="App-score">{score} points</div>
            <div className="App-round">
              Round {currentRoundNum + 1} of {photos.length}
            </div>
          </div>
          <Round filename={currentPhoto.filename} />
          <MapPicker
            key={currentRoundNum}
            answer={answer}
            onSubmit={(distance) => {
              const s = 5000.3 / 2 ** (distance / 10 ** 6); // magic score formula
              const roundScore = Math.floor(Math.min(s, 5000));
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

function Round({ filename }) {
  // const [guess, setGuess] = useState(null);
  // const [submitted, setSubmitted] = useState(false);
  // const [score, setScore] = useState(0);

  // const answer = [photo.lat, photo.lon];

  // let distanceWithUnit;
  // if (distance > 1000) {
  //   distanceWithUnit = Math.round(distance / 1000) + ' km';
  // } else {
  //   distanceWithUnit = Math.round(distance) + ' m';
  // }

  // useEffect(() => {
  //   const s = 5000.3 / 2 ** (distance / 10 ** 6);
  //   setScore(Math.floor(Math.min(s, 5000)));
  // }, [distance, setScore]);

  return <img className="Round-photo" src={'photos/' + filename} />;
}

function MapPicker({ answer, onSubmit, onNext }) {
  const [guess, setGuess] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [distance, setDistance] = useState(null);

  return (
    <form
      className="Round"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        onSubmit(distance);
      }}
    >
      <div className="Round-map">
        <Map>
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
        </Map>
      </div>
      {submitted ? (
        // <>
        // <div className="App-result">
        //   Nice try! Your guess was {distanceWithUnit} off. You got {score}{' '}
        //   points for that one.
        // </div>
        <button type="button" onClick={onNext}>
          Next
        </button>
      ) : (
        // </>
        <button type="submit" disabled={guess == null}>
          Guess
        </button>
      )}
    </form>
  );
}

export default App;
