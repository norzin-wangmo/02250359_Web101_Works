"use client";

import { useEffect, useState } from "react";
import { getUsers, followUser } from "../../services/userService";

export default function ExploreUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getUsers();
      setUsers(data);
    };
    load();
  }, []);

  return (
    <div>
      <h1>Explore Users</h1>

      {users.map((u) => (
        <div key={u.id} className="border p-2 mb-2">
          <p>{u.email}</p>
          <button onClick={() => followUser(u.id)}>Follow</button>
        </div>
      ))}
    </div>
  );
}