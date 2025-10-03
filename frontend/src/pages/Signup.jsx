import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { UserPlus, Mail, Lock } from 'lucide-react';

const fields = [
  { name: 'name', type: 'text', placeholder: 'Full name', icon: UserPlus },
  { name: 'email', type: 'email', placeholder: 'you@example.com', icon: Mail },
  { name: 'password', type: 'password', placeholder: 'Password', icon: Lock },
];

export default function Signup({ onSubmit }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/user/register', form);
      onSubmit(res.data); // Pass data to App.jsx -> handleAuthSubmit
      toast.success('Registration successful');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white shadow-lg border border-purple-50 rounded-xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white mb-3">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create account</h2>
          <p className="text-sm text-gray-500 mt-1">Join TaskFlow to manage your tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ name, type, placeholder, icon: Icon }) => (
            <div key={name} className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2">
              <Icon className="w-5 h-5 text-purple-500" />
              <input
                required
                name={name}
                type={type}
                placeholder={placeholder}
                value={form[name]}
                onChange={(e) => setForm(f => ({ ...f, [name]: e.target.value }))}
                className="w-full bg-transparent outline-none text-sm text-gray-700"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded-full text-sm font-medium"
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account? <button type="button" className="text-purple-600 font-medium" onClick={() => navigate('/login')}>Log in</button>
          </p>
        </form>
      </div>
    </div>
  );
}
