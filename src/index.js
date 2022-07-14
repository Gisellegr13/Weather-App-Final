function getMeridian(now) {
    return now.getHours() < 12 ? "am" : "pm";
}

function formatDate(timestamp) {
    let date = new Date(timestamp);
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let day = days[date.getDay()];
    let month = date.getMonth();
    let dateNumber = date.getDate();
    let year = date.getFullYear();
    return `  ${day} ${month + 1}-${dateNumber}-${year}`
}

function formatTime(timestamp) {
    //calculate the date
    let time = new Date(timestamp)
    let hours = time.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }
    if (hours > 12) {
        hours = hours - 12;
    }
    let minutes = time.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    // display minutes every 15 minutes
    if (minutes < 15) {
        minutes = "00";
    }
    if (minutes > 14 && minutes < 30) {
        minutes = "15";
    }
    if (minutes > 29 && minutes < 45) {
        minutes = "30";
    }
    if (minutes > 44 && minutes < 60) {
        minutes = "45";
    }

    let ampm = getMeridian(time);
    return ` ${hours}:${minutes} ${ampm}`
}

function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
}

function displayForecast(response) {
    let forecast = response.data.daily;

    let forecastElement = document.querySelector(".forecast");

    let forecastHTML = `<div class="row align-items-center">`;
    forecastHTML += `<div class="col-1 left"></div>`
    forecast.forEach(function (forecastDay, index) {
        if (index > 0 && index < 6) {
            forecastHTML =
                forecastHTML +
                `
            <div class="col-2 dayByday">
              <div class="forecast-date">${formatDay(forecastDay.dt)}</div>
              <img 
                src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" 
                alt=""
                width="42"
              />
              <div class="temperature">
              <span class="max-temp"> ${Math.round(forecastDay.temp.max)}° </span>
              <span class="min-temp"> ${Math.round(forecastDay.temp.min)}° </span>
              </div>            
            </div>       
            `;
        }
    });
    forecastHTML += `<div class="col-1 div>`;
    forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
    let apiKey = "6d68aadfacdd4f5163bc273049a0cf2d";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
}


function displayTemperature(response) {
    let temperatureElement = document.querySelector(".current-temperature");
    let cityElement = document.querySelector("#city");
    let descriptionElement = document.querySelector(".description-weather");
    let humidityElement = document.querySelector(".humidity-span");
    let windElement = document.querySelector(".wind-span");
    let dateElement = document.querySelector(".date");
    let timeElement = document.querySelector(".hours");
    let iconElement = document.querySelector("#icon-big");

    celsiusTemp = response.data.main.temp;

    temperatureElement.innerHTML = Math.round(celsiusTemp);
    cityElement.innerHTML = response.data.name;
    descriptionElement.innerHTML = response.data.weather[0].description;
    humidityElement.innerHTML = response.data.main.humidity;
    windElement.innerHTML = Math.round(response.data.wind.speed);
    dateElement.innerHTML = formatDate(response.data.dt * 1000);
    timeElement.innerHTML = formatTime(response.data.dt * 1000);
    iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    iconElement.setAttribute("alt", response.data.weather[0].description);

    getForecast(response.data.coord);
}

function search(city) {
    let apiKey = "6d68aadfacdd4f5163bc273049a0cf2d";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayTemperature);

}

function handleSubmit(event) {
    event.preventDefault();
    let cityInputElement = document.querySelector("#city-input");
    search(cityInputElement.value)

}

function showTempF() {
    let changeTemp = document.querySelector(".current-temperature");
    let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
    changeTemp.innerHTML = Math.round(fahrenheitTemp);
}

function showTempC() {
    let changeTemp = document.querySelector(".current-temperature");
    changeTemp.innerHTML = Math.round(celsiusTemp);
}

function currentWeather(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiKey = "6d68aadfacdd4f5163bc273049a0cf2d";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric`;

    axios.get(`${apiUrl}&appid=${apiKey}`).then(showCurrTemp);
}

function showCurrTemp(response) {
    displayTemperature(response);
    let location = response.data.name;
    let h1 = document.querySelector("h1");
    h1.innerHTML = `${location}`;
}

function getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(currentWeather);
}

let celsiusTemp = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitElement = document.querySelector("#Fahrenheit");
fahrenheitElement.addEventListener("click", showTempF);

let celsiusElement = document.querySelector("#Celsius");
celsiusElement.addEventListener("click", showTempC);

let currentIcon = document.querySelector(".current-weather");
currentIcon.addEventListener("click", getCurrentPosition);

search("brandon")