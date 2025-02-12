const apiKey = "e9a9059807db211ca7cbd999de3bf599"; // Replace with your OpenWeatherMap API key
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const toggleUnit = document.getElementById("toggle-unit");
const errorMessage = document.getElementById("error-message");
const body = document.querySelector("body");
const city = document.getElementById("city");

let isCelsius = true;

// Weather background images
const weatherBackgrounds = {
    clear: "url('images/sunny.jpg')",
    clouds: "url('images/cloudy.jpg')",
    rain: "url('images/rainy.jpg')",
    snow: "url('images/snowy.jpg')",
    thunderstorm: "url('images/thunderstorm.jpg')",
    mist: "url('images/mist.jpg')",
    haze: "url('images/haze.jpg')",
    fog: "url('images/fog.jpg')",
};

// Fetch weather data from OpenWeatherMap API
async function fetchWeather(city) {
    try {
        const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        displayWeather(data);
        updateBackground(data.weather[0].main);
        errorMessage.textContent = "";
    } catch (error) {
        errorMessage.textContent = "City not found. Please try again.";
        clearWeather();
    }
}

// Display weather data
function displayWeather(data) {
    const iconCode = data.weather[0].icon;
    weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather Icon">`;
    temperature.textContent = `${data.main.temp}°C`;
    city.textContent = `${data.name}`
    description.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
}

// Update background based on weather condition
function updateBackground(weatherCondition) {
    const lowerCaseCondition = weatherCondition.toLowerCase();
    const background = weatherBackgrounds[lowerCaseCondition] || "url('images/default.jpg')";
    body.style.backgroundImage = background;
}

// Clear weather display
function clearWeather() {
    weatherIcon.innerHTML = "";
    temperature.textContent = "";
    description.textContent = "";
    humidity.textContent = "";
    windSpeed.textContent = "";
    body.style.backgroundImage = "url('images/default.jpg')"; // Default background
}

// Toggle between Celsius and Fahrenheit
function toggleTemperatureUnit() {
    const temp = parseFloat(temperature.textContent);
    if (isCelsius) {
        temperature.textContent = `${((temp * 9) / 5 + 32).toFixed(2)}°F`;
    } else {
        temperature.textContent = `${(((temp - 32) * 5) / 9).toFixed(2)}°C`;
    }
    isCelsius = !isCelsius;
}

// Event listeners
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city); 
});

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) fetchWeather(city);
    }
});

toggleUnit.addEventListener("click", toggleTemperatureUnit);

// **Fetch default city weather when the page loads**
window.onload = () => {
    const defaultCity = "New York"; // Change this to your preferred default city
    fetchWeather(defaultCity);
};