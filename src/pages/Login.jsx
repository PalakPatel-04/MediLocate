import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Toaster, toast } from 'react-hot-toast';
import "tailwindcss";

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to connect to authentication service');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Animated background elements */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-100 rounded-full opacity-50 mix-blend-multiply animate-blob"></div>
      <div className="absolute top-1/2 -right-20 w-72 h-72 bg-purple-100 rounded-full opacity-50 mix-blend-multiply animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/4 w-64 h-64 bg-pink-100 rounded-full opacity-50 mix-blend-multiply animate-blob animation-delay-4000"></div>

      <div className="relative max-w-md w-full px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col items-center">
            {/* Logo Container */}
            <div className="mb-8 p-4 bg-blue-600 rounded-full transform transition-all duration-500 hover:scale-110">
              <Stethoscope className="h-12 w-12 text-white" strokeWidth={2} />
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
              Welcome to
              <span className="block text-blue-600 mt-2">MediLocate</span>
            </h1>
            <p className="text-gray-600 mb-8 text-center text-lg">
            Find nearby hospitals instantly
            </p>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-4 px-6 py-4 border-2 border-gray-200 rounded-xl shadow-sm bg-white text-gray-700 
                         hover:border-blue-500 hover:text-blue-600 hover:shadow-md hover:cursor-pointer transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
              ) : (
                <>
                  <svg 
                    className="h-6 w-6 group-hover:scale-110 transition-transform"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="text-lg font-semibold">
                    {isLoading ? 'Signing in...' : 'Continue with Google'}
                  </span>
                </>
              )}
            </button>

            {/* Additional Text */}
            <p className="mt-8 text-center text-sm text-gray-500">
              By continuing, you agree to our
              <br />
              <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}