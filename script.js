// Select DOM elements
const searchButton = document.querySelector('.search-button');
const inputValue = document.querySelector('.inputValue');
const locationElement = document.querySelector('.location');
const dateTime = document.querySelector('.date-time');
const temp = document.querySelector('.temp');
const weatherIcon = document.querySelector('.weather-icon i');
const weatherCondition = document.querySelector('.weather-condition');
const windSpeed = document.querySelector('.wind-speed');
const humidity = document.querySelector('.humidity');
const pressure = document.querySelector('.pressure');
const weatherInfo = document.querySelector('.weather-info');
const loadingSection = document.querySelector('.loading');
const errorMessage = document.querySelector('.error-message');

// OpenWeatherMap API key
const apiKey = '41ec2eb09552bd5222566a3e340a791a'; // Replace with your actual API key

// Function to fetch weather data from OpenWeatherMap API
function fetchWeatherData() {
    const city = inputValue.value; // Get user input (city name)

    // Construct API URL
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    // Fetch data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                throw new Error('City not found'); // Handle invalid city
            }
            updateWeatherUI(data); // Update UI with retrieved data
        })
        .catch(error => {
            errorMessage.style.display = 'block'; // Show error message
            console.error(error);
        });
}

// Function to update UI with weather data
function updateWeatherUI(data) {
    loadingSection.style.display = 'none'; // Hide loading indicator
    weatherInfo.style.display = 'block'; // Show weather information

    // Extract necessary data from API response
    const { name, main, weather, wind, dt } = data;
    const weatherData = weather[0]; // Get first weather object
    const date = new Date(dt * 1000); // Convert timestamp to date

    // Update UI elements with retrieved data
    locationElement.textContent = `${name}, ${data.sys.country}`;
    dateTime.textContent = `${date.toDateString()}, ${date.toLocaleTimeString()}`;
    temp.textContent = `${main.temp}°C`;
    weatherIcon.className = getWeatherIcon(weatherData.main);
    weatherCondition.textContent = weatherData.description;
    windSpeed.textContent = `${wind.speed} km/h`;
    humidity.textContent = `${main.humidity}%`;
    pressure.textContent = `${main.pressure} hPa`;
}

// Event listener for 'Enter' key press in input field
inputValue.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        fetchWeatherData(); // Trigger search when Enter is pressed
    }
});

// Function to get weather icon class based on weather condition
function getWeatherIcon(weather) {
    switch (weather) {
        case 'Clear': return 'fas fa-sun';
        case 'Clouds': return 'fas fa-cloud';
        case 'Rain': return 'fas fa-cloud-showers-heavy';
        case 'Snow': return 'fas fa-snowflake';
        case 'Thunderstorm': return 'fas fa-bolt';
        default: return 'fas fa-cloud-sun';
    }
}
