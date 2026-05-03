"use client";

import { useEffect, useState } from "react";
import { getUserProfile } from "../../../services/userService";

export default function Profile({ params }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getUserProfile(params.userId);
      setUser(data);
    };
    load();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>{user.email}</h1>
      <p>User profile page</p>
    </div>
  );
}