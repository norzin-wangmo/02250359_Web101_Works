const API_KEY = "fe33e21951f4a9a3b46d736232a63946"; 

function getWeather() {
  const city = document.getElementById("city").value.trim();

  if (!city) {
    document.getElementById("result").innerText = "⚠️ Please enter a city";
    return;
  }

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      if (data.cod === 200) {
        document.getElementById("result").innerText =
          `🌡 Temperature: ${data.main.temp}°C\n🌥 Weather: ${data.weather[0].description}`;
      } else {
        document.getElementById("result").innerText =
          "❌ " + data.message;
      }
    })
    .catch(error => {
      document.getElementById("result").innerText = "❌ Error fetching data";
      console.log(error);
    });
}