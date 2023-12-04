var apiKey = '7259367421b1f650c451844ab4fdf4fc';
//like the weather app on an iphone, checking to see if there are regular places to check weather
if(localStorage.getItem('searchHistory') === null) {
    var searchHistory = [];
} else {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
}

//local weather
getLocation();
setSearchHistory(searchHistory)

document.querySelector('#input').addEventListener('submit', function(event) {
    event.preventDefault();
    if (document.querySelector('#city').value !== '') {
    }
//local storage
localStorage.setItem('searchHistory', JSON.stringify(searchHistory)),
    setSearchHistory(searchHistory),
} else {
    var errorMsg = document.createElement('p'),
    errorMsg.textContent = "Where are you checking for the weather?",
    errorMsg.setAttribute('id', 'errorMsg'),

    document.querySelector('#input-btn').parentNode.insertBefore(errorMsg, document.querySelector('#input-btn').nextSibling)
};
function getGeocoding(city) {
    var requestUrl = encodeURI('https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid='+apiKey);
}
fetch(requestUrl)
.then(function (response) {               
    return response.json();
})
.then(function (data) {        
    removeErrorMsg();
  //Warn if a bad location or get the weather data
    if(data.length !== 0) {
    getWeather(data[0].lat, data[0].lon);
    } else {
    var errorMsg = document.createElement('p');
    errorMsg.textContent = "Cant find location, please try again";
    }
    errorMsg.setAttribute('id', 'error-msg');
            document.querySelector('#search-btn').parentNode.insertBefore(errorMsg, document.querySelector('#search-btn').nextSibling);
        });
function getWeather(lat, lon) {
    var requestUrlForcast = encodeURI('https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat='+lat+'&lon='+lon+'&appid='+apiKey);
            //Current weather URL
    var requestUrlCurr = encodeURI('https://api.openweathermap.org/data/2.5/weather?units=imperial&lat='+lat+'&lon='+lon+'&appid='+apiKey);
            
    var forcastDay = 1;
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
} fetch(requestUrlForcast)
.then(function (response) {
    return response.json();
})
.then(function (data) {
  //The forcast data comes in in three hour increments.  For each item received, check for the noon forcast and write that data.
  //If the noon forcast is not returned by the API for the final day, use the last time that was provided.
    data.list.forEach(function(value, key) {
    if (nextDate.format('YYYY-MM-DD HH:mm:ss') === dayjs.unix(value.dt).format('YYYY-MM-DD HH:mm:ss') || (forcastDay === 5 && key === 39 ) ) {
        if(document.querySelector('#day-'+forcastDay+'-weather-icon') !== null) {
        document.querySelector('#day-'+forcastDay+'-weather-icon').remove();
        }
      //Create a new element for the weather icon and append it
        var weatherIcon = document.createElement('img');
        weatherIcon.setAttribute('src', "https://openweathermap.org/img/w/" + value.weather[0].icon + ".png");        
        weatherIcon.setAttribute('id', "day-"+forcastDay+"-weather-icon");            
        document.querySelector('#day-'+forcastDay+'-date').after(weatherIcon);
      //Update the forcast data with the information received from the API
        document.querySelector('#day-'+forcastDay+'-date').textContent = nextDate.format('M/D/YYYY');
        document.querySelector('#day-'+forcastDay+'-temp').textContent = value.main.temp_max;
        document.querySelector('#day-'+forcastDay+'-wind').textContent = value.wind.speed;
        document.querySelector('#day-'+forcastDay+'-humidity').textContent = value.main.humidity;
      //increment to the next day.
        nextDate = nextDate.add(1,'day');
      //increment the forcast day for the ID.
        forcastDay++;
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
