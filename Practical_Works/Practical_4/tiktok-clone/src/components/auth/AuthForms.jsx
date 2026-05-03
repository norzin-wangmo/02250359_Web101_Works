"use client";

import { useState } from "react";
import api from "../../lib/api-config";
import toast from "react-hot-toast";

export default function AuthForms({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isLogin ? "/auth/login" : "/auth/register";
      const res = await api.post(url, form);

      localStorage.setItem("token", res.data.token);
      toast.success("Success!");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {isLogin ? "Login" : "Register"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          className="border p-2"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-black text-white p-2 rounded">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p className="mt-3 text-sm">
        {isLogin ? "No account?" : "Already have account?"}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 ml-2"
        >
          Switch
        </button>
      </p>
    </div>
  );
}