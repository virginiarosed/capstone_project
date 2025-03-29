document.addEventListener("DOMContentLoaded", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeatherByLocation, handleLocationError);
    } else {
        getWeather();
    }

    setInterval(getWeather, 900000); // Update weather every 15 minutes
});

document.getElementById('city').addEventListener('input', async function () {
    const cityName = this.value;
    if (cityName.length > 2) {
        await fetchLocationSuggestions(cityName);
    } else {
        document.getElementById('suggestions').innerHTML = '';
    }
});

const countryFullNames = {
    "PH": "Philippines",
    "US": "United States",
    "CA": "Canada",
    "AU": "Australia",
    "GB": "United Kingdom",
    "IN": "India",
    "DE": "Germany",
    "FR": "France",
    "IT": "Italy",
    "ES": "Spain",
    "JP": "Japan",
    "CN": "China",
    "KR": "South Korea",
    "BR": "Brazil",
    "MX": "Mexico",
    "RU": "Russia",
    "ZA": "South Africa",
    "NG": "Nigeria",
    "AR": "Argentina",
    "SA": "Saudi Arabia",
    "AE": "United Arab Emirates",
    "NL": "Netherlands",
    "SE": "Sweden",
    "CH": "Switzerland",
    "BE": "Belgium",
    "DK": "Denmark",
    "NO": "Norway",
    "FI": "Finland",
    "IE": "Ireland",
    "NZ": "New Zealand",
    "SG": "Singapore",
    "MY": "Malaysia",
    "TH": "Thailand",
    "VN": "Vietnam",
    "ID": "Indonesia",
    "PK": "Pakistan",
    "BD": "Bangladesh",
    "PL": "Poland",
    "GR": "Greece",
    "PT": "Portugal",
    "HU": "Hungary",
    "CZ": "Czech Republic",
    "AT": "Austria",
    "IL": "Israel",
    "EG": "Egypt",
    "MA": "Morocco",
    "KE": "Kenya",
    "GH": "Ghana",
    "CO": "Colombia",
    "CL": "Chile",
    "PE": "Peru",
    "VE": "Venezuela",
    "TR": "Turkey",
    "UA": "Ukraine",
    "RO": "Romania",
    "IR": "Iran",
    "IQ": "Iraq",
    "SY": "Syria",
    "JO": "Jordan",
    "LB": "Lebanon",
    "QA": "Qatar",
    "KW": "Kuwait",
    "OM": "Oman",
    "BH": "Bahrain",
    "LK": "Sri Lanka",
    "MM": "Myanmar",
    "NP": "Nepal",
    "BT": "Bhutan",
    "KH": "Cambodia",
    "LA": "Laos",
    "TW": "Taiwan",
    "HK": "Hong Kong",
    "MO": "Macau",
    "IS": "Iceland",
    "LU": "Luxembourg",
    "MC": "Monaco",
    "LI": "Liechtenstein",
    "MT": "Malta",
    "CY": "Cyprus",
    "SI": "Slovenia",
    "SK": "Slovakia",
    "BG": "Bulgaria",
    "HR": "Croatia",
    "BA": "Bosnia and Herzegovina",
    "RS": "Serbia",
    "ME": "Montenegro",
    "MK": "North Macedonia",
    "AL": "Albania",
    "AM": "Armenia",
    "GE": "Georgia",
    "AZ": "Azerbaijan",
    "UZ": "Uzbekistan",
    "KZ": "Kazakhstan",
    "TM": "Turkmenistan",
    "KG": "Kyrgyzstan",
    "TJ": "Tajikistan",
    "MN": "Mongolia",
    "AF": "Afghanistan",
    "ZW": "Zimbabwe",
    "ZM": "Zambia",
    "UG": "Uganda",
    "TZ": "Tanzania",
    "SD": "Sudan",
    "SS": "South Sudan",
    "ET": "Ethiopia",
    "SN": "Senegal",
    "DZ": "Algeria",
    "LY": "Libya",
    "TN": "Tunisia",
    "CM": "Cameroon",
    "CI": "Ivory Coast",
    "ML": "Mali",
    "BF": "Burkina Faso",
    "MR": "Mauritania",
    "NE": "Niger",
    "TG": "Togo",
    "SL": "Sierra Leone",
    "LR": "Liberia",
    "GM": "Gambia",
    "GW": "Guinea-Bissau",
    "BI": "Burundi",
    "RW": "Rwanda",
    "MW": "Malawi",
    "LS": "Lesotho",
    "SZ": "Eswatini",
    "AO": "Angola",
    "MZ": "Mozambique",
    "BW": "Botswana",
    "NA": "Namibia",
    "GA": "Gabon",
    "GQ": "Equatorial Guinea",
    "CG": "Congo",
    "CD": "Democratic Republic of the Congo",
    "BJ": "Benin",
    "SO": "Somalia",
    "YE": "Yemen",
    "CU": "Cuba",
    "HT": "Haiti",
    "JM": "Jamaica",
    "TT": "Trinidad and Tobago",
    "BS": "Bahamas",
    "BB": "Barbados",
    "AG": "Antigua and Barbuda",
    "DM": "Dominica",
    "LC": "Saint Lucia",
    "VC": "Saint Vincent and the Grenadines",
    "GD": "Grenada",
    "KN": "Saint Kitts and Nevis",
    "SR": "Suriname",
    "GY": "Guyana",
    "BO": "Bolivia",
    "PY": "Paraguay",
    "UY": "Uruguay",
    "EC": "Ecuador",
    "FJ": "Fiji",
    "PG": "Papua New Guinea",
    "SB": "Solomon Islands",
    "VU": "Vanuatu",
    "WS": "Samoa",
    "TO": "Tonga",
    "TV": "Tuvalu",
    "NR": "Nauru",
    "MH": "Marshall Islands",
    "FM": "Micronesia",
    "PW": "Palau",
    "KI": "Kiribati"
};

