'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function RunnerAuthPage() {
  const router = useRouter();
  const [runnerCode, setRunnerCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if runner is already logged in
    const savedRunnerId = localStorage.getItem('stadium-eats-runner-id');
    if (savedRunnerId) {
      router.push('/runner/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Mock authentication - in real app, this would validate against backend
      const response = await fetch('/api/runner/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ runnerCode }),
      });

      if (response.ok) {
        const { runnerId } = await response.json();
        localStorage.setItem('stadium-eats-runner-id', runnerId);
        router.push('/runner/dashboard');
      } else {
        setError('Invalid runner code. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Demo login with a mock runner
    localStorage.setItem('stadium-eats-runner-id', 'runner1');
    router.push('/runner/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-primary">Runner Portal</h2>
          <p className="mt-2 text-gray-600">
            Sign in to start delivering orders
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="runnerCode" className="block text-sm font-medium text-gray-700 mb-2">
                Runner Code or QR
              </label>
              <div className="relative">
                <input
                  id="runnerCode"
                  name="runnerCode"
                  type="text"
                  required
                  value={runnerCode}
                  onChange={(e) => setRunnerCode(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter your runner code"
                />
                <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Enter the code provided by your supervisor or scan your QR code
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="spinner w-5 h-5 mr-2"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleDemoLogin}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
              >
                Try Demo Mode
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact your supervisor or{' '}
            <a href="/contact" className="text-accent hover:text-accent/80">
              support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
