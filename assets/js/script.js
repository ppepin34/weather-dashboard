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
                    getWeather(lat, lon);
                };
            })
        };
    })
};

// function to get weather data
function getWeather(lat, lon) {
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
                    showWeather(data);
                }
            })
        };
    });
}

// function to show weather data
function showWeather(data) {
    console.log(data);

    // get data for current weather
    console.log(data.current);

    //get data for daily forecast
    console.log(data.daily);
}
// search again on click

// event listener for initial search
$("#searchCity").submit(function (event) {

    // prevent refresh
    event.preventDefault();

    // get city from form
    var city = ($("#city").val());

    city = city.trim()
        .toLowerCase();

    search(city)
});