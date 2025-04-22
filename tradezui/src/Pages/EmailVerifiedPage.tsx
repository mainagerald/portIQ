import React from 'react';

/**
 * EmailVerifiedPage: Shown after user clicks the verification link in their email.
 * You can route here after successful verification.
 */
const EmailVerifiedPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Email Verified!</h2>
      <p className="mb-4">Your email has been successfully verified. You can now log in.</p>
      <a href="/login" className="text-blue-600 hover:underline">Go to Login</a>
    </div>
  );
};

export default EmailVerifiedPage;
