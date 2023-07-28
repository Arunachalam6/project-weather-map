import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import {
  Container,
  FormControl,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { Image } from "react-bootstrap";
import imgBackground from "./images/weatherBackground1.jpg";

function App() {
  const [data, setData] = useState({
    country: "",
    city: "",
  });
  const [cityList, setCityList] = useState([]);
  const countryUrl = "https://countriesnow.space/api/v0.1/countries"; //country api link
  const [countryList, setCountryList] = useState();
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = "33b2b6896de222a6d9c2aa4f568d3057"; //Actual API key

  useEffect(() => {
    axios.get(countryUrl).then((response) => {
      setCountryList(response.data.data);
    });
  }, []);

  useEffect(() => {
    countryList?.map((cList) => {
      if (cList.country === data.country) {
        setCityList(cList.cities);
      }
    });
  }, [data.country]);

  useEffect(() => {
    // Function to fetch weather data using axios for the selected city
    const fetchWeatherData = async () => {
      try {
        if (data.city && data.country) {
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${data.city},${data.country}&appid=${apiKey}`;
          const response = await axios.get(url);
          setWeatherData(response.data);
        } else {
          setWeatherData(null);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, [apiKey, data.city, data.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="app">
      <Container maxWidth="xl">
        <Image src={imgBackground} className="backImg" fluid />
        <Typography
          variant="h2"
          align="center"
          className="heading"
          gutterBottom
        >
          Weather Tracker
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <FormControl
              variant="outlined"
              sx={{ minWidth: 200, maxWidth: "100%" }}
            >
              <select
                value={data.country}
                className="select"
                name="country"
                onChange={handleChange}
              >
                {countryList?.map((countryData) => (
                  <option
                    key={countryData.iso3}
                    value={countryData.country}
                    className="countryOption"
                  >
                    {countryData.country}
                  </option>
                ))}
              </select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl
              variant="outlined"
              sx={{ minWidth: 200, maxWidth: "100%" }}
            >
              <select
                value={data.city}
                className="select"
                name="city"
                onChange={handleChange}
              >
                {cityList?.map((cityData) => (
                  <option
                    key={cityData}
                    value={cityData}
                    className="countryOption"
                  >
                    {cityData}
                  </option>
                ))}
              </select>
            </FormControl>
          </Grid>
        </Grid>

        {weatherData && (
          <>
            <Container sx={{ mt: 4, textAlign: "center" }} className="top">
              <CardContent>
                <Typography variant="h2" className="weatherName">
                  {weatherData.name}
                </Typography>
                <div className="weatherCondition">
                  <Typography variant="h3" className="conditionTitle">
                    Weather Condition
                  </Typography>
                  <Typography variant="h4" className="conditionDescription">
                    {weatherData.weather[0].description}
                  </Typography>
                </div>
              </CardContent>
            </Container>

            <Grid container justifyContent="center" className="cardContainer">
              <Grid item xs={12} sm={8}>
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} sm={4}>
                    <Card className="card">
                      <CardContent>
                        <Typography
                          variant="h5"
                          gutterBottom
                          className="cardTitle"
                        >
                          Feels Like
                        </Typography>
                        <Typography variant="h6" className="bold">
                          {(weatherData.main.temp - 273.15).toFixed(1)}°C
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card className="card">
                      <CardContent>
                        <Typography
                          variant="h5"
                          gutterBottom
                          className="cardTitle"
                        >
                          Humidity
                        </Typography>
                        <Typography variant="h6" className="bold">
                          {weatherData.main.humidity}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card className="card">
                      <CardContent>
                        <Typography
                          variant="h5"
                          gutterBottom
                          className="cardTitle"
                        >
                          Wind Speed
                        </Typography>
                        <Typography variant="h6" className="bold">
                          {weatherData.wind.speed.toFixed()} MPH
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </div>
  );
}

export default App;
