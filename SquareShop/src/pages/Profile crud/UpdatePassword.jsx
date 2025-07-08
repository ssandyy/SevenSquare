// PasswordManager.jsx
import { useEffect, useState } from 'react';
import authService from '../../appwrite/auth';
import { Button, Input } from '../../components';

export default function UpdatePassword() {
  const [formData, setFormData] = useState({
    new: '',
    confirm: ''
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordExists, setPasswordExists] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ error: '', success: '' });

  useEffect(() => {
    const verifyAccountType = async () => {
      try {
        const exists = await authService.checkPasswordExists();
        setPasswordExists(exists);
      } catch (error) {
        setStatus({ error: `Couldn't verify your account status ${error}`});
      } finally {
        setLoading(false);
      }
    };
    verifyAccountType();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ error: '', success: '' });

    try {
      if (passwordExists) {
        // Existing password change flow
        await authService.changePassword(formData.new, currentPassword);
        setStatus({ success: 'Password changed successfully!' });
      } else {
        // First-time password setup flow
        await authService.setInitialPassword(formData.new, formData.confirm);
        setStatus({ 
          success: 'Password set successfully! You can now login with your password.' 
        });
        setPasswordExists(true); // Update state after setting password
      }
      
      // Reset form
      setCurrentPassword('');
      setFormData({ new: '', confirm: '' });
    } catch (error) {
      setStatus({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">Checking your account...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {passwordExists ? 'Change Password' : 'Set Your Password'}
      </h2>

      {passwordExists && (
        <p className="mb-6 text-gray-600 text-center">
          Please enter your current password and a new one
        </p>
      )}

      {!passwordExists && (
        <p className="mb-6 text-gray-600 text-center">
          Since you logged in via OTP, please set a password for future logins
        </p>
      )}

      {status.error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {status.error}
        </div>
      )}

      {status.success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {status.success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {passwordExists && (
          <div className="mb-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
        )}

        <div className="mb-4">
          <Input
            label="New Password"
            type="password"
            value={formData.new}
            onChange={(e) => setFormData({...formData, new: e.target.value})}
            required
            minLength="8"
          />
        </div>

        <div className="mb-6">
          <Input
            label="Confirm New Password"
            type="password"
            value={formData.confirm}
            onChange={(e) => setFormData({...formData, confirm: e.target.value})}
            required
            minLength="8"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Processing...' : passwordExists ? 'Update Password' : 'Set Password'}
        </Button>
      </form>
    </div>
  );
}