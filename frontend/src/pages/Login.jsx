import { useState } from "react";
import AuthFormWrapper from "../components/AuthFormWrapper";
import axiosInstance from "../services/axiosInstance";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    try {
    const res = await axiosInstance.post("/api/user/login", {
      email: form.email,
      password: form.password,
    });

    console.log("Logged in user:", res.data);
  } catch (err) {
    console.error("Login failed:", err.response?.data?.message);
  }
  };

  return (
    <AuthFormWrapper title="Login to FinTrack">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </AuthFormWrapper>
  );
}
