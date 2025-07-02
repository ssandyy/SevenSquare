import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login } from '../Store/authSlice';
import authService from '../appwrite/auth';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const verify = async () => {
      try {
        const userId = params.get('userId');
        const secret = params.get('secret');

        if (!userId || !secret) {
          throw new Error('Missing authentication parameters');
        }

        // 1. Verify and create session
        const user = await authService.verifyMagicURLSession(userId, secret);
        
        // 2. Update Redux state
        dispatch(login(user));
        
        // 3. Force hard redirect (bypass React Router)
        window.location.href = '/dashboard'; 
        
      } catch (error) {
        console.error('Authentication failed:', error);
        window.location.href = `/login?error=${encodeURIComponent(error.message)}`;
      }
    };

    verify();
  }, [params, navigate, dispatch]);

  return <div>Completing authentication...</div>;
}