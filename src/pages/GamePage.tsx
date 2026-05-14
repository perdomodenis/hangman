import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import words from '../wordList.json';
import HangmanDraw from '../component/HangmanDraw';
import HangmanWord from '../component/HangmanWord';
import Keyboard from '../component/Keyboard';
import { toast } from 'react-hot-toast';

export function GamePage() {
  const { token, user } = useAuth();
  const [wordToGuess, setWordToGuess] = useState(() => {
    return words[Math.floor(Math.random() * words.length)];
  });

  const [guessLetters, setGuessLetters] = useState<string[]>([]);
  const [gameId, setGameId] = useState<number | null>(null);

  // Game logic
  const incorrectLetters = guessLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );

  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess
    .split('')
    .every((letter) => guessLetters.includes(letter));

  /**
   * Startet neues game auf backend
   * Wird gerufen wenn die Komponente geladen wird und ein token vorhanden ist
   */
  useEffect(() => {
    async function initializeGame() {
      try {
        const response = await fetch('http://localhost:5000/api/game/new', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to start game');
        }

        const data = await response.json();
        setGameId(data.gameId);
        toast.success('New game started!');
      } catch (error) {
        toast.error('Failed to initialize game');
      }
    }

    if (token) {
      initializeGame();
    }
  }, [token]);

  /**
   * sendet erratenene buchstaben zu backend
   */
  const addGuessLetter = useCallback(
    async (letter: string) => {
      if (guessLetters.includes(letter)) return;
      if (isLoser || isWinner) return;

      setGuessLetters((currentLetters) => [...currentLetters, letter]);

      // Save guess to backend
      if (gameId && token) {
        try {
          const response = await fetch('http://localhost:5000/api/game/guess', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameId, letter }),
          });

          if (!response.ok) {
            toast.error('Failed to save guess');
          }
        } catch (error) {
          console.error('Error saving guess:', error);
        }
      }
    },
    [guessLetters, isLoser, isWinner, gameId, token]
  );

  // Keyboard event handler (Gleich wie vorhin, aber mit useCallback optimiert)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;

      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessLetter(key);
    };

    document.addEventListener('keypress', handler);

    return () => {
      document.removeEventListener('keypress', handler);
    };
  }, [addGuessLetter]);

  // Win/Loss anzeige
  useEffect(() => {
    if (isWinner) {
      toast.success('🎉 You won!', { duration: 5000 });
    }
  }, [isWinner]);

  useEffect(() => {
    if (isLoser) {
      toast.error(`You lost! Word was: ${wordToGuess}`, { duration: 5000 });
    }
  }, [isLoser, wordToGuess]);

  return (
    <div className='font-adlam max-w-3xl flex items-center flex-col gap-8 mx-auto pt-12'>
      <p className='text-gray-700'>Playing as: {user?.username}</p>
      <HangmanDraw numberOfGuess={incorrectLetters.length} />
      <HangmanWord
        result={isLoser}
        guessLetters={guessLetters}
        wordToGuess={wordToGuess}
      />
      <div className='self-stretch'>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetter={guessLetters.filter((letter) =>
            wordToGuess.includes(letter)
          )}
          inactiveLetter={incorrectLetters}
          addGuessLetter={addGuessLetter}
        />
      </div>
    </div>
  );
}