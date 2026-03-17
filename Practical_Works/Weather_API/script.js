const API_KEY = "fe33e21951f4a9a3b46d736232a63946"; 

const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

let locations = [];

// 🌦️ GET WEATHER
function getWeather() {
  const city = document.getElementById("city").value;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod === 200) {
        document.getElementById("weatherResult").innerText =
          `Temperature: ${data.main.temp}°C, ${data.weather[0].description}`;
      } else {
        document.getElementById("weatherResult").innerText = "City not found!";
      }
    });
}

// ➕ POST (SAVE LOCATION)
function saveLocation() {
  const name = document.getElementById("locationName").value;

  fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify({ title: name }),
    headers: {
      "Content-type": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      locations.push(data);
      displayLocations();
    });
}

// 📋 DISPLAY LOCATIONS
function displayLocations() {
  const list = document.getElementById("locationList");
  list.innerHTML = "";

  locations.forEach((loc, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${loc.title}
      <button onclick="editLocation(${index})">Edit</button>
      <button onclick="deleteLocation(${index})">Delete</button>
    `;

    list.appendChild(li);
  });
}

// ✏️ PUT (EDIT)
function editLocation(index) {
  const newName = prompt("Enter new name:");
  if (!newName) return;

  fetch(`${BASE_URL}/${locations[index].id}`, {
    method: "PUT",
    body: JSON.stringify({ title: newName }),
    headers: {
      "Content-type": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      locations[index] = data;
      displayLocations();
    });
}

// ❌ DELETE
function deleteLocation(index) {
  fetch(`${BASE_URL}/${locations[index].id}`, {
    method: "DELETE"
  }).then(() => {
    locations.splice(index, 1);
    displayLocations();
  });
}