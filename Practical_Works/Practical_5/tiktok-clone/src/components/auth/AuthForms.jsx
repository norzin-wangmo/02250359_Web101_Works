"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/authContext";

export default function AuthForms({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
        toast.success("Login successful!");
      } else {
        await register({
          email: form.email,
          password: form.password,
          username: form.username,
        });
        toast.success("Registration successful!");
      }
      setForm({ email: "", password: "", username: "" });
      onClose();
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Error";
      toast.error(message);
    } finally {
      setLoading(false);
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
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded"
          required
        />

        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="border p-2 rounded"
            required
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Loading..." : isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p className="mt-3 text-sm">
        {isLogin ? "No account?" : "Already have account?"}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setForm({ email: "", password: "", username: "" });
          }}
          className="text-blue-500 ml-2"
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}