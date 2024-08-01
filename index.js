console.log("Hello");

function renderWeatherInfo(data) {
    let newPara = document.createElement('p');
    newPara.textContent = `${data.main.temp} °C`;
    document.body.appendChild(newPara);
}

async function fetchWeatherDetails() {
    try {
        let city = "goa";
        let API_KEY = "b3109a80a26a89cbaeb6c991bb5f1d5a";

        const resppnse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await resppnse.json();
        console.log("Weather data -> ", data);

        renderWeatherInfo(data);
    }
    catch (err) {
        // handle error
        console.log("Error Found ", err);
    }
}

async function customWeatherDetails() {
    try {
        let lat = 17.33;
        let long = 18.99;
        let API_KEY = "b3109a80a26a89cbaeb6c991bb5f1d5a";

        const resppnse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);

        const data = await resppnse.json();
        console.log("Weather data -> ", data);

        renderWeatherInfo(data);
    }
    catch (err) {
        // handle error
        console.log("Error Found ", err);
    }
}

function switchTab(clickedTab){
    apiErrorContainer.classList.remove("active");

    if(clickedTab !== currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInoContainer.classList.remove("active");
        }
    }
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("No geoLocation Support");
    }
}

function showPosition(position){
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    console.log(lat);
    console.log(long);
}