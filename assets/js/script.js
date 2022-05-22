const currentWeatherContainer = document.getElementById('weatherCurrent');
const forecastWeatherContainer = document.getElementById('forecast-container');
const searchHistoryContainer = document.getElementById('searchHistory');
var searchHistory = [];

// search for city coordinates
function search(city) {
    // find lat and lon for city entered, gets first city to match the name
    var apiURL = "https://api.positionstack.com/v1/forward?access_key=c5fec3abe23506a05da7891d1026cb65&query=" + city;

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

    // push city to array
    searchHistory.push(city);

    // pass to save city
    saveCity(city);
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
    while (currentWeatherContainer.hasChildNodes()) {
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
    header.innerHTML = city + " (" + month + "/" + date + "/" + year + ")";

    // create icon
    var icon = document.createElement('img');
    icon.classList = "img-fluid height-auto icon"
    icon.src = "https://openweathermap.org/img/wn/" + currentWeather.weather[0].icon + ".png";
    icon.alt = "Icon showing current weather";

    // create temp p
    var temp = document.createElement("p");
    temp.innerHTML = "Temp: " + currentWeather.temp + "&#8457";

    // create wind p
    var wind = document.createElement('p');
    wind.innerHTML = "Wind: " + currentWeather.wind_speed + " MPH";

    // create humidity p
    var humidity = document.createElement('p');
    humidity.innerHTML = "Humidity: " + currentWeather.humidity + "%";

    // create uvi p, may change element type to add background color
    var uvi = document.createElement('p');
    var uviSpan = document.createElement('span');
    uviSpan.innerHTML = currentWeather.uvi;
    uvi.innerHTML = "UV Index: ";


    // define bg color for uvi
    if (currentWeather.uvi <= 2) {
        uviSpan.classList = "badge bg-success text-white";
    } else if (currentWeather.uvi > 2 || currentWeather.uvi <= 5) {
        uvi.classList = "badge bg-warning";
    } else if (currentWeather.uvi > 5 || currentWeather.uvi <= 7) {
        uvi.classList = "badge bg-orange";
    } else {
        uvi.classList = "badge bg-danger";
    }

    // append all of the above to currentWeatherContainer
    currentWeatherContainer.appendChild(header);
    currentWeatherContainer.appendChild(icon);
    currentWeatherContainer.appendChild(temp);
    currentWeatherContainer.appendChild(wind);
    currentWeatherContainer.appendChild(humidity);
    currentWeatherContainer.appendChild(uvi);
    uvi.appendChild(uviSpan)

    // uvi.innerHTML = "UV Index: " + uviSpan;
};

// create elements for weather forecast
function showForecast(forecastArray) {

    // Delete previous contents from container
    while (forecastWeatherContainer.hasChildNodes()) {
        forecastWeatherContainer.removeChild(forecastWeatherContainer.firstChild)
    };

    // loop through first 5 days of weather, skipping today
    for (i = 1; i <= 5; i++) {
        thisDay = forecastArray[i];

        // create card for forecast day
        let forecastCard = document.createElement("div");
        forecastCard.classList = "card col-12 col-md-2";

        // get date for forecast
        let dateObject = forecastDate(thisDay.dt);

        // create formatted date parts

        var month = dateObject.getMonth() + 1;
        var date = dateObject.getDate();
        var year = dateObject.getFullYear();

        // create header
        let header = document.createElement("h3");
        header.style = ('width: 5rem');
        header.innerHTML = "(" + month + "/" + date + "/" + year + ")";

        // create icon
        let icon = document.createElement("img");
        icon.classList = ".img-fluid "
        icon.src = "https://openweathermap.org/img/wn/" + thisDay.weather[0].icon + ".png";
        icon.alt = "Icon showing forecasted weather";

        // create temp p
        var temp = document.createElement("p");
        temp.innerHTML = "Temp: " + thisDay.temp.max + "&#8457";

        // create wind p
        var wind = document.createElement('p');
        wind.innerHTML = "Wind: " + thisDay.wind_speed + " MPH";

        // create humidity p
        var humidity = document.createElement('p');
        humidity.innerHTML = "Humidity: " + thisDay.humidity + "%";

        // append all of the above to forecastCard
        forecastCard.appendChild(header);
        forecastCard.appendChild(icon);
        forecastCard.appendChild(temp);
        forecastCard.appendChild(wind);
        forecastCard.appendChild(humidity);

        // append forecastCard to forecastWeatherContainer

        forecastWeatherContainer.appendChild(forecastCard);
    }
};

// create city search buttons
function createCityBtn(city) {
    let btn = document.createElement("button");

    // set button text to city
    btn.textContent = city;

    //set button classes
    btn.classList = ("search btn btn-secondary mb-1 me-1");

    // append to searchHistoryContainer
    searchHistoryContainer.appendChild(btn);
};

// save city to array, push to localStorage
function saveCity(city) {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
};

// load cities on start
function loadCities() {

    // check for previous searches, if null, set to blank array
    let citiesPresent = localStorage.getItem("searchHistory");
    searchHistory = JSON.parse(citiesPresent ?? '[]');

    // if nothing present, end function
    if (!searchHistory) {
        return;
    };

    // loop over each and create new buttons
    for (let i = 0; i < searchHistory.length; i++) {
        createCityBtn(searchHistory[i]);
    };
};


// search again on click
$(searchHistoryContainer).on("click", ".search", function () {
    let city = this.textContent

    search(city);
});

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

loadCities();
