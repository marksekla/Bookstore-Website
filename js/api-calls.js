// API Integration JavaScript

// API keys
const WEATHER_API_KEY = 'e82a0869371f42059be2cef5d78ca25e';
const MAP_API_KEY = 'pk.eyJ1IjoibWFya3Nla2xhIiwiYSI6ImNtOG0ybTMxNTBicXgybG9oc2t3bHR5dmkifQ.rvqGxsJyPXGcUIpCI1ayuQ';

/**
 * Load weather data from OpenWeatherMap API
 */
function loadWeatherData() {
    const weatherWidget = document.getElementById('weather-widget');
    if (!weatherWidget) return;

    weatherWidget.innerHTML = '<div class="loading">Loading weather data...</div>';

    // Windsor, ON coordinates
    const lat = 42.3149;
    const lon = -83.0364;

    // Fetch weather data with Windsor, CA
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&q=Windsor,CA&appid=${WEATHER_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const temp = Math.round(data.main.temp);
            const weatherDesc = data.weather[0].description;
            const cityName = data.name;

            weatherWidget.innerHTML = `
                <div class="weather-content">
                    <h3>Weather at Our Bookstore</h3>
                    <p>${cityName}: ${temp}°C, ${weatherDesc}</p>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            weatherWidget.innerHTML = '<p>Weather data currently unavailable</p>';
        });
}

/**
 * Initialize map to show bookstore location
 */
function initializeMap() {
    const mapContainer = document.getElementById('store-map');
    if (!mapContainer) return;

    mapContainer.innerHTML = '<div class="loading">Loading map...</div>';

    // Check if mapboxgl is available
    if (typeof mapboxgl !== 'undefined') {
        mapboxgl.accessToken = MAP_API_KEY;

        const map = new mapboxgl.Map({
            container: 'store-map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-83.0364, 42.3149], // Windsor, ON
            zoom: 14
        });

        // Add marker for store location
        new mapboxgl.Marker()
            .setLngLat([-83.0364, 42.3149])
            .setPopup(new mapboxgl.Popup().setHTML("<h3>Bookworm Haven</h3><p>123 Book Lane, Windsor, ON</p>"))
            .addTo(map);
    } else {
        mapContainer.innerHTML = '<p>Map service currently unavailable</p>';
    }
}

// Initialize APIs when DOM loads
document.addEventListener('DOMContentLoaded', function () {
    // Load weather widget if it exists
    loadWeatherData();

    // Initialize map if it exists
    initializeMap();
});