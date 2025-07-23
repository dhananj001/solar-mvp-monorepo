import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('/api/auth/register', { email, password });
      localStorage.setItem('token', res.data.token);
      setMessage('Registration successful');
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error registering');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <Card className="max-w-md w-full rounded-3xl shadow-xl bg-white border border-gray-200">
        <CardHeader className="pb-4 border-b border-gray-200">
          <CardTitle className="text-2xl font-semibold text-gray-900 text-center">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-gray-800 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="owner@solar.com"
                className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                autoComplete="email"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-gray-800 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                autoComplete="new-password"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition font-semibold rounded-xl shadow-lg"
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>

          {message && (
            <p
              className={cn(
                'mt-4 text-center text-sm select-none transition-colors',
                message.toLowerCase().includes('error')
                  ? 'text-red-600'
                  : 'text-green-600'
              )}
              role="alert"
            >
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-gray-700">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-semibold transition underline-offset-2 hover:underline"
            >
              Login
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
