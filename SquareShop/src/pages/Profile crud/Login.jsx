import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../appwrite/auth';
import service from '../../appwrite/serviceConfig';
import Button from "../../components/Button";
import Input from '../../components/Input';
import Logo from '../../components/Logo';
import { login as authLogin } from '../../Store/authSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [authMethod, setAuthMethod] = useState('password');
  const [otpSent, setOtpSent] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = watch('email') || '';

  const login = async (data) => {
    if (isSubmitting) return;
    setError('');
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (authMethod === 'password') {
        result = await authService.login(data);
      } else if (authMethod === 'otp' && otpSent) {
        const session = await authService.verifyOTP(otpData.userId, data.otp);
        const userData = await authService.getCurrentUser();
        result = { session, user: userData };
      }

      if (result?.user) {
        dispatch(authLogin({ status: true, userData: result.user }));
        
        // Handle guest cart merge
        const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
        if (guestCart.length > 0) {
          try {
            const userCartDoc = await service.getUserCart(result.user.id);
            const userCart = JSON.parse(userCartDoc?.items || '[]');
            
            dispatch({
              type: "MERGE_CARTS",
              payload: { userCart, guestCart }
            });
            
            localStorage.removeItem('guestCart');
          } catch (mergeError) {
            console.error("Cart merge failed:", mergeError);
          }
        }
        
        navigate('/');
      }
    } catch (error) {
      setError(error.message);
      if (authMethod === 'otp') {
        setOtpSent(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOTP = async () => {
    if (!email) return setError('Please enter your email');
    if (isSubmitting) return;
    
    setError('');
    setIsSubmitting(true);
    
    try {
      const response = await authService.sendOTP(email);
      setOtpData({
        userId: response.userId,
        phrase: response.phrase
      });
      setOtpSent(true);
      setError(`✅ OTP sent! Security phrase: ${response.phrase}`);
    } catch (error) {
      setError(`Failed to send OTP: ${error.message}`);
    } finally {
      setIsSubmitting(false);
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
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign Up
          </Link>
        </p>

        {/* Auth Method Toggle */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('password');
              setOtpSent(false);
              setError('');
            }}
            className={`px-4 py-2 rounded-l ${authMethod === 'password' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('otp');
              setOtpSent(false);
              setError('');
            }}
            className={`px-4 py-2 rounded-r ${authMethod === 'otp' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
          >
            Email OTP
          </button>
        </div>

        {error && (
          <p className={`mt-4 text-center ${error.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {error}
          </p>
        )}

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
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Invalid email address"
                }
              })}
              error={errors.email?.message}
            />

            {authMethod === 'password' && (
              <Input
                label="Password:"
                type="password"
                placeholder="Enter your password"
                {...register('password', {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  }
                })}
                error={errors.password?.message}
              />
            )}

            {authMethod === 'otp' && otpSent && (
              <>
                <Input
                  label="OTP Code:"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  {...register('otp', {
                    required: "OTP is required",
                    minLength: {
                      value: 6,
                      message: "OTP must be 6 digits"
                    },
                    maxLength: {
                      value: 6,
                      message: "OTP must be 6 digits"
                    }
                  })}
                  error={errors.otp?.message}
                />
                {otpData?.phrase && (
                  <p className="text-sm text-gray-600">
                    Security phrase: <span className="font-bold">{otpData.phrase}</span>
                  </p>
                )}
              </>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 
                authMethod === 'otp' ? 
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