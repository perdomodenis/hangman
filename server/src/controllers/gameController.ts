import { Request, Response } from 'express';
import pool from '../config/database';

/**
 * POST /api/game/new
 * Startet eine neue game session für authenticated user
 */
export async function startNewGame(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // TODO: holt ein zufälliges Wort von der word list
    const word = 'example'; // placeholder

    // kreiert game session in database
    const result = await pool.query(
      `INSERT INTO game_sessions (user_id, word, guessed_letters, wrong_guesses)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, word, guessed_letters, wrong_guesses`,
      [req.user.id, word, '', 0]
    );

    return res.status(201).json({
      gameId: result.rows[0].id,
      message: 'New game started',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to start game' });
  }
}

/**
 * POST /api/game/guess
 * macht ein geratene Buchstaben
 */
export async function guessLetter(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { gameId, letter } = req.body;

    if (!gameId || !letter) {
      return res.status(400).json({ error: 'gameId and letter are required' });
    }

    // Fetch game von der database
    const gameResult = await pool.query(
      'SELECT * FROM game_sessions WHERE id = $1 AND user_id = $2',
      [gameId, req.user.id]
    );

    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const game = gameResult.rows[0];

    // TODO: Implementiert game logic (check letter, update guesses, etc.)

    return res.json({ message: 'Letter guessed' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to guess letter' });
  }
}

/**
 * GET /api/game/stats
 * Holt user's game statistiken (wins, losses, etc.)
 */
export async function getStats(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_games,
        SUM(CASE WHEN won = true THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN won = false THEN 1 ELSE 0 END) as losses
       FROM game_sessions
       WHERE user_id = $1`,
      [req.user.id]
    );

    const stats = result.rows[0];

    return res.json({
      totalGames: parseInt(stats.total_games),
      wins: parseInt(stats.wins) || 0,
      losses: parseInt(stats.losses) || 0,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get stats' });
  }
}