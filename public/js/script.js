const hourlySlide = document.querySelector(".hourly-slide");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let counter = 0;
const size = document.querySelector(".hourly-wrapper").clientWidth;

prevBtn.addEventListener("click", () => {
  if (counter <= 0) return;

  hourlySlide.style.transition = "transform 0.4s ease-in-out";
  counter--;
  hourlySlide.style.transform = "translateX(" + -size * counter + "px)";
  console.log(size);
});

nextBtn.addEventListener("click", () => {
  if (counter >= 3) return;

  hourlySlide.style.transition = "transform 0.4s ease-in-out";
  counter++;
  hourlySlide.style.transform = "translateX(" + -size * counter + "px)";
  console.log(size);
});

document.getElementById("todays-forecast").style.display = "none";
document.getElementById("daily-forecast").style.display = "none";

document
  .getElementById("search-term")
  .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      var searchTerm = document.getElementById("search-term").value;

      // tt.services
      //   .geocode({
      //     key: "77txHOGsPaFeZAvQAyV9k7bQ1EB8BGDs",
      //     query: searchTerm,
      //     bestResult: true
      //   })
      //   .go()
      //   .then(callbackFn);

      fetch("/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          query: searchTerm
        })
      })
        .then(res => res.json())
        .then(data => {
          callbackFn(data);
        });

      document.getElementById("todays-forecast").style.display = "grid";
      document.getElementById("daily-forecast").style.display = "flex";
    }
  });

function callbackFn(result) {
  console.log(result);

  const place = result[0].address.freeformAddress;
  const latitude = result[0].position.lat;
  const longitude = result[0].position.lon;

  console.log(longitude, latitude);

  fetch("/weather", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      latitude: latitude,
      longitude: longitude
    })
  })
    .then(res => res.json())
    .then(data => {
      setWeatherData(data, place);
      setDayHeaders(today);
      setHourHeaders(today);
    });
}

const icon = new Skycons({ color: "#222" });
const locationElement = document.querySelector("[data-location]");
const statusElement = document.querySelector("[data-status]");
const temperatureElement = document.querySelectorAll("[data-temperature]");
const precipitationElement = document.querySelectorAll("[data-precipitation]");
const windElement = document.querySelectorAll("[data-wind]");
const CurrentDayTemperatureElement = document.querySelector(
  "[current-day-data-temperature]"
);
const CurrentDayPrecipitationElement = document.querySelector(
  "[current-day-data-precipitation]"
);
const CurrentDayWindElement = document.querySelector("[current-day-data-wind]");

function setWeatherData(data, place) {
  console.log(data);
  locationElement.textContent = place;
  statusElement.textContent = data.currently.summary;
  icon.set(`icon-current`, data.currently.icon);

  CurrentDayTemperatureElement.textContent = data.currently.temperature;
  CurrentDayPrecipitationElement.textContent = `${Math.round(
    data.currently.precipProbability * 100
  )}%`;
  CurrentDayWindElement.textContent = data.currently.windSpeed;

  //daily weather dat
  for (var i = 0; i < 7; i++) {
    icon.set(`icon${i + 1}`, data.daily.data[i + 1].icon);
    icon.play();

    temperatureElement[i].textContent = data.daily.data[i + 1].temperatureHigh;
    precipitationElement[i].textContent = `${Math.round(
      data.daily.data[i + 1].precipProbability * 100
    )}%`;
    windElement[i].textContent = data.daily.data[i + 1].windSpeed;
  }

  //hourly weather data
  for (var i = 0; i < 24; i++) {
    icon.set(`icon-hour-${i}`, data.hourly.data[i].icon);
    icon.play();
  }
}

const day = document.querySelectorAll("[week-day]");
const hour = document.querySelectorAll("[hour-time]");
const hourDay = document.querySelectorAll("[hour-day]");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const daysShort = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

const hours = [
  "12:00 AM",
  "1:00 AM",
  "2:00 AM",
  "3:00 AM",
  "4:00 AM",
  "5:00 AM",
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM"
];

const today = new Date();

function setDayHeaders(date) {
  for (var i = 0; i < 7; i++) {
    date.setDate(today.getDate() + 1);
    day[i].textContent = days[date.getDay()];
  }
}

function setHourHeaders(date) {
  for (var i = 0; i < 24; i++) {
    hour[i].textContent = hours[date.getHours()];
    hourDay[i].textContent = daysShort[date.getDay()];
    date.setHours(today.getHours() + 1);
  }
}
