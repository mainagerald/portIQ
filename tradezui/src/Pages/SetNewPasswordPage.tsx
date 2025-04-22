import React, { useState } from 'react';
import { API_BASE_URL } from '@/utils/api';

/**
 * SetNewPasswordPage: Handles setting a new password after clicking the reset link in email.
 * Expects uidb64 and token as URL params.
 */
const SetNewPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Extract uidb64 and token from URL
  const params = new URLSearchParams(window.location.search);
  const uidb64 = params.get('uidb64');
  const token = params.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE_URL}/auth/reset-password-confirm/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uidb64, token, password }),
      });
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.detail || 'Password reset failed');
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-700">Password Reset!</h2>
        <p className="mb-4">Your password has been reset. You can now log in.</p>
        <a href="/login" className="text-blue-600 hover:underline">Go to Login</a>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Set New Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">New Password</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Confirm Password</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Set New Password'}
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default SetNewPasswordPage;
