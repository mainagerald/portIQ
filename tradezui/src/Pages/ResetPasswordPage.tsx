import React, { useState } from 'react';
import { API_BASE_URL } from '@/utils/api';

/**
 * ResetPasswordPage: Handles password reset request (sends reset link to email).
 * Shows a 'check your email' screen after successful request.
 */
const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE_URL}/auth/reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.detail || 'Reset failed');
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
        <h2 className="text-2xl font-bold mb-4">Check your email</h2>
        <p className="mb-4">We've sent a password reset link to <span className="font-semibold">{email}</span>.</p>
        <p className="text-gray-500">Follow the link to set a new password.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
      <div className="text-center mt-4">
        <a href="/login" className="text-blue-600 hover:underline">Back to Login</a>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
