
const getCity = async (city) => {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
    const data = await res.json();
    return data;
}

const getWeather = async (latitude, longitude) => {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=2`);
    const data = await res.json();
    return data;
}

const buildHtml = async (cityInput) => {
    const cityData = await getCity(cityInput);
    const weatherData = await getWeather(cityData.results[0].latitude, cityData.results[0].longitude);

    let time = new Date(weatherData.current.time).getHours();
    if (7 < time && time < 17) {
        document.getElementsByClassName('wrapper')[0].classList.add('day');
    } else {
        document.getElementsByClassName('wrapper')[0].classList.add('night');
    }
    document.getElementsByClassName('city')[0].innerHTML = `<div class="city">${cityData.results[0].name}</div>`;
    document.getElementsByClassName('degree')[0].innerHTML = `<div class="degree">${weatherData.current.temperature_2m}${weatherData.current_units.temperature_2m}</div>`;
    document.getElementsByClassName('country')[0].innerHTML = `<td class="country">${cityData.results[0].country}</td>`
    document.getElementsByClassName('timezone')[0].innerHTML = `<td class="timezone">${cityData.results[0].timezone}</td>`
    document.getElementsByClassName('population')[0].innerHTML = `<td class="population">${cityData.results[0].population}</td>`
    document.getElementsByClassName('forecast')[0].innerHTML = `<td class="forecast">Low: ${weatherData.daily.temperature_2m_min[1]}${weatherData.daily_units.temperature_2m_min[1]}<br>Max: ${weatherData.daily.temperature_2m_max[1]}${weatherData.daily_units.temperature_2m_max[1]}</td>`
}

document.addEventListener('DOMContentLoaded', () => {
    buildHtml('vancouver');
});

document.getElementsByClassName('button')[0].addEventListener('click', (e) => {
    e.preventDefault();
    let city = document.getElementById('city').value;
    buildHtml(city);
})