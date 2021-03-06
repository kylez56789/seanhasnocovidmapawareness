import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { formatRelative } from "date-fns";

import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 37.3382,
  lng: -121.8863,
};

export default function App() {
  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";
  getCovidDataFromApi();
  return (
  <div>
    <h1>
      💚💛🧡❤️
      <br></br>
      💉Sean's Map Awareness{" "}
        <span role="img" aria-label="syringe">
          💉
        </span>
      </h1>
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={8}
      center={center}
      options={options}
      onClick={(event) => {
        setMarkers((current) => [
          ...current,
          {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            time: new Date(),
          },
        ]);
      }}
    >
      {markers.map((marker) => (
        <Marker
        key={marker.time.toISOString()}
        position={{ lat: marker.lat, lng: marker.lng }}
        />
      ))}
      </GoogleMap>
  </div>
  );
}

var findObjectByLabel = function(obj, label) {
  if(obj.label === label) {return obj;}
  for (var i in obj) {
    if(obj.hasOwnProperty(i)){
      
    }
  }
  return null;
};

function getCovidDataFromApi() {
  fetch('https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.json')
    .then((response) => response.json())
    .then((responseJson) => {
    console.log(responseJson);
    for(var i in responseJson) {
      var country = responseJson[i];
      for (var j in country) {
        if (j === "data") {
          var data = country[j];
          if ("total_cases" in data[data.length-1]) {
            console.log("total cases: "+ data[data.length-1].total_cases);
          }
          if ("new_cases" in data[data.length-1]) {
            console.log("new cases today: " + data[data.length-1].new_cases)
          }
        }
      }
    }
  })
  .catch((error) =>{
    console.error(error);
  })
}



