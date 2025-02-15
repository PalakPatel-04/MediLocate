import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope as Hospital, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import "tailwindcss";

export function Navigation() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-2">
              <Hospital className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">MediLocate</span>
            </Link>
          </div>
          <div className='flex items-center gap-6'>
            {user && (
              <span className="text-gray-600 text-sm ">
                {user.user_metadata?.name || user.email}
              </span>
            )}
            <div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:cursor-pointer"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
