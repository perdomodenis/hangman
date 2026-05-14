import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

export function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await register(username, email, password, passwordConfirm);
      toast.success('Registration successful! Redirecting to game...');
      window.location.href = '/game';
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-md mx-auto mt-10 p-6 border rounded-lg'>
      <h2 className='text-2xl font-bold mb-4'>Register</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className='w-full p-2 border rounded'
        />
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
          placeholder='Password (min 8 chars)'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='w-full p-2 border rounded'
        />
        <input
          type='password'
          placeholder='Confirm Password'
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
          className='w-full p-2 border rounded'
        />
        <button
          type='submit'
          disabled={isLoading}
          className='w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400'
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}