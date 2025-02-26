const apiKey = "060c5e544640c163e6d0b29c85750b70"; 

function getWeather() {
    let city = document.getElementById("cityInput").value.trim();
    if (!city) {
        alert("Please enter a city name");
        return;
    }

    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (!data || data.cod !== 200) {
                document.getElementById("weatherResult").innerHTML = `<p style="color: red;">Error: ${data.message}</p>`;
                return;
            }

            let iconCode = data.weather[0]?.icon || "01d";
            let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            let sunriseTime = data.sys.sunrise ? new Date(data.sys.sunrise * 1000).toLocaleTimeString() : "N/A";
            let sunsetTime = data.sys.sunset ? new Date(data.sys.sunset * 1000).toLocaleTimeString() : "N/A";

            let weatherInfo = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <img src="${iconUrl}" alt="Weather Icon">
                <p>Temperature: ${data.main.temp}°C (<a href="#" onclick="convertTemp(${data.main.temp})">Convert to °F</a>)</p>
                <p>Weather: ${data.weather[0]?.description || "No data"}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
                <p>Sunrise: ${sunriseTime}</p>
                <p>Sunset: ${sunsetTime}</p>
            `;
            document.getElementById("weatherResult").innerHTML = weatherInfo;
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            document.getElementById("weatherResult").innerHTML = "<p style='color: red;'>Error fetching data.</p>";
        });
}

function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (!data || data.cod !== 200) {
                        document.getElementById("weatherResult").innerHTML = `<p style="color: red;">Error: ${data.message}</p>`;
                        return;
                    }

                    let iconCode = data.weather[0]?.icon || "01d";
                    let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

                    let weatherInfo = `
                        <h2>${data.name}, ${data.sys.country}</h2>
                        <img src="${iconUrl}" alt="Weather Icon">
                        <p>Temperature: ${data.main.temp}°C</p>
                        <p>Weather: ${data.weather[0]?.description || "No data"}</p>
                        <p>Humidity: ${data.main.humidity}%</p>
                        <p>Wind Speed: ${data.wind.speed} m/s</p>
                    `;
                    document.getElementById("weatherResult").innerHTML = weatherInfo;
                })
                .catch(error => {
                    console.error("Error fetching weather data:", error);
                    document.getElementById("weatherResult").innerHTML = "<p style='color: red;'>Error fetching data.</p>";
                });
        }, error => {
            alert("Location access denied! Please enter the city manually.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}


function getForecast() {
    let city = document.getElementById("cityInput").value.trim();
    if (!city) {
        alert("Please enter a city name");
        return;
    }

    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (!data || data.cod !== "200") {
                document.getElementById("forecastResult").innerHTML = `<p style="color: red;">Error: ${data.message}</p>`;
                return;
            }

            let forecastHTML = `<h2>5-Day Forecast for ${data.city.name}, ${data.city.country}</h2>`;
            let days = new Set(); // To store unique days

            for (let i = 0; i < data.list.length; i++) {
                let day = data.list[i];
                let dateStr = new Date(day.dt_txt).toDateString();

                if (!days.has(dateStr)) {
                    days.add(dateStr);
                    let iconUrl = `https://openweathermap.org/img/wn/${day.weather[0]?.icon || "01d"}@2x.png`;

                    forecastHTML += `
                        <div class="forecast">
                            <h3>${dateStr}</h3>
                            <img src="${iconUrl}" alt="Weather Icon">
                            <p>Temp: ${day.main.temp}°C</p>
                            <p>${day.weather[0]?.description || "No data"}</p>
                        </div>
                    `;

                    if (days.size >= 5) break; // Stop after 5 unique days
                }
            }

            document.getElementById("forecastResult").innerHTML = forecastHTML;
        })
        .catch(error => {
            console.error("Error fetching forecast data:", error);
            document.getElementById("forecastResult").innerHTML = "<p style='color: red;'>Error fetching forecast.</p>";
        });
}


function convertTemp(tempC) {
    let tempF = (tempC * 9 / 5) + 32;
    alert(`Temperature in Fahrenheit: ${tempF.toFixed(2)}°F`);
}
