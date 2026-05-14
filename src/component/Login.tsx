import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      window.location.href = '/game';
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-md mx-auto mt-10 p-6 border rounded-lg'>
      <h2 className='text-2xl font-bold mb-4'>Login</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='w-full p-2 border rounded'
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='w-full p-2 border rounded'
        />
        <button
          type='submit'
          disabled={isLoading}
          className='w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400'
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}