import { Request, Response } from 'express';
import { User } from '../models/User';


export async function register(req: Request, res: Response) {
  try {
    const { username, email, password, passwordConfirm } = req.body;

    // Validation: Prüft ob alle Felder ausgefüllt sind
    if (!username || !email || !password || !passwordConfirm) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validation: Passwords match
    if (password !== passwordConfirm) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Validation: Passwort ist stark
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user in database
    const newUser = await User.create(username, email, password);

    // Generate token immediately after registration (auto-login)
    const token = User.generateToken(newUser.id, newUser.email, newUser.username);

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to register user' });
  }
}


export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Validations funktion
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // sucht user via email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Prüft passwort mit bcrypt
    const isValidPassword = await User.comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generiert token
    const token = User.generateToken(user.id, user.email, user.username);

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Failed to login' });
  }
}

/**
 * POST /api/auth/me
 * Hohlt die aktuelle eingeloggte Benutzerinformation (braucht token)
 * wird genutzt zur wiederherstellung der Benutzersession bei Seitenreload
 */
export async function getMe(req: Request, res: Response) {
  try {

    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await User.findById(req.user.id);
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get user info' });
  }
}

/**
 * Frontend kümmert sich um logout in dem es token von dem localStorage entfernt
 * Dieser endpoint kann benutzt werden zum blacklisting von Tokens wenn nötog (optional)
 */
export async function logout(req: Request, res: Response) {
  return res.json({ message: 'Logout successful' });
}