var currentWeatherContainer = document.getElementById('weatherCurrent');
var forecastWeatherContainer = document.getElementById('weatherForecast');

// search for city coordinates
function search(city) {
    // find lat and lon for city entered, gets first city to match the name
    var apiURL = "http://api.positionstack.com/v1/forward?access_key=c5fec3abe23506a05da7891d1026cb65&query=" + city;

    // data request
    fetch(apiURL).then(function (response) {

        // if query is successful
        if (response.ok) {
            response.json().then(function (data) {
                // if data = null, return error
                if (data.length === 0) {
                    // show error
                } 
                // else get lat and lon
                else {
                    var lat = data.data[0].latitude;
                    var lon = data.data[0].longitude;
                    
                    // pass lat and lon to weather function
                    getWeather(lat, lon, city);
                };
            })
        };
    })
};

// function to get weather data
function getWeather(lat, lon, city) {
    // get info for current weather
    var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=4f3ed641c61002cec807bbe3f860da8f";

    // submit data request for current weather
    fetch(weatherURL).then(function (response) {

        //request was successful
        if (response.ok) {
            response.json().then(function (data) {

                // if data = null return error
                if (data.length === 0) {
                    $("#currentWeathError").show();
                }
                // else send to showWeather and generate html for weather
                else {
                    splitWeather(data, city);
                }
            })
        };
    });
}

// function to split weather data between current and forecast
function splitWeather(data, city) {

    // get data for current weather, pass to show function
    var currentWeather = data.current
    showCurrent(currentWeather, city);

    // get data for daily forecast, pass to show function
    var forecastArray = data.daily
    // showForecast(forecastArray);
};

// show current weather
function showCurrent(currentWeather, city) {

    // get date in readable format
    var unixTimestamp = currentWeather.dt;
    unixTimestamp = parseInt(unixTimestamp);
    var milliseconds = unixTimestamp * 1000;
    var dateObject = new Date(milliseconds);

    console.log(dateObject);

    var month = dateObject.getMonth() + 1;
    var date = dateObject.getDate();
    var year = dateObject.getFullYear();

    console.log("month: " + month);
    console.log("day: " + date);
    console.log("year: " + year);

    // create header for current weather
    var header = document.createElement("h2");
    header.classList = "";
    header.textContent = city + " (" + month + "/" + date + "/" + year + ")"

    // create icon
    var icon = document.createElement('i');
    icon.src = "https://openweathermap.org/img/wn/" + currentWeather.weather[0].icon + ".png";

    // create temp p
    var temp = document.createElement("p");
    temp.innerHTML = currentWeather.temp + "&#8457"

    // create wind p
    var wind = document.createElement('p');
    wind.textContent = currentWeather.wind_speed + " MPH";

    // create humidity p
    var humidity = document.createElement('p');
    humidity.textContent = currentWeather.humidity + "%";

    // create uvi p, may change element type to add background color
    var uvi = document.createElement('p');
    uvi.textContent = currentWeather.uvi;

    // append all of the above to currentWeatherContainer
    currentWeatherContainer.appendChild(header);
    currentWeatherContainer.appendChild(icon);
    currentWeatherContainer.appendChild(temp);
    currentWeatherContainer.appendChild(wind);
    currentWeatherContainer.appendChild(humidity);
    currentWeatherContainer.appendChild(uvi);
}
// search again on click

// event listener for initial search
$("#searchCity").submit(function (event) {

    // prevent refresh
    event.preventDefault();

    // get city from form
    var city = ($("#city").val());

    city = city.trim();

    search(city)
});