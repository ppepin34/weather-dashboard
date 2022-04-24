// search by city
function search(city) {
    
    // get info for current weather
    var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=4f3ed641c61002cec807bbe3f860da8f";

    // get forecast info
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&cnt=5&appid=4f3ed641c61002cec807bbe3f860da8f";

    // submit data request for current weather
    fetch(currentWeatherURL).then(function (response){

        //request was successful
        if (response.ok) {
            response.json().then(function (data){

                // if data = null return error
                if (data.length === 0){
                    $("#currentWeathError").show();
                }
                // else send to card for current weather
                else {
                    // showCurrentWeather(data);
                    console.log(data);
                }
            })
        };
    });

    // submit data request for forecast
    fetch(forecastURL).then(function (response){

        //request was successful
        if (response.ok) {
            response.json().then(function (data){

                // if data = null return error
                if (data.length === 0){
                    $("#forecasttWeathError").show();
                }
                // else send to card for current weather
                else {
                    // showWeatherForecast(data);
                    console.log(data)
                }
            })
        };
    });
};

// function showCurrentWeather(data) {

// };

// function showWeatherForecast(data) {

// };

// search again on click

// event listener for initial search
$("#searchCity").submit(function(event) {
    
    // prevent refresh
    event.preventDefault();

    // get city from form
    var city = ($("#city").val());
    
    city = city.trim()
        .toLowerCase();

    search(city)
});