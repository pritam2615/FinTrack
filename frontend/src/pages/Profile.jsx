import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      {user ? (
        <div className="space-y-4">
          <div><strong>Username:</strong> {user.userName}</div>
          <div><strong>Email:</strong> {user.email}</div>
          {/* Add more fields as needed */}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
