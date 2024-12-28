let today = null
const temp = document.getElementById("temp"),

  date = document.getElementById("date-time"),
  currentLocation = document.getElementById("location"),
  condition = document.getElementById("condition"),
  rain = document.getElementById("rain"),
  mainIcon = document.getElementById("icon"),
  windSpeed = document.querySelector(".wind-speed"),
  humidity = document.querySelector(".humidity"),
  visibility = document.querySelector(".visibility"),
  humidityStatus = document.querySelector(".humidity-status"),
  airQuality = document.querySelector(".air-quality"),
  airQualityStatus = document.querySelector(".air-quality-status"),
  visibilityStatus = document.querySelector(".visibility-status"),
  weatherCards = document.querySelector("#weather-cards"),
  celciusBtn = document.querySelector(".celcius"),
  fahrenheitBtn = document.querySelector(".fahrenheit"),
  hourlyBtn = document.querySelector(".hourly"),
  weekBtn = document.querySelector(".week"),
  tempUnit = document.querySelectorAll(".temp-unit"),
  searchForm = document.querySelector("#search"),
  search = document.querySelector("#query");
document.getElementById("save_rc").onclick = (event) => {
  event.preventDefault()
  generateInsertQuery(today)

}

let currentCity = "";
let currentUnit = "C";
let hourlyorWeek = "Week";

function getDateTime() {
  let now = new Date(),
    hour = now.getHours(),
    minute = now.getMinutes();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  hour = hour % 12;
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }

  let dayString = days[now.getDay()];
  return `${dayString}, ${hour}:${minute}`;
}

date.innerText = getDateTime();
setInterval(() => {
  date.innerText = getDateTime();
}, 1000);

function getPublicIp() {
  fetch("https://geolocation-db.com/json/",
    {
      method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      currentCity = data.city;
      getWeatherData(data.city, currentUnit, hourlyorWeek);
    })
    .catch((error) => {
      console.error("Error fetching public IP:", error);
      alert("Error fetching public IP. Please try again later.");
    });
}

getPublicIp();

function getWeatherData(city, unit, hourlyorWeek) {
  const apiKey = "2VXNCLWCN2QYBZTHRJU89EP8Q";
  fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
    {
      method: "GET",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      today = data.currentConditions;

      if (unit === "C") {
        temp.innerText = today.temp;
      } else {
        temp.innerText = celciusToFahrenheit(today.temp);
      }

      console.log("Today : ", today)

      currentLocation.innerText = data.resolvedAddress;
      condition.innerText = today.conditions;
      rain.innerText = "Perc -" + today.precip + "%";
      windSpeed.innerText = today.windspeed;
      humidity.innerText = today.humidity + "%";
      visibility.innerText = today.visibility;
      airQuality.innerText = today.winddir;
      measureHumidityStatus(today.humidity);
      mainIcon.src = getIcon(today.icon);
      if (hourlyorWeek === "hourly") {
        updateForecast(data.days[0].hours, unit, "day");
      } else {
        updateForecast(data.days, unit, "week");
      }

      // Insert data into SQL table
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("Error fetching weather data. Please try again later.");
    });
}

function celciusToFahrenheit(temp) {
  return ((temp * 9) / 5 + 32).toFixed(1);
}

function measureHumidityStatus(humidity) {
  if (humidity <= 30) {
    humidityStatus.innerText = "Low";
  } else if (humidity <= 60) {
    humidityStatus.innerText = "Moderate";
  } else {
    humidityStatus.innerText = "High";
  }
}

function getIcon(condition) {
  if (condition === "Partly-cloudy-day") {
    return "icons/sun/27.png";
  } else if (condition === "partly-cloudy-night") {
    return "icons/moon/15.png";
  } else if (condition === "rain") {
    return "icons/rain/39.png";
  } else if (condition === "clear-day") {
    return "icons/sun/26.png";
  } else if (condition === "clear-night") {
    return "icons/moon/10.png";
  } else {
    return "icons/sun/26.png";
  }
}

function getDayName(date) {
  let day = new Date(date);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day.getDay()];
}

function getHour(time) {
  let hour = time.split(":")[0];
  let min = time.split(":")[1];
  if (hour > 12) {
    hour = hour - 12;
    return `${hour}:${min} PM`;
  } else {
    return `${hour}:${min} AM`;
  }
}

