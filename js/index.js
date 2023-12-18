var apiKey = ('4176b9426a5c1a4c8aee6d15f20d71b4');

var fetchButton = document.getElementById("button-addon2");

var cityName = document.querySelector("#cityName");

var temp = document.querySelector("#temp");

var wind = document.querySelector("#wind");

var humidity = document.querySelector("#humidity");

var repoList = document.getElementById("repoList");

function start() {
  var searchedCity = document.getElementById("search-input").value;

  getData(searchedCity);
}

function getData(city) {
  current(city);
}
function forecast(city) {
  var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=4176b9426a5c1a4c8aee6d15f20d71b4`;  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      // handle the error here

      console.error(error);
    });
}
function current(city) {
  var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=4176b9426a5c1a4c8aee6d15f20d71b4`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {
      console.log(data);

      // call the display function here with the data parameter

      displayWeather(data);
    })

    .catch(function (error) {
      // handle the error here

      console.error(error);
    });
}
function displayWeather(data) {

  if (data && data.cod == 200) {
//inputs of weather data
    cityName.innerHTML = data.name;

    temp.innerHTML = data.main.temp + " °F";

    wind.innerHTML = data.wind.speed + " mph";

    humidity.innerHTML = data.main.humidity + " %";
  } else {
    //err

    cityName.innerHTML = "Sorry, something went wrong.";

    temp.innerHTML = "";

    wind.innerHTML = "";

    humidity.innerHTML = "";
  }
}

fetchButton.addEventListener("click", start);
