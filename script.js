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
const forecast = document.querySelector('.forecast');

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

    // Fetch and update forecast data
    updateForecast(data.coord.lat, data.coord.lon);
}

// Function to fetch and display weather forecast
// Function to fetch and display daily weather forecast
// Function to fetch and display daily weather forecast
function updateForecast(lat, lon) {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(forecastApiUrl)
        .then(response => response.json())
        .then(data => {
            forecast.innerHTML = ''; // Clear previous forecast data

            const dailyForecasts = {};

            // Loop through forecast data to get only one forecast per day
            data.list.forEach(item => {
                const date = new Date(item.dt * 1000);
                const formattedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });

                if (!dailyForecasts[formattedDate]) {
                    dailyForecasts[formattedDate] = item;
                }
            });

            // Get the first five unique days
            const forecastDays = Object.values(dailyForecasts).slice(0, 5);

            forecastDays.forEach(item => {
                const date = new Date(item.dt * 1000);
                const dayWithSuffix = getOrdinalDate(date); // Convert to "3rd March", "4th March" format

                const forecastItem = document.createElement('div');
                forecastItem.classList.add('forecast-item');

                // Populate forecast item HTML
                forecastItem.innerHTML = `
                    <div class="forecast-day">${dayWithSuffix}</div>
                    <div class="forecast-icon">
                        <i class="${getWeatherIcon(item.weather[0].main)}"></i>
                    </div>
                    <div class="forecast-temp">${item.main.temp}°C</div>
                `;

                forecast.appendChild(forecastItem); // Append forecast item to container
            });
        });
}

// Function to get date with ordinal suffix (e.g., "3rd March", "4th March")
function getOrdinalDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'long' });

    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';

    return `${day}${suffix} ${month}`;
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