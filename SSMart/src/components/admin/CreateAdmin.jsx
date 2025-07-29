import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const CreateAdmin = () => {
  const { currentUser, isAdmin } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const createFirstAdmin = async () => {
    if (!currentUser) {
      setMessage('Please log in first');
      return;
    }

    setLoading(true);
    try {
      // Set the current user as admin
      await setDoc(doc(db, 'users', currentUser.uid), {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName || '',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setMessage('Success! You are now an admin. Please refresh the page.');
    } catch (error) {
      console.error('Error creating admin:', error);
      setMessage('Error creating admin: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin()) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-green-600 mb-4">✅ You are already an admin!</h1>
        <p className="text-gray-600">You have admin privileges and can access all admin features.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create First Admin</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-600 mb-4">
          This will promote your current user account to admin role. 
          Only do this if you want to make yourself an administrator.
        </p>
        
        <button
          onClick={createFirstAdmin}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Creating Admin...' : 'Make Me Admin'}
        </button>
      </div>
    </div>
  );
};

export default CreateAdmin; 