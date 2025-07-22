import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import appwriteService from '../appwrite/serviceConfig';
import { restoreSession } from '../Store/authSlice';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = await appwriteService.getCurrentUser();
        if (userData) {
          const cartData = await appwriteService.getUserCart(userData.$id);
          dispatch(restoreSession({
            userData,
            cartId: cartData.$id
          }));
        } else {
          dispatch(restoreSession(null));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        dispatch(restoreSession(null));
      }
    };

    initializeAuth();
  }, [dispatch]);

  return children;
};

export default AuthInitializer;