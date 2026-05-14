import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

//Kreiert connection Pool zu PostgreSQL Datenbank
const pool = new Pool({
     user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
});

//Exportiert pool für den nutzen in anderen files in der Anwendung
export default pool;

/**Inizialisiert database wenn diese nicht existiert
 *das hier wird aufgerufen wenn server startup
 */
export async function initializeDatabase() {
    const client = await pool.connect();
   try {
    // Kreiert user table mit authentifizierungs feldern
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Kreiert indexes für schnellere suche 
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `);

    //Generiert Game session table um die game statistiken zu speichern
    await client.query(`
       CREATE TABLE IF NOT EXISTS game_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        word VARCHAR(100) NOT NULL,
        guessed_letters VARCHAR(26),
        wrong_guesses INTEGER DEFAULT 0,
        won BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON game_sessions(user_id);
    `);

    console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    } finally {
        client.release();
    }
}