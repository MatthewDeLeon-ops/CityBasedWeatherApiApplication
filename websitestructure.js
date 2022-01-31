const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const API = "a9cda4bc0a0479d199f6241c56c1238d";

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const militaryto12hrconversion = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    (militaryto12hrconversion < 10
      ? "0" + militaryto12hrconversion
      : militaryto12hrconversion) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=imperial&appid=${API}`
    )
      .then((res) => res.json())
      .then((data) => {
        showWeatherData(data);
      });
  });
}
function showWeatherData(data) {
  const temp = data.current.temp.toFixed(0);
  const UV = data.current.uvi
  const pressure = data.current.pressure
  const { humidity, sunrise, sunset } = data.current;
  timezone.innerHTML = data.timezone;
  countryEl.innerHTML - data.latitude + "N" + data.longitude + "E";
  currentWeatherItemsEl.innerHTML = `
  <div class="weather-item">
  <div>Tempurature</div>
  <div>${temp} F</div>
</div>
   <div class="weather-item">
 		<div>Humidity</div>
 		<div>${humidity} %</div>
	</div>
	<div class="weather-item">
	<div>UV index</div>
	<div>${UV}</div>
</div>
<div class="weather-item">
	<div>Pressure</div>
	<div>${(pressure*0.02953).toFixed(2)} inHg</div>
</div>
	<div class="weather-item">
	<div>sunrise</div>
	<div>${window.moment(sunrise * 1000).format("h:mm a")}</div>
</div>
<div class="weather-item">
<div>sunset</div>
<div>${window.moment(sunset * 1000).format("h:mm a")}</div>
</div>`;
  let otherDayForcast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTempEl.innerHTML = `
            <img src="https://openweathermap.org/img/wn//${
              day.weather[0].icon
            }@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("ddd")}</div>
                <div class="temp">Night - ${day.temp.night}&#176;F</div>
                <div class="temp">Day - ${day.temp.day}&#176;F</div>
            </div>
            
            `;
    } else {
      otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("ddd")}</div>
                <img src="https://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;F</div>
                <div class="temp">Day - ${day.temp.day}&#176;F</div>
            </div>
            
            `;
    }
  });
  weatherForecastEl.innerHTML = otherDayForcast;
}

// 32.341202, -106.741868
// 32.3412, lon: -106.7417
