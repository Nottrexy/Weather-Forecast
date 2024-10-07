const apiKey = '3f80b75215a824888e85e3dfb5cc734d';
const recentCitiesDropdown = document.getElementById('recent-cities-dropdown');

// Fetch weather data for the entered city
function getWeather() {
    const city = document.getElementById('city').value.trim();

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch and display current weather
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '404') {
                alert('City not found');
                return;
            }
            displayWeather(data);
            updateRecentCities(city);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    // Fetch and display hourly forecast
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayHourlyForecast(data.list))
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

// Display current weather data
function displayWeather(data) {
    const tempDiv = document.getElementById('temp-div');
    const weatherInfo = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    const temperature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    tempDiv.innerHTML = `${temperature}°C`;
    weatherInfo.innerHTML = `${data.name}, ${description}`;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherIcon.classList.remove('hidden');
}

// Display hourly forecast
function displayHourlyForecast(hourlyData) {
    const hourlyForecast = document.getElementById('hourly-forecast');
    hourlyForecast.innerHTML = '';

    hourlyData.slice(0, 8).forEach(item => {
        const hour = new Date(item.dt * 1000).getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        const forecastHTML = `
            <div class="bg-gray-200 p-3 rounded-lg text-center">
                <span class="block text-sm font-semibold">${hour}:00</span>
                <img src="${iconUrl}" alt="Weather Icon" class="w-16 h-16 mx-auto mb-1">
                <span class="block text-lg">${temperature}°C</span>
            </div>
        `;
        hourlyForecast.innerHTML += forecastHTML;
    });
}

// Update recent cities in local storage
function updateRecentCities(city) {
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

    if (!recentCities.includes(city)) {
        if (recentCities.length >= 5) {
            recentCities.shift();
        }
        recentCities.push(city);
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
    }

    renderRecentCities();
}

// Render the recent cities dropdown
function renderRecentCities() {
    const recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
    recentCitiesDropdown.innerHTML = '';

    if (recentCities.length > 0) {
        recentCitiesDropdown.classList.remove('hidden');
        recentCities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            recentCitiesDropdown.appendChild(option);
        });
    } else {
        recentCitiesDropdown.classList.add('hidden');
    }
}

// Show dropdown when city input is focused
document.getElementById('city').addEventListener('focus', () => {
    const recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (recentCities.length > 0) {
        document.getElementById('recent-cities').classList.remove('hidden');
    }
});

// Update city input when a recent city is selected
recentCitiesDropdown.addEventListener('change', event => {
    document.getElementById('city').value = event.target.value;
    getWeather();
});

// Initial render of recent cities
renderRecentCities();
