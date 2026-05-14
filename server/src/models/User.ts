import pool from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1d';

export interface IUser {
    id?: number;
    username: string;
    email: string;
    password: string;
    created_at?: Date;
}

export class User {
  /**
   * Hash eines einfachen password mit bcrypt
   * Nie einfache passwords speichern in Database
   */
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);  //10 runden hashing
    return bcrypt.hash(password, salt);
    }

    /**
     * Vergleicht ein eingegebenes password mit einem gehashten password
     * Wird benutzt beim login um zu überprüfen ob das eingegebene password korrekt ist
     */
    static async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * Generiert ein JWT token nach erfolgreichem login
     */
    static generateToken(userID: number, email: string, username: string): string {
        return jwt.sign(
            { id: userID, email, username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );
    }

    /**
     * Erstellt einen neuen User in der Database
     * user object wird zurückgegeben ohne password hash
     */
  static async create(username: string, email: string, password: string) {
    const hashedPassword = await this.hashPassword(password);

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id, username, email, created_at`,
      [username, email, hashedPassword]
    );

    return result.rows[0];
  }

  /**
   * Findet user mit email in der Database
   */
    static async findByEmail(email: string) {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    /**
     * Findet user mit Username in der Database
     */
    static async findByUsername(username: string) {
        consr result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        return result.rows[0];
    }

    /**
     * Findet user via ID in der Database (genutzt nach token verifizierung)
     */
    static async findByID(id: number) {
        const result = await pool.query(
            'SELECT id, username, email, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

}