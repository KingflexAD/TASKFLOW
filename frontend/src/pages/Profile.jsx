import React, { useEffect, useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

export default function Profile({ currentUser, setCurrentUser, onLogout }) {
  const [profile, setProfile] = useState(currentUser);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/user/me');
        setProfile(res.data.user);
      } catch (err) {
        toast.error('Could not fetch profile');
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await api.put('/api/user/profile', profile);
      setCurrentUser(res.data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-50">
        <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
        <div className="mt-4 space-y-3">
          <input
            type="text"
            value={profile.name || ''}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full border rounded p-2"
          />
          <input
            type="email"
            value={profile.email || ''}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full border rounded p-2"
          />
          <div className="flex gap-2">
            <button onClick={handleUpdate} className="px-3 py-2 bg-purple-600 text-white rounded-full">Update</button>
            <button onClick={onLogout} className="px-3 py-2 bg-red-500 text-white rounded-full">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
