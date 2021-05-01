import L from 'leaflet';
import React, { useEffect } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvent,
} from 'react-leaflet';

export function Map({ children }) {
  return (
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
      {children}
    </MapContainer>
  );
}

const guessIcon = L.icon({
  iconUrl: 'images/flag.svg',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});
export function GuessMarker(props) {
  return <Marker icon={guessIcon} {...props} />;
}

const answerIcon = L.icon({
  iconUrl: 'images/camera.svg',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});
export function AnswerMarker(props) {
  return <Marker icon={answerIcon} {...props} />;
}

export function ClickHandler({ onClick }) {
  useMapEvent('click', onClick);
  return null;
}

export function DistanceMeasurer({ guess, answer, onChange }) {
  const map = useMap();

  useEffect(() => {
    if (guess && answer) {
      const dist = map.distance(guess, answer);
      onChange(dist);
    }
  }, [guess, answer, map, onChange]);

  return null;
}
