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

  useEffect(() => {
    fetch('/photos.json')
      .then((res) => res.json())
      .then(setPhotos);
  }, []);

  return (
    <div className="App">
      {photos ? <Game photos={photos} /> : <span>Loading...</span>}
    </div>
  );
}

function Game({ photos }) {
  const [score, setScore] = useState(0);
  const [currentRoundNum, setCurrentRoundNum] = useState(0);
  const currentPhoto = photos?.[currentRoundNum];
  const answer = currentPhoto
    ? [currentPhoto.lat, currentPhoto.lon]
    : undefined;

  return (
    <div className="Game">
      <Photo
        filename={currentPhoto.filename}
        preloadFilename={photos?.[currentRoundNum + 1]?.filename}
      />
      <div className="Game-side">
        <div className="Game-status">
          <div className="Game-score">{score} points</div>
          <div className="Game-round">
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
    </div>
  );
}

// FIXME: sometimes preloading starts while main image is still loading,
// because `mainLoading` is never set to true again
function Photo({ filename, preloadFilename = undefined }) {
  const [mainLoading, setMainLoading] = useState(true);

  // The key props are useful because React will swap the old image out and
  // replace it with the preloaded one, without making another request
  return (
    <div className="Photo">
      <img
        key={filename}
        src={'photos/' + filename}
        alt="A mystery"
        onLoad={() => {
          setMainLoading(false);
        }}
      />
      {preloadFilename && !mainLoading ? (
        <img
          key={preloadFilename}
          className="preload"
          src={'photos/' + preloadFilename}
          alt="A mystery"
        />
      ) : null}
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
                pathOptions={{
                  dashArray: '8 12',
                  dashOffset: '8',
                  color: '#2a212c',
                }}
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