function updateForecast(data, unit, type) {
  weatherCards.innerHTML = "";
  let day = 0;
  let numCards = 0;
  if (type === "day") {
    numCards = 24;
  } else {
    numCards = 7;
  }
  for (let i = 0; i < numCards; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    let dayName = getHour(data[day].datetime);
    if (type === "week") {
      dayName = getDayName(data[day].datetime);
    }
    let dayTemp = data[day].temp;
    if (unit === "F") {
      dayTemp = celciusToFahrenheit(data[day].temp);
    }
    let iconCondition = data[day].icon;
    let iconSrc = getIcon(iconCondition);
    let tempUnit = "°C";
    if (unit === "F") {
      tempUnit = "°F";
    }
    card.innerHTML = `
      <h2 class="day-name">${dayName}</h2>
      <div class="card-icon">
        <img src="${iconSrc}" alt="" />
      </div>
      <div class="day-temp">
        <h2 class="temp">${dayTemp}</h2>
        <span class="temp-unit">${tempUnit}</span>
      </div>
    `;
    weatherCards.appendChild(card);
    day++;
  }
}

fahrenheitBtn.addEventListener("click", () => {
  changeUnit("F");
});
celciusBtn.addEventListener("click", () => {
  changeUnit("C");
});

function changeUnit(unit) {
  if (currentUnit !== unit) {
    currentUnit = unit;
    tempUnit.forEach((elem) => {
      elem.innerText = `°${unit.toUpperCase()}`;
    });
    if (unit === "C") {
      celciusBtn.classList.add("active");
      fahrenheitBtn.classList.remove("active");
    } else {
      celciusBtn.classList.remove("active");
      fahrenheitBtn.classList.add("active");
    }
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
}

hourlyBtn.addEventListener("click", () => {
  changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () => {
  changeTimeSpan("week");
});

function changeTimeSpan(unit) {
  if (hourlyorWeek !== unit) {
    hourlyorWeek = unit;
    if (unit === "hourly") {
      hourlyBtn.classList.add("active");
      weekBtn.classList.remove("active");
    } else {
      hourlyBtn.classList.remove("active");
      weekBtn.classList.add("active");
    }
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let location = search.value;
  if (location) {
    currentCity = location;
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
});


function getDateString(date) {
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
  let day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


// Function to generate MySQL INSERT query from today object and send as form data
async function generateInsertQuery(today) {
  if (today == null) {
    return;
  }

  const {
    datetime,
    temp,
    windspeed,
    humidity,
    conditions
  } = today;

  // Assuming you have variables like city, airQuality, quality defined elsewhere
  const city = currentCity; // Replace with actual city name
  const date = getDateString(new Date()); // Assuming datetime is a valid date/time string
  const temperature = parseFloat(temp).toFixed(1); // Assuming temperature is a float number
  const windSpeed = parseFloat(windspeed).toFixed(1); // Assuming windspeed is a float number
  const airQuality = condition.textContent; // Replace with actual air quality data
  const quality = airQualityStatus.textContent; // Replace with actual quality data

  // Assuming variables like city, date, temperature, airQuality, windSpeed, humidity, quality, conditions are defined elsewhere

  // Prepare form data
  const formData = new FormData();
  formData.append('city', city);
  formData.append('date', date);
  formData.append('temperature', temperature);
  formData.append('air_quality', airQuality);
  formData.append('wind_speed', windSpeed);
  formData.append('humidity', humidity);
  formData.append('quality', quality);
  formData.append('conditions', conditions);
 console.log("FORM DATA ; ",formData)
  try {
    const response = await fetch('./insert_weather.php', {
      method: 'POST',
      body: formData // Send form data
    });

    if (!response.ok) {
      throw new Error('Failed to insert weather data');
    }

    const result = await response.json();

    if (result.message === 'Weather data inserted successfully') {
      // Handle success, e.g., show a success message or redirect
      console.log(result.message);
      showAlert('Weather data inserted successfully');
    } else if (result.message === 'Weather data already exists for this city and date') {
      // Handle duplicate entry case
      console.log(result.message);
      showAlert('Weather data already exists for this city and date');
    } else {
      // Handle other errors or unexpected responses
      throw new Error('Unexpected response from server');
    }
  } catch (error) {
    console.error('Error inserting weather data:', error.message);
    showAlert('Error inserting weather data. Please try again later.');
  }

  function showAlert(message) {
    alert(message); // Use default alert to show the message
  }

}




// Usage example


window.onload = () => {
  const LOGIN= localStorage.getItem("LOGIN")
  if(!LOGIN){
    window.location.replace('./index.html');
  }
  
}

function logout(){
  
  localStorage.setItem("LOGIN",false)
  
    window.location.replace('./index.html');
}