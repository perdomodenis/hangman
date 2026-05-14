import React, { useCallback, useEffect, useMemo, useState } from 'react';
import words from './wordList.json';
import HangmanDraw from './component/HangmanDraw.js';
import HangmanWord from './component/HangmanWord.js';
import Keyboard from './component/Keyboard.js';
import { Toaster, toast } from 'react-hot-toast';


const DIFFICULTY_LEVELS = ['einfach', 'mittel', 'schwer'] as const;
type Difficulty = (typeof DIFFICULTY_LEVELS)[number];

const ToasterComponent = Toaster as unknown as React.ComponentType;

const getWordsByDifficulty = (difficulty: Difficulty) => {
  if (difficulty === 'einfach') {
    return words.filter(word => word.length <= 5);
  }

  if (difficulty === 'mittel') {
    return words.filter(word => word.length >= 6 && word.length <= 8);
  }

  return words.filter(word => word.length >= 9);
};

const getRandomWord = (difficulty: Difficulty) => {
  const filteredWords = getWordsByDifficulty(difficulty);
  return filteredWords[Math.floor(Math.random() * filteredWords.length)] ?? words[0];
};

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('einfach');
  const [wordToGuess, setWordToGuess] = useState<string>(() => getRandomWord('einfach'));
  const [guessLetters, setGuessLetters] = useState<string[]>([]);

  const incorrectLetters = guessLetters.filter(
    letter => !wordToGuess.includes(letter)
  )

  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess
    .split('')
    .every(letter => guessLetters.includes(letter));

  const addGuessLetter = useCallback((letter: string) => {
    if (guessLetters.includes(letter) || isLoser || isWinner) {
      return;
    }

    setGuessLetters(currentLetters => [...currentLetters, letter]);
  }, [guessLetters, isLoser, isWinner]);

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setGuessLetters([]);
    setWordToGuess(getRandomWord(newDifficulty));
  };

  const currentDifficultyWords = useMemo(
    () => getWordsByDifficulty(difficulty),
    [difficulty]
  );

  // keyboard event handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;

      if (!key.match(/^[a-z]$/)) {
        return;
      }

      e.preventDefault();
      addGuessLetter(key);
    };

    document.addEventListener('keypress', handler);

    return () => {
      document.removeEventListener('keypress', handler);
    };
  }, [addGuessLetter]);

  useEffect(() => {
    if (isWinner) {
      toast('Glückwunsch, du hast gewonnen!', {
        icon: '👏',
        duration: 5000,
      });
    }
  }, [isWinner]);

  useEffect(() => {
    if (isLoser) {
      toast.error('Du hast verloren – wähle eine neue Schwierigkeit oder lade die Seite neu.', {
        duration: 5000,
      });
    }
  }, [isLoser, wordToGuess]);

  return (
    <div className='bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100 via-indigo-100 to-purple-200 h-screen'>
      <div className='font-adlam max-w-3xl flex items-center flex-col gap-8 mx-auto pt-12'>
        <Toaster />
        <div className='flex flex-col items-center gap-3 w-full'>
          <p className='text-sm uppercase tracking-[0.25em] text-gray-600'>Schwierigkeit</p>
          <div className='flex flex-wrap justify-center gap-2'>
            {DIFFICULTY_LEVELS.map(level => (
              <button
                key={level}
                onClick={() => handleDifficultyChange(level)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${difficulty === level ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-indigo-100'}`}>
                {level}
              </button>
            ))}
          </div>
          <p className='text-xs text-gray-600'>Wörter werden mit steigender Schwierigkeit länger.</p>
          <p className='text-xs text-gray-600'>Aktuell {currentDifficultyWords.length} Wörter verfügbar.</p>
        </div>
        <HangmanDraw numberOfGuess={incorrectLetters.length} />
        <HangmanWord
          result={isLoser}
          guessLetters={guessLetters}
          wordToGuess={wordToGuess}
        />
        <div className='self-stretch'>
          <Keyboard
            disabled={isWinner || isLoser}
            activeLetter={guessLetters.filter(letter => wordToGuess.includes(letter))}
            inactiveLetter={incorrectLetters}
            addGuessLetter={addGuessLetter}
          />
        </div>
      </div>
    </div>
  )
}

export default App