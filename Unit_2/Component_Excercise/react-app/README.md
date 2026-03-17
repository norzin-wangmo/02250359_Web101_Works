# React Profile Card Assignment

## Overview
This project is a **Profile Card component built using React**. The component displays a user's:

- Profile picture
- Name
- Role/Job title
- Location
- Skills
- Like button with counter

It demonstrates key React concepts such as **components, props, state, and styling with CSS**. It also includes a hover effect on the profile picture and an interactive like button.

---

## Features Implemented

- Dynamic rendering of **name, role, location, and skills** using props
- Interactive **like button** using React state
- Hover effect on **profile image border**
- Fully styled **profile card** with CSS

---

## Installation and Running

1. Clone the repository:
 git clone <your-repo-link>

2. Navigate to the project folder:
cd react-app
Install dependencies:
npm install

3. Start the development server:
npm run dev

4. Open the browser at the URL shown in the terminal (usually http://localhost:5173).

## Project Structure
react-app/
├── src/
│   ├── assets/
│   │   └── Profile.jpeg       # Profile image
│   ├── components/
│   │   ├── ProfileCard.jsx     # ProfileCard component
│   │   └── ProfileCard.css     # Component styling
│   ├── App.jsx                 # Main app where component is used
│   └── App.css                 # App-level styling
├── package.json
└── vite.config.js

## Problems Faced and Solutions
### Duplicate Imports and Function Definition
**Problem:** Two App functions and repeated imports caused parsing errors.  
**Solution:** Kept only one App function and cleaned duplicate imports.

### Image Not Displaying
**Problem:** File path or name mismatch prevented the profile picture from loading.  
**Solution:** Made sure the import path exactly matches the file name:  
```javascript
import Profile from "./assets/Profile.jpeg";
```
### Live Updates Not Working
**Problem:** Changes in App.jsx did not reflect in the browser.  
**Solution:** Ensured the terminal is running in the project folder (react-app) and saved changes to trigger hot reload.

## How It Was Done
1. Created a React project using Vite:
```bash
npm create vite@latest react-app -- --template react
```
2. Created the ProfileCard component (ProfileCard.jsx) and added styling (ProfileCard.css).
3. Passed data (name, role, location, skills, image) from App.jsx using props.
4. Implemented like button functionality using React state (useState).
5. Added hover effect on profile image using CSS.
6. Ran the project and verified it in the browser.

## Future Improvements
- Display multiple profile cards dynamically
- Use Tailwind CSS for advanced styling
- Add animations to likes or hover effects
- Make the component mobile responsive