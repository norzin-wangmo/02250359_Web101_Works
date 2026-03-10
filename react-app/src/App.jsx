import "./App.css";
import ProfileCard from "./components/ProfileCard";
import Profile from "./assets/Profile.jpeg";

function App() {

  const skills = ["React", "JavaScript", "CSS", "HTML"];

  return (
    <div className="app">
      <ProfileCard
        name="Norzin Wangmo"
        role="Software Engineer"
        location="Thimphu, Bhutan"
        image={Profile}
        skills={skills}
      />
    </div>
  );
}

export default App;