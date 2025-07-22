import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../appwrite/auth';
import { login as authLogin } from '../Store/authSlice';
import { Button, Input, Logo } from './index';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, watch } = useForm();
  const [error, setError] = useState('');
  const [authMethod, setAuthMethod] = useState('password'); // 'password' or 'otp'
  const [otpSent, setOtpSent] = useState(false);
  const [otpData, setOtpData] = useState(null); // Stores userId and security phrase
  const email = watch('email') || '';

  const login = async (data) => {
    setError('');
    try {
      let session;
      if (authMethod === 'password') {
        session = await authService.login(data);
      } else if (authMethod === 'otp') {
        // Use the userId from otpData state
        session = await authService.verifyOTP(otpData.userId, data.otp);
      }

      if (session) {
        const userData = await authService.getCurrentUser();
        dispatch(authLogin({ status: true, userData }));
        navigate('/edit-profile');
      }
    } catch (error) {
      setError(error.message || 'Authentication failed');
    }
  };

  const handleSendOTP = async () => {
    if (!email) return setError('Please enter your email');
    setError('');
    try {
      const response = await authService.sendOTP(email);
      setOtpData({
        userId: response.userId, // Store the actual user ID
        phrase: response.phrase
      });
      setOtpSent(true);
      setError(`✅ OTP sent! Security phrase: ${response.phrase}`);
    } catch (error) {
      setError('Failed to send OTP: ' + (error.message || 'Please try again'));
    }
  };

  return (
    <div className='flex items-center justify-center w-full'>
      <div className='mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10'>
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have an account?&nbsp;
          
        </p>

        {/* Authentication Method Toggle */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('password');
              setOtpSent(false);
            }}
            className={`px-4 py-2 rounded-l ${authMethod === 'password' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
          >
            <Link
            to="/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('otp');
              setOtpSent(false);
            }}
            className={`px-4 py-2 ${authMethod === 'otp' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
          >
            Email OTP
          </button>
        </div>

        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

        <form
          onSubmit={authMethod === 'otp' && otpSent ? 
            handleSubmit(login) : 
            (e) => {
              e.preventDefault();
              authMethod === 'otp' ? handleSendOTP() : handleSubmit(login)();
            }
          }
          className='mt-6'
        >
          <div className='space-y-5'>
            <Input
              label="Email:"
              placeholder="Enter your email"
              type="email"
              {...register('email', {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    'Email address must be valid',
                }
              })}
            />

            {authMethod === 'password' && (
              <Input
                label="Password:"
                type="password"
                placeholder="Enter your password"
                {...register('password', {
                  required: true,
                })}
              />
            )}

            {authMethod === 'otp' && otpSent && (
              <>
                <Input
                  label="OTP Code:"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  {...register('otp', {
                    required: true,
                    minLength: 6,
                    maxLength: 6
                  })}
                />
                {otpData?.phrase && (
                  <p className="text-sm text-gray-600">
                    Security phrase: <span className="font-bold">{otpData.phrase}</span>
                  </p>
                )}
              </>
            )}

            <Button type="submit" className="w-full">
              {authMethod === 'otp' ? 
                (otpSent ? 'Verify OTP' : 'Send OTP') : 
                'Sign in'
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;