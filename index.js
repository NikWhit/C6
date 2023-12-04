var apiKey = '4176b9426a5c1a4c8aee6d15f20d71b4';
var repoList = document.getElementById("repoList")
//like the weather app on an iphone, checking to see if there are regular places to check weather
if(localStorage.getItem('searchHistory') === null) {
    var searchHistory = [];
  } else {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
  }
//local weather
// getLocation();
setSearchHistory(searchHistory)

document.querySelector('#searchBox').addEventListener('submit', function(event) {
    event.preventDefault();

    if (document.querySelector('#city').value !== '') {
      getGeocoding(document.querySelector('#city').value); 
      searchHistory.splice(0,0,document.querySelector('#city').value);
    
      if(searchHistory.length > 4) {
        searchHistory.pop();
      }
//local storage
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory)),
      setSearchHistory(searchHistory);
    }else {
    var errorMsg = document.createElement('p');
    errorMsg.textContent = "Please Enter a City.";
    errorMsg.setAttribute('id', 'error-msg');
    document.querySelector('#search-btn').parentNode.insertBefore(errorMsg, document.querySelector('#search-btn').nextSibling)
}
});

function getLatLog(lat, lon) {
  var searchedCity = document.getElementById("search-input").value;
  console.log(searchedCity)
    var requestUrl = encodeURI('http://api.openweathermap.org/geo/1.0/direct?q='+city+'&limit=1&appid=4176b9426a5c1a4c8aee6d15f20d71b4');
fetch(requestUrl)
.then(function (response) {               
    return response.json();
})
.then(function (data) {        
    var requestUrl = 'http://api.openweathermap.org/geo/21.0/direct?lat='+lat+'&lon='+lon+'&appid=4176b9426a5c1a4c8aee6d15f20d71b4'
  //Warn if a bad location or get the weather data
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var requestUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&appid=4176b9426a5c1a4c8aee6d15f20d71b4';
      fetch(requestUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          for (var i = 0; i< data.length; i++) {
            var listItem = document.createElement('li');
            listItem.textContent = data[i].dt;
            repoList.appendChild(listItem)
          }
        });
    });

    if(data.length !== 0) {
    getWeather(data[0].lat, data[0].lon);
    } else {
    var errorMsg = document.createElement('p');
    errorMsg.textContent = "Where is that? Please Try again";
    }
    errorMsg.setAttribute('id', 'error-msg');
            document.querySelector('#search-btn').parentNode.insertBefore(errorMsg, document.querySelector('#search-btn').nextSibling);
        })};
      

function getWeather() {
    var requestUrlForecast = encodeURI('http://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&appid=4176b9426a5c1a4c8aee6d15f20d71b4');
            //Current weather URL
    var requestUrlCurr = encodeURI('http://api.openweathermap.org/data/2.5/weather?units=imperial&lat='+lat+'&lon='+lon+'&appid=4176b9426a5c1a4c8aee6d15f20d71b4');
            
    var forecastDay = 1;
//regular updated weather
    var nextDate = dayjs().hour(12).minute(0).second(0).add(1, 'day');
        fetch(requestUrlCurr)
        .then(function (response) {
            return response.json();
    })
        .then(function (data) {
        if(document.querySelector('#curr-weather-icon') !== null) {
        document.querySelector('#curr-weather-icon').remove();
    }
    var weatherIcon = document.createElement('img');
    weatherIcon.setAttribute('src', "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");        
    weatherIcon.setAttribute('id', "curr-weather-icon");
    document.querySelector('#selected-city').after(weatherIcon);
                //Update with api info.
    document.querySelector('#selected-city').textContent = data.name + ' ('+ dayjs.unix(data.dt).format('M/D/YYYY') +')';        
    document.querySelector('#current-temp').textContent = data.main.temp;
    document.querySelector('#current-wind').textContent = data.wind.speed;
    document.querySelector('#current-humidity').textContent = data.main.humidity;
    });
    } fetch(requestUrlForecast)
      .then(function (response) {
        return response.json();
        })
        .then(function (data) {
    data.list.forEach(function(value, key) {
    if (nextDate.format('YYYY-MM-DD HH:mm:ss') === dayjs.unix(value.dt).format('YYYY-MM-DD HH:mm:ss') || (forecastDay === 5 && key === 39 ) ) {
        if(document.querySelector('#day-'+forecastDay+'-weather-icon') !== null) {
        document.querySelector('#day-'+forecastDay+'-weather-icon').remove();
        }
      //Weather elements
        var weatherIcon = document.createElement('img');
        weatherIcon.setAttribute('src', "https://openweathermap.org/img/w/" + value.weather[0].icon + ".png");        
        weatherIcon.setAttribute('id', "day-"+forecastDay+"-weather-icon");            
        document.querySelector('#day-'+forecastDay+'-date').after(weatherIcon);
      //Update weather stuff from api
        document.querySelector('#day-'+forecastDay+'-date').textContent = nextDate.format('M/D/YYYY');
        document.querySelector('#day-'+forecastDay+'-temp').textContent = value.main.temp_max;
        document.querySelector('#day-'+forecastDay+'-wind').textContent = value.wind.speed;
        document.querySelector('#day-'+forecastDay+'-humidity').textContent = value.main.humidity;
      //next day.
        nextDate = nextDate.add(1,'day');
      //increment the forecast day for the ID.
        forecastDay++;
    }
    });
});

//Function to get the current location of the user for default weather data.
function getLocation() {
navigator.geolocation.getCurrentPosition(showPosition);
}
//Function to parse and send the latitude and longitude for the current location
function showPosition(position) {
getWeather(position.coords.latitude, position.coords.longitude)
}
//Function to set the search history section.
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

function removeErrorMsg() {
//If an error message was previously displayed, remove it
if(document.querySelector('#error-msg') !== null) {
document.querySelector('#error-msg').remove();
} 
}