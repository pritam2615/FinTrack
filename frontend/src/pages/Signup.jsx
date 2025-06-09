import { useState } from "react";
import AuthFormWrapper from "../components/AuthFormWrapper";

export default function Signup() {
  const [form, setForm] = useState({ userName: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <AuthFormWrapper title="Signup to FinTrack">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={form.userName}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

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
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          Sign Up
        </button>
        
      </form>
    </AuthFormWrapper>
  );
}
