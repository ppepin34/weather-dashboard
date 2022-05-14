const currentWeatherContainer = document.getElementById('weatherCurrent');
const forecastWeatherContainer = document.getElementById('weatherForecast');
const searchHistoryContainer = document.getElementById('searchHistory');
var searchHistory = [];

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
    var currentWeather = data.current;
    showCurrent(currentWeather, city);

    // get data for daily forecast, pass to show function
    var forecastArray = data.daily;
    showForecast(forecastArray);

    // pass city name to createCityBtn
    createCityBtn(city);

};

// function to get date

function forecastDate(dt) {

    // get date in readable format
    var unixTimestamp = dt;
    unixTimestamp = parseInt(unixTimestamp);
    var milliseconds = unixTimestamp * 1000;
    var dateObject = new Date(milliseconds);

    return (dateObject)
}
// show current weather
function showCurrent(currentWeather, city) {

    // Delete previous contents from container
    while(currentWeatherContainer.hasChildNodes()) {
        currentWeatherContainer.removeChild(currentWeatherContainer.firstChild)
    };

    // call forecastDate()
    let dateObject = forecastDate(currentWeather.dt);

    // create formatted date

    var month = dateObject.getMonth() + 1;
    var date = dateObject.getDate();
    var year = dateObject.getFullYear();

    // create header for current weather
    var header = document.createElement("h2");
    header.classList = "";
    header.textContent = city + " (" + month + "/" + date + "/" + year + ")";

    // create icon
    var icon = document.createElement('img');
    icon.src = "https://openweathermap.org/img/wn/" + currentWeather.weather[0].icon + "@2x.png";
    icon.alt = "Icon showing current weather";

    // create temp p
    var temp = document.createElement("p");
    temp.innerHTML = currentWeather.temp + "&#8457";

    // create wind p
    var wind = document.createElement('p');
    wind.textContent = currentWeather.wind_speed + " MPH";

    // create humidity p
    var humidity = document.createElement('p');
    humidity.textContent = currentWeather.humidity + "%";

    // create uvi p, may change element type to add background color
    var uvi = document.createElement('p');
    uvi.textContent = currentWeather.uvi;

    // define bg color for uvi
    if (currentWeather.uvi <=2 ) {
        console.log("green");
    } else if (currentWeather.uvi >2 || currentWeather.uvi <= 5) {
        console.log("yellow");
    } else if (currentWeather.uvi >5 || currentWeather.uvi <= 7){
        console.log("orange");
    } else {
        console.log('red');
    }

    // append all of the above to currentWeatherContainer
    currentWeatherContainer.appendChild(header);
    // currentWeatherContainer.appendChild(icon);
    currentWeatherContainer.appendChild(temp);
    currentWeatherContainer.appendChild(wind);
    currentWeatherContainer.appendChild(humidity);
    currentWeatherContainer.appendChild(uvi);
};

// create elements for weather forecast
function showForecast(forecastArray) {

    // Delete previous contents from container
    while(forecastWeatherContainer.hasChildNodes()) {
        forecastWeatherContainer.removeChild(forecastWeatherContainer.firstChild)
    };

    // Create header for Div
    let header = document.createElement("h2");

    header.textContent = "5-Day Forecast:";

    // loop through first 5 days of weather, skipping today
    for (i = 1; i <= 5; i++) {
        thisDay = forecastArray[i];

        // create card for forecast day
        let forecastCard = document.createElement("div");

        // get date for forecast
        let dateObject = forecastDate(thisDay.dt);

        // create formatted date parts

        var month = dateObject.getMonth() + 1;
        var date = dateObject.getDate();
        var year = dateObject.getFullYear();

        // create header
        let header = document.createElement("h3");
        header.textContent  ="(" + month + "/" + date + "/" + year + ")";

        // create icon
        let icon = document.createElement("img");
        icon.src = "https://openweathermap.org/img/wn/" + thisDay.weather[0].icon + ".png";
        icon.alt = "Icon showing forecasted weather";

        // create temp p
        var temp = document.createElement("p");
        temp.innerHTML = thisDay.temp.max + "&#8457";

        // create wind p
        var wind = document.createElement('p');
        wind.textContent = thisDay.wind_speed + " MPH";

        // create humidity p
        var humidity = document.createElement('p');
        humidity.textContent = thisDay.humidity + "%";

        // append all of the above to forecastCard
        forecastCard.appendChild(header);
        // forecastCard.appendChild(icon);
        forecastCard.appendChild(temp);
        forecastCard.appendChild(wind);
        forecastCard.appendChild(humidity);

        // append forecastCard to forecastWeatherContainer

        forecastWeatherContainer. appendChild(forecastCard);
    }
};

// create city search buttons
function createCityBtn(city) {
    let btn = document.createElement("button");

    // set button text to city
    btn.textContent = city;

    //set button classes
    btn.classList = ("search");

    // append to searchHistoryContainer
    searchHistoryContainer.appendChild(btn);

    // pass to save city
    saveCity(city);
}; 

// save city to array, push to localStorage
saveCity(city);

// search again on click
$(searchHistoryContainer).on("click", ".search", function () {
    let city = this.textContent

    search(city);
})

// event listener for initial search
$("#searchCity").submit(function (event) {

    // prevent refresh
    event.preventDefault();

    // get city from form
    var city = ($("#city").val());

    city = city.trim();

    search(city);

    ($("#city").val(""));
});