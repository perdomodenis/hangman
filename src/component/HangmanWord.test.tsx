import { render, screen } from '@testing-library/react'
import HangmanWord from './HangmanWord'
import '@testing-library/jest-dom'  

describe('HangmanWord', () => {
  // ALL TESTS  GO HERE
 
  it('shows a single guessed letter', () => {
  // given: word is "hello", we guessed "h"
  // when: render component with this guess
  // then: "h" should be visible
  
  render(
    <HangmanWord
      guessLetters={['h']}
      wordToGuess="hello"
    />
  )
  
  expect(screen.getByText('h')).toBeVisible()

})

it('shows multiple guessed letters', () => {
  // given: word is "react", guessed "r", "e", "a"
  // when: render with these guesses
  // then: all three letters show
  
  render(
    <HangmanWord
      guessLetters={['r', 'e', 'a']}
      wordToGuess="react"
    />
  )
  
  expect(screen.getByText('r')).toBeVisible()
  expect(screen.getByText('e')).toBeVisible()
  expect(screen.getByText('a')).toBeVisible()
})

it('hides all letters when nothing is guessed', () => {
  // given: word is "test", guessed nothing
  // when: render with empty guessLetters
  // then: letters should be hidden
  
  render(
    <HangmanWord
      guessLetters={[]}
      wordToGuess="test"
    />
  )
  
  expect(screen.getAllByText('t').length).toBe(0)
  expect(screen.getAllByText('e').length).toBe(0)
})

it('reveals all letters when result is true (player lost)', () => {
  // given: result={true} means player lost
  // when: render with empty guesses but result=true
  // then: ALL letters should appear (showing answer)
  
  render(
    <HangmanWord
      guessLetters={[]}
      wordToGuess="hangman"
      result={true}
    />
  )
  
expect(screen.getAllByText('h').length).toBeGreaterThan(0)
expect(screen.getAllByText('a').length).toBeGreaterThan(0)
expect(screen.getAllByText('n').length).toBeGreaterThan(0)
})

it('shows correct guesses but ignores wrong ones', () => {
  // given: word is "javascript"
  // guessed: "j" (correct), "a" (correct), "x" (wrong)
  // when: render with these guesses
  // then: show j and a, not x
  
  render(
    <HangmanWord
      guessLetters={['j', 'a', 'x']}
      wordToGuess="javascript"
    />
  )
  
  expect(screen.getAllByText('j').length).toBeGreaterThan(0)
expect(screen.getAllByText('a').length).toBeGreaterThan(0)
})

it('handles duplicate letters in the word', () => {
  // given: word is "hello" (has two l's)
  // guessed: "l"
  // when: render
  // then: both l's should show
  
  render(
    <HangmanWord
      guessLetters={['l']}
      wordToGuess="hello"
    />
  )
  
  // Both l's in "hello" should be visible
  const letterElements = screen.getAllByText('l')
  expect(letterElements.length).toBeGreaterThanOrEqual(2)
})

it('handles empty word without crashing', () => {
  // given: empty word ""
  // when: render with no word
  // then: should render without error
  
  const { container } = render(
    <HangmanWord
      guessLetters={[]}
      wordToGuess=""
    />
  )
  
  expect(container).toBeInTheDocument()
})

it('works with a one-letter word', () => {
  // given: word is "a"
  // guessed: "a"
  // when: render
  // then: letter shows
  
  render(
    <HangmanWord
      guessLetters={['a']}
      wordToGuess="a"
    />
  )
  
  expect(screen.getByText('a')).toBeVisible()
})

it('handles very long words', () => {
  // given: long word "internationalization"
  // guessed: "i", "n", "t"
  // when: render
  // then: those letters show
  
  render(
    <HangmanWord
      guessLetters={['i', 'n', 't']}
      wordToGuess="internationalization"
    />
  )
  
  expect(screen.getByText('i')).toBeVisible()
  expect(screen.getByText('n')).toBeVisible()
  expect(screen.getByText('t')).toBeVisible()
})

it('renders one box per letter in the word', () => {
  // given: word is "cat" (3 letters)
  // when: render
  // then: should have 3 letter boxes (one per letter)
  
  const { container } = render(
    <HangmanWord
      guessLetters={[]}
      wordToGuess="cat"
    />
  )
  
  // HangmanWord renders spans for each letter
  const letterBoxes = container.querySelectorAll('span')
  expect(letterBoxes.length).toBeGreaterThanOrEqual(3)
})

})