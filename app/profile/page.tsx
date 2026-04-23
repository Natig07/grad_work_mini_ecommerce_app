'use client';

import { useState, useEffect } from 'react';

type User = {
  fullName: string;
  email: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User>({
    fullName: '',
    email: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('user', JSON.stringify(user));
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-500">Full Name</label>
          {isEditing ? (
            <input
              className="w-full border p-2 rounded"
              value={user.fullName}
              onChange={(e) =>
                setUser({ ...user, fullName: e.target.value })
              }
            />
          ) : (
            <p className="text-lg">{user.fullName || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-500">Email</label>
          {isEditing ? (
            <input
              className="w-full border p-2 rounded"
              value={user.email}
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
            />
          ) : (
            <p className="text-lg">{user.email || 'Not set'}</p>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}