async function fetchLocationSuggestions(cityName) {
    try {
        const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
            params: {
                q: cityName,
                limit: 5,
                appid: '54a57bc234ad752a4f59e59cd372201d'
            }
        });

        const suggestions = response.data.filter(location => location.lat && location.lon);
        suggestions.sort((a, b) => {
            if (a.country === 'PH' && b.country !== 'PH') return -1;
            if (a.country !== 'PH' && b.country === 'PH') return 1;
            return 0;
        });

        displaySuggestions(suggestions);
    } catch (error) {
        console.error('Error fetching location suggestions:', error.message);
    }
}

function displaySuggestions(suggestions) {
    const suggestionListElement = document.getElementById('suggestions');
    suggestionListElement.innerHTML = '';

    const uniqueSuggestions = new Set();
    suggestions.forEach(suggestion => {
        const uniqueIdentifier = `${suggestion.name}, ${suggestion.country}`;
        if (!uniqueSuggestions.has(uniqueIdentifier)) {
            uniqueSuggestions.add(uniqueIdentifier);
            const countryFullName = countryFullNames[suggestion.country] || suggestion.country;
            const listItemElement = document.createElement('li');
            listItemElement.textContent = `${suggestion.name}, ${countryFullName}`;
            
            listItemElement.addEventListener('click', function () {
                document.getElementById('city').value = suggestion.name;
                document.getElementById('suggestions').innerHTML = '';
                getWeather();
            });
            
            suggestionListElement.appendChild(listItemElement);
        }
    });
}

async function getWeather() {
    const city = document.getElementById('city').value;
    if (!city) return;

    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
            params: {
                q: city,
                appid: '54a57bc234ad752a4f59e59cd372201d',
                units: 'metric'
            }
        });
        updateWeatherUI(response.data);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
    }
}

async function getWeatherByLocation(position) {
    const { latitude, longitude } = position.coords;
    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
            params: {
                lat: latitude,
                lon: longitude,
                appid: '54a57bc234ad752a4f59e59cd372201d',
                units: 'metric'
            }
        });
        document.getElementById('city').value = response.data.city.name;
        updateWeatherUI(response.data);
    } catch (error) {
        console.error('Error fetching weather by location:', error.message);
    }
}

function handleLocationError(error) {
    console.warn(`Geolocation error (${error.code}): ${error.message}`);
    getWeather();
}

function updateWeatherUI(data) {
    const currentTemperature = data.list[0].main.temp;
    const todayRainChance = Math.round(data.list[0].pop * 100);
    const todayPressure = data.list[0].main.pressure;
    
    document.querySelector('.weather-temp').textContent = Math.round(currentTemperature) + 'ºC';
    document.querySelector('.rain .value').textContent = todayRainChance + '%';
    document.querySelector('.pressure .value').textContent = todayPressure + ' hPa';

    const forecastData = data.list;

    const dailyForecast = {};
    forecastData.forEach((data) => {
        const day = new Date(data.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
        if (!dailyForecast[day]) {
            dailyForecast[day] = {
                minTemp: data.main.temp_min,
                maxTemp: data.main.temp_max,
                description: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                rainChance: Math.round(data.pop * 100),
                pressure: data.main.pressure,
                icon: data.weather[0].icon,
            };
        } else {
            dailyForecast[day].minTemp = Math.min(dailyForecast[day].minTemp, data.main.temp_min);
            dailyForecast[day].maxTemp = Math.max(dailyForecast[day].maxTemp, data.main.temp_max);
        }
    });

    document.querySelector('.date-dayname').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    document.querySelector('.date-day').textContent = new Date().toUTCString().slice(5, 16);
    document.querySelector('.location').textContent = data.city.name;
    document.querySelector('.weather-desc').textContent = dailyForecast[new Date().toLocaleDateString('en-US', { weekday: 'long' })].description.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    document.querySelector('.humidity .value').textContent = dailyForecast[new Date().toLocaleDateString('en-US', { weekday: 'long' })].humidity + ' %';
    document.querySelector('.wind .value').textContent = dailyForecast[new Date().toLocaleDateString('en-US', { weekday: 'long' })].windSpeed + ' m/s';

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayIndex = new Date().getDay();
    
    const dayElements = document.querySelectorAll('.day-name');
    const tempElements = document.querySelectorAll('.day-temp');
    const rainElements = document.querySelectorAll('.day-rain');
    const pressureElements = document.querySelectorAll('.day-pressure');
    const iconElements = document.querySelectorAll('.day-icon');

    for (let i = 0; i < 5; i++) {
        const nextDayIndex = (todayIndex + 1 + i) % 7;
        const dayName = daysOfWeek[nextDayIndex];
        const data = dailyForecast[dayName];
        
        dayElements[i].textContent = dayName;
        if (data) {
            tempElements[i].textContent = `${Math.round(data.minTemp)}º / ${Math.round(data.maxTemp)}º`;
            rainElements[i].textContent = `🌧️ ${data.rainChance}%`;
            pressureElements[i].textContent = `🔵 ${data.pressure} hPa`;
            iconElements[i].innerHTML = getWeatherIcon(data.icon);
        } else {
            // Handle missing data gracefully
            tempElements[i].textContent = 'N/A';
            rainElements[i].textContent = 'N/A';
            pressureElements[i].textContent = 'N/A';
            iconElements[i].innerHTML = '';
        }
    }
}

function getWeatherIcon(iconCode) {
    const iconBaseUrl = 'https://openweathermap.org/img/wn/';
    const iconSize = '@2x.png';
    return `<img src="${iconBaseUrl}${iconCode}${iconSize}" alt="Weather Icon">`;
}
