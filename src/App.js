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
  const [selected, setSelected] = React.useState([null]);

  const onMapClick = React.useCallback(() => {}, [])

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";
  //getCovidDataFromApi();
  return (
  <div>
    <h1>
      <span role="img" aria-label="covidSpectrum">
      💚💛🧡❤️
      </span>
      <br></br>
      💉Sean's Map Awareness{" "}
        <span role="img" aria-label="syringe">
          💉
      </span>
      <br></br>
      hello
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
            latstr: toString(event.latLng.lat()),
            lngstr: toString(event.latLng.lng()),
            time: new Date(),
          },
        ]);
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + event.latLng.lat() + ',' + event.latLng.lng() + '&key=';
        var fetchString = url.concat("AIzaSyAcmYsQk-QqKTSYF-f35iajaXAkdKp6QhM");
        fetch(fetchString)
        .then(response => response.json())
        .then(geoData => {
          for(var i in geoData) {
            if (!(i === "results")) continue;
            else {
              var results = geoData[i];
              for (var j = 0; j < results.length-1; j++) {
                if (results[j].types[0] === "country") {
                  var country = results[j].formatted_address;
                  console.log(country);
                  getCovidDataFromApi(country);
                }
              }
            }
          }
        })
        }
      }
    >
    {markers.map((marker) => (
      <Marker
        key={`${marker.lat}-${marker.lng}`}
        position={{ lat: marker.lat, lng: marker.lng }}
        onClick={() => {
          setSelected(marker);
        }}
        icon={{
          url: 'bear.svg',
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(15, 15),
          scaledSize: new window.google.maps.Size(30, 30),
        }}
      />
    ))}
      </GoogleMap>
  </div>
  );
  
  // test code : one mark at a time
/*
var marker;
function placeMarker(location){
  if(marker){
    marker.setPosition(location);
  }else{
    marker = new google.maps.Marker({
      position: location,
      map: map
    });
  }
}*/

}

var findObjectByLabel = function(obj, label) {
  if(obj.label === label) {return obj;}
  for (var i in obj) {
    if(obj.hasOwnProperty(i)){
      
    }
  }
  return null;
};

function getCovidDataFromApi(country) {
  fetch('https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.json')
    .then((response) => response.json())
    .then((responseJson) => {
    console.log(responseJson);
    for(var i in responseJson) {
      var countree = responseJson[i];
      if (countree.location === country) {
        for (var j in countree) {
          if (j === "data") {
            var data = countree[j];
            if ("total_cases" in data[data.length-1]) {
              console.log("total cases: "+ data[data.length-1].total_cases);
            }
            if ("new_cases" in data[data.length-1]) {
              console.log("new cases today: " + data[data.length-1].new_cases)
            }
          }
        }
      }
      else continue;
    }
  })
  .catch((error) =>{
    console.error(error);
  })
}

/*{selected ? (
  <InfoWindow
    position = {{ lat: selected.lat, lng: selected.lng}}
    onCLoseClick={() => {
      setSelected(null);
    }}
    >
      <div>
        <h2>Ur mum's a hoe</h2>
      </div>
    </InfoWindow>
    ) : null}*/
