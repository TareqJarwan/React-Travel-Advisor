import React, { useEffect, useState } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import { Map, Header, List } from './components';
import { getPlacesData, getWeatherData } from './api';


const App = () => {
    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');

    const [coordinates, setCoordinates] = useState({});
    const [bounds, setBounds] = useState({});

    const [places, setPlaces] = useState([]);
    const [filteredPlaced, setFilteredPlaces] = useState([]);
    const [weatherData, setWeatherData] = useState([]);

    const [autocomplete, setAutocomplete] = useState(null);
    const [childClicked, setChildClicked] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            setCoordinates({ lat: latitude, lng: longitude });
        });
    }, []);

    useEffect(() => {
        setFilteredPlaces(places?.filter((place) => place.rating > rating));
    }, [rating, places]);

    useEffect(() => {
        if (bounds.sw && bounds.ne) {
            setIsLoading(true);

            getWeatherData(coordinates.lat, coordinates.lng)
                .then((data) => {
                    setWeatherData(data);
                });

            getPlacesData(type, bounds.sw, bounds.ne)
                .then(data => {
                    setPlaces(data?.filter(place => place.name && place.num_reviews > 0));
                    setFilteredPlaces([]);
                    setRating('');
                    setIsLoading(false);
                });
        }
    }, [type, bounds, coordinates]);

    const onLoad = (autoC) => setAutocomplete(autoC);

    const onPlaceChanged = () => {
        const lat = autocomplete.getPlace().geometry.location.lat();
        const lng = autocomplete.getPlace().geometry.location.lng();

        setCoordinates({ lat, lng });
    };

    return (
        <>
            <CssBaseline />
            <Header onPlaceChanged={onPlaceChanged} onLoad={onLoad} />
            <Grid container spacing={3} style={{ width: '100%' }}>
                <Grid item xs={12} md={4} >
                    <List
                        places={filteredPlaced?.length ? filteredPlaced : places}
                        childClicked={childClicked}
                        isLoading={isLoading}
                        type={type}
                        setType={setType}
                        rating={rating}
                        setRating={setRating}
                    />
                </Grid>
                <Grid item xs={12} md={8} >
                    <Map
                        setCoordinates={setCoordinates}
                        setBounds={setBounds}
                        coordinates={coordinates}
                        places={filteredPlaced?.length ? filteredPlaced : places}
                        setChildClicked={setChildClicked}
                        weatherData={weatherData}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default App;
