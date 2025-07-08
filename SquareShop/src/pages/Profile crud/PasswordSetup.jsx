// components/PasswordSetup.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../appwrite/auth';
import { Button, Input } from './index';

export default function PasswordSetup() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordExists, setPasswordExists] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPassword = async () => {
      try {
        const exists = await authService.checkPasswordExist();
        setPasswordExists(exists);
        if (exists) {
          navigate('/profile'); // Redirect if password already exists
        }
      } catch (error) {
        setError('Failed to check password status',error);
      }
    };
    checkPassword();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await authService.setInitialPassword(password, confirmPassword);
      navigate('/profile?message=password_set_success');
    } catch (error) {
      setError(error.message || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  if (passwordExists === null) {
    return <div>Loading...</div>;
  }

  if (passwordExists) {
    return null; // Will redirect from useEffect
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Set Your Password</h2>
      <p className="mb-6">Please set a password for your account for future logins.</p>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="8"
          />
        </div>
        <div className="mb-6">
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength="8"
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Setting Password...' : 'Set Password'}
        </Button>
      </form>
    </div>
  );
}