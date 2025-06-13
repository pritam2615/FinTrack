import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthFormWrapper from "../components/AuthFormWrapper";
import axiosInstance from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axiosInstance.post("/api/user/login", {
        email: form.email,
        password: form.password,
      });

      if (res.data.token) {
        login(res.data.token);
        navigate("/");
      } else {
        setError("Login failed. Invalid server response.");
        alert("Login failed. Please try again.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials";
      setError(msg);
      alert(msg); // basic popup. Replace with toast if needed.
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

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Login
        </button>
        <p className="text-sm text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 underline">
            Sign up here
          </a>
        </p>
      </form>
    </AuthFormWrapper>
  );
}
