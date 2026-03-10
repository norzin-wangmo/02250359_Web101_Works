import { useState } from "react";
import "./ProfileCard.css";

function ProfileCard({ name, role, image, skills, location }) {

  const [likes, setLikes] = useState(0);

  return (
    <div className="card">

      <img src={image} alt="profile" className="avatar" />

      <h2>{name}</h2>

      <p className="role">{role}</p>

      <p className="location">{location}</p>

      <div className="skills">
        {skills.map((skill, index) => (
          <span key={index} className="skill">{skill}</span>
        ))}
      </div>

      <button className="likeBtn" onClick={() => setLikes(likes + 1)}>
        ❤️ Like {likes}
      </button>

    </div>
  );
}

export default ProfileCard;