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

      document.getElementById("todays-forecast").style.display = "flex";
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

  for (var i = 0; i < 7; i++) {
    icon.set(`icon${i + 1}`, data.daily.data[i + 1].icon);
    icon.play();

    temperatureElement[i].textContent = data.daily.data[i + 1].temperatureHigh;
    precipitationElement[i].textContent = `${Math.round(
      data.daily.data[i + 1].precipProbability * 100
    )}%`;
    windElement[i].textContent = data.daily.data[i + 1].windSpeed;
  }
}
