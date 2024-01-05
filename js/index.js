var apiKey = ('7259367421b1f650c451844ab4fdf4fc');
//Local storage check for searches that have already been made.
if(localStorage.getItem('searchHistory') === null) {
  var searchHistory = [];
} else {
  var searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
}

//use "current location" of the device. May require a server side invite pop-up.
// getLocation();
//Establish Search history if present.
setSearchHistory(searchHistory);

//Create a trigger for the action
document.querySelector('#searchBox').addEventListener('submit', function(event) {
    event.preventDefault();
    removeErrorMsg();
    //Require an input. 
    //Geocode the city and store.
    if (document.querySelector('#city').value !== '') {      
      getGeocoding(document.querySelector('#city').value);
      searchHistory.splice(0,0,document.querySelector('#city').value);

//Array displays with new city from local storage
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
      setSearchHistory(searchHistory);  
    } else {
      var errorMsg = document.createElement('p');
      errorMsg.textContent = "You Must Input A City.";
      errorMsg.setAttribute('id', 'error-msg');
      document.querySelector('#search-btn').parentNode.insertBefore(errorMsg, document.querySelector('#search-btn').nextSibling);
    }    
});
//Geocoding lat and long of the city entered
function getGeocoding(city) {
    //Input api url and attach the key
    var requestUrl = encodeURI('https://api.openweathermap.org/geo/1.0/direct?q='+city+'&limit=1&appid=7259367421b1f650c451844ab4fdf4fc');
    //Fetch request for the data
    fetch(requestUrl)
      .then(function (response) {              
        return response.json();
      })
      .then(function (data) {        
        removeErrorMsg();
        //If API has no data to provide, throw error.
        //Otherwise fetch the weather
        if(data.length !== 0) {
            getWeather(data[0].lat, data[0].lon);
            } else {
            var errorMsg = document.createElement('p');
            errorMsg.textContent = "Unable to detect location";
            errorMsg.setAttribute('id', 'error-msg');
            document.querySelector('#search-btn').parentNode.insertBefore(errorMsg, document.querySelector('#search-btn').nextSibling);
        }
      });
}
//Use lat and long to function data for the weather for desired city.
async function getWeather(lat, lon) {
    //forecast API URL
    var reqWeather = encodeURI('https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat='+lat+'&lon='+lon+'&appid='+apiKey);
    //Current location weather URL
    var requestUrlCurr = encodeURI('https://api.openweathermap.org/data/2.5/weather?units=imperial&lat='+lat+'&lon='+lon+'&appid='+apiKey);

    //Start at today plus one day.
    var nextDate = dayjs().hour(12).minute(0).second(0).add(1, 'day');
    //Get current weather for the location
    var response = await fetch(requestUrlCurr)
      // .then(function (response) {
      //   return response.json();
      // })
      var data = await response.json(); 
        //Wipe current icon
        if(document.querySelector('#curr-weather-icon') !== null) {
            document.querySelector('#curr-weather-icon').remove();
        }
        //Get a new icon element and attach
        var weatherIcon = document.createElement('img');
        weatherIcon.setAttribute('src', "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");        
        weatherIcon.setAttribute('id', "curr-weather-icon");
        document.querySelector('#selected-city').after(weatherIcon);
        //adjust current api information
        document.querySelector('#selected-city').textContent = data.name + ' ('+ dayjs.unix(data.dt).format('M/D/YYYY') +')';        
        document.querySelector('#current-temp').textContent = data.main.temp;
        document.querySelector('#current-wind').textContent = data.wind.speed;
        document.querySelector('#current-humidity').textContent = data.main.humidity;
    //Get requested weather data
    await getForecast(reqWeather, nextDate)
      }
    

async function getForecast(reqWeather, nextDate) {
  var response = await fetch(reqWeather)
  var data = await response.json(); 
  //details of what form of data, in terms of time windows of 3 hour increments to use. 
  //Variable element ID to place data
  var forecastDay = 1;
  var forecastList = data.list.filter((value) => value.dt_txt.split(" ")[1] === "15:00:00")  
  // var timeCheck = value.dt_txt.split(" ")[1]
  console.log(forecastList)
  forecastList.forEach(function(value, key) {
    // if (nextDate.format('YYYY-MM-DD HH:mm:ss') === dayjs.unix(value.dt).format('YYYY-MM-DD HH:mm:ss') || (forecastDay === 5 && key === 39 ) ) {

        if(document.querySelector('#day-'+forecastDay+'-weather-icon') !== null) {
          document.querySelector('#day-'+forecastDay+'-weather-icon').remove();
        }
        //Get new weather icon and attach
        var weatherIcon = document.createElement('img');
        weatherIcon.setAttribute('src', "https://openweathermap.org/img/w/" + value.weather[0].icon + ".png");        
        weatherIcon.setAttribute('id', "day-"+forecastDay+"-weather-icon");    
        document.querySelector('#day-'+forecastDay+'-date').after(weatherIcon);
        //Refresh weather data
        document.querySelector('#day-'+forecastDay+'-date').textContent = nextDate.format('M/D/YYYY');
        document.querySelector('#day-'+forecastDay+'-temp').textContent = value.main.temp_max;
        document.querySelector('#day-'+forecastDay+'-wind').textContent = value.wind.speed;
        document.querySelector('#day-'+forecastDay+'-humidity').textContent = value.main.humidity;
        //increment to the next day.
        nextDate = nextDate.add(1,'day');
        //forecast id
        forecastDay++;
      // }
    });
  };

//Snag current location for weather data.
function getLocation() {
  console.log(navigator.geolocation)
  navigator.geolocation.getCurrentPosition(showPosition);
}
//Parse current place to lat and long.
function showPosition(position) {
  getWeather(position.coords.latitude, position.coords.longitude)
}
//This will set the search history 
function setSearchHistory(searchHis) {
  document.querySelector('#priorSearch').textContent = '';
  searchHis.forEach(function(value) {
    var searchBtn = document.createElement('button');
    searchBtn.textContent = value;
    searchBtn.setAttribute('class','my-2 btn btn-secondary');
    searchBtn.addEventListener('click',function(event) {
      event.preventDefault();
      getGeocoding(searchBtn.textContent);
    });
    document.querySelector('#priorSearch').appendChild(searchBtn);
  });
}
//clean errors
function removeErrorMsg() {
  if(document.querySelector('#error-msg') !== null) {
    document.querySelector('#error-msg').remove();
  }
}