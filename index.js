const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
const API_KEY = "b3109a80a26a89cbaeb6c991bb5f1d5a";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            userInoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        } else {
            searchForm.classList.remove("active");
            userInoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const weatherInfo = await response.json();
        loadingScreen.classList.remove("active");
        userInoContainer.classList.add("active");
        console.log(weatherInfo);
        renderWeatherInfo(weatherInfo);
    } catch (err) {
        loadingScreen.classList.remove("active");
        console.log("Error Found ", err);
    }
}

function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const feelLike = document.querySelector("[data-feelsLike]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    const sunrise = document.querySelector("[data-sunrise]");
    const sunset = document.querySelector("[data-sunset]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    feelLike.innerText = `Feels Like : ${weatherInfo?.main?.feels_like}`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}km/hr`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
    sunrise.innerText = new Date(weatherInfo?.sys?.sunrise * 1000).toLocaleTimeString();
    sunset.innerText = new Date(weatherInfo?.sys?.sunset * 1000).toLocaleTimeString();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("No geoLocation Support");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if (cityName === "") {
        return;
    } else {
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const weatherInfo = await response.json();
        loadingScreen.classList.remove("active");
        userInoContainer.classList.add("active");
        renderWeatherInfo(weatherInfo);
    } catch (err) {
        console.log("Error Found ", err);
    }
}