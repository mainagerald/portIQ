import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { loginStart, loginSuccess, loginFailure } from '@/redux/slices/authSlice';
import { API_BASE_URL } from '@/utils/api';
import { Button } from '@/components/ui/button';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Handle form login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      // Send credentials to backend (credentials: 'include' for httpOnly cookies)
      const resp = await fetch(`${API_BASE_URL}/auth/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important for httpOnly cookies!
        body: JSON.stringify({ username, password }),
      });
      if (!resp.ok) throw new Error('Invalid credentials');
      // Backend sets httpOnly cookie, return user info in body (recommended)
      const data = await resp.json();
      dispatch(loginSuccess(data.user)); // user: {id, username, email, roles, ...}
      // Redirect or show success (not implemented here)
    } catch (err: any) {
      dispatch(loginFailure(err.message));
    }
  };

  // TODO: Google login modal logic

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Username</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
      <div className="my-6 text-center">
        {/* Google login button/modal would go here */}
        <button className="bg-red-500 text-white px-4 py-2 rounded mt-2">Login with Google</button>
      </div>
      <div className="text-center">
        <a href="/register" className="text-blue-600 hover:underline">Don't have an account? Register</a>
      </div>
      <div className="text-center mt-2">
        <a href="/reset-password" className="text-blue-600 hover:underline">Forgot password?</a>
      </div>
    </div>
  );
};

export default LoginPage;
