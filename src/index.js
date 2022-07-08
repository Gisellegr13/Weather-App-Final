let date = new Date();

function getMeridian(now) {
    return now.getHours() < 12 ? "am" : "pm";
}

function formatDate(){    
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let day = days[date.getDay()];
    let month = date.getMonth();
    let dateNumber = date.getDate();
    let year = date.getFullYear();
    return `${day} ${month + 1}-${dateNumber}-${year}`
}

function formatTime() {
    //calculate the date
    let hours = date.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    let ampm = getMeridian(date);
    return ` ${hours}:${minutes} ${ampm}`
}


function displayTemperature(response) {
    let temperatureElement = document.querySelector(".current-temperature");
    let cityElement = document.querySelector("#city");
    let descriptionElement = document.querySelector(".description-weather");
    let humidityElement = document.querySelector(".humidity-span");
    let windElement = document.querySelector(".wind-span");
    let dateElement = document.querySelector(".date");
    let timeElement = document.querySelector(".hours");
    temperatureElement.innerHTML = Math.round(response.data.main.temp);
    cityElement.innerHTML = response.data.name;
    descriptionElement.innerHTML = response.data.weather[0].description;
    humidityElement.innerHTML = response.data.main.humidity;
    windElement.innerHTML = Math.round(response.data.wind.speed);
    dateElement.innerHTML = formatDate(response.data.dt * 1000);
    timeElement.innerHTML = formatTime(response.data.dt * 1000);
}

let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Brandon&appid=${apiKey}&units=metric`;

axios.get(apiUrl).then(displayTemperature);