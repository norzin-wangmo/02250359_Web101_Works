# Weather App Project

## 1. Project Overview
This is a simple web-based Weather App that allows users to:
- Get real-time weather information for any city using the OpenWeatherMap API (GET request).
- Save locations to a list (POST request simulated via JSONPlaceholder API).
- Edit saved locations (PUT request simulated).
- Delete saved locations (DELETE request simulated).

The app uses HTML, CSS, and JavaScript with Fetch API to interact with the APIs.

---

## 2. Objectives
1. Learn how to fetch and display weather data from an API.
2. Implement CRUD operations (Create, Read, Update, Delete) using Fetch API.
3. Understand handling API responses and error messages.
4. Create a simple, interactive web interface for user input and display.

---

## 3. Technologies Used
- **HTML** – Structure and layout of the web page.
- **CSS** – Styling for a clean, user-friendly interface.
- **JavaScript** – Logic for API requests and DOM manipulation.
- **Fetch API** – Handling GET, POST, PUT, DELETE requests.
- **OpenWeatherMap API** – Provides real-time weather data.
- **JSONPlaceholder API** – Simulates backend CRUD operations.

---

## 4. Features
1. **Get Weather**
   - Enter a city name to fetch current temperature and weather description.
   - Error messages displayed if city is not found or API fails.

2. **Save Location**
   - Add a location to a list.
   - Displays newly added locations immediately.

3. **Edit Location**
   - Update the name of a saved location.
   - Changes reflect immediately in the UI.

4. **Delete Location**
   - Remove a saved location from the list.

> **Note:** JSONPlaceholder API is a simulated backend. Changes are **not permanent** after page refresh. Local state updates are used to reflect edits immediately.

---

## 5. How to Run
1. Download or clone the project folder.
2. Open `index.html` in a web browser.
3. Add your OpenWeatherMap API key in `script.js`:
const API_KEY = "YOUR_API_KEY_HERE"
4. Test GET, POST, PUT, and DELETE features.

## 6. Challenges Faced
1. Initially, PUT requests didn’t persist because JSONPlaceholder is a fake API.
2. Resolved by updating data locally in the browser.
3. Needed to wait a few minutes for OpenWeatherMap API key to activate.
4. Handling user input errors (empty city, invalid city names).

## 7. Conclusion
This project successfully demonstrates:
1. Fetching real-time weather data.
2. Implementing CRUD operations on the frontend.
3. Managing UI updates in real-time.
4. Integrating APIs in a web application.