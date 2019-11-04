document
  .getElementById("search-term")
  .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      var searchTerm = document.getElementById("search-term").value;

      tt.services
        .geocode({
          key: "77txHOGsPaFeZAvQAyV9k7bQ1EB8BGDs",
          query: searchTerm,
          bestResult: true
        })
        .go()
        .then(callbackFn);
    }
  });

function callbackFn(result) {
  console.log(result);

  const place = result.address.freeformAddress;
  const latitude = result.position.lat;
  const longitude = result.position.lng;

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
const temperatureElement = document.querySelector("[data-temperature]");
const precipitationElement = document.querySelector("[data-precipitation]");
const windElement = document.querySelector("[data-wind]");
icon.set("icon", "clear-day");
icon.play();

function setWeatherData(data, place) {
  locationElement.textContent = place;
  statusElement.textContent = data.summary;
  temperatureElement.textContent = data.temperature;
  precipitationElement.textContent = `${data.precipProbability * 100}%`;
  windElement.textContent = data.windSpeed;
  icon.set("icon", data.icon);
  icon.play();
}
