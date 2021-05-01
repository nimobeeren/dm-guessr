import React, { useEffect, useState } from 'react';
import { Polyline } from 'react-leaflet';
import {
  AnswerMarker,
  ClickHandler,
  DistanceMeasurer,
  FitBounds,
  GuessMarker,
  Map,
} from './components/Map';

function App() {
  const [photos, setPhotos] = useState(null);
  const [score, setScore] = useState(0);
  const [currentRoundNum, setCurrentRoundNum] = useState(0);
  const currentPhoto = photos?.[currentRoundNum];
  const answer = currentPhoto
    ? [currentPhoto.lat, currentPhoto.lon]
    : undefined;

  useEffect(() => {
    fetch('/photos.json')
      .then((res) => res.json())
      .then(setPhotos);
  }, []);

  return (
    <div className="App">
      {photos ? (
        <>
          <Photo filename={currentPhoto.filename} />
          <div className="App-side">
            <div className="App-status">
              <div className="App-score">{score} points</div>
              <div className="App-round">
                Round {currentRoundNum + 1} of {photos.length}
              </div>
            </div>
            <MapPicker
              key={currentRoundNum}
              answer={answer}
              onSubmit={(score) => {
                setScore((prev) => prev + score);
              }}
              onNext={() => {
                if (currentRoundNum < photos.length - 1) {
                  setCurrentRoundNum((prev) => prev + 1);
                } else {
                  alert('This is the eeeeeend');
                }
              }}
            />
          </div>
        </>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
}

function Photo({ filename }) {
  return (
    <div className="Photo">
      <img alt="A mystery" src={'photos/' + filename} />
    </div>
  );
}

function MapPicker({ answer, onSubmit, onNext }) {
  const [guess, setGuess] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [distance, setDistance] = useState(null);

  const score = Math.floor(Math.min(5000.3 / 2 ** (distance / 10 ** 6), 5000)); // magic score formula

  let distanceWithUnit;
  if (distance > 1000) {
    distanceWithUnit = Math.round(distance / 1000) + ' km';
  } else {
    distanceWithUnit = Math.round(distance) + ' m';
  }

  return (
    <form
      className="MapPicker"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        onSubmit(score);
      }}
    >
      <div className="MapPicker-map">
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
          {guess ? <GuessMarker position={guess} /> : null}
          {submitted ? (
            <>
              <AnswerMarker position={answer} />
              <FitBounds bounds={[guess, answer]} />
              <Polyline
                positions={[guess, answer]}
                pathOptions={{ dashArray: '8 12', dashOffset: '8', color: '#2a212c' }}
              />
            </>
          ) : null}
        </Map>
      </div>
      {submitted ? (
        <>
          <div className="MapPicker-message">
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

export default App;
