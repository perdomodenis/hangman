import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Keyboard from './Keyboard'
import '@testing-library/jest-dom';


describe('Keyboard', () => {
  // ALL TESTS GO HERE

it('calls addGuessLetter when user clicks "a"', async () => {
  // given: we have a mock function to track clicks
  const mockAddGuess = jest.fn()
  const user = userEvent.setup()
  
  // when: we render keyboard and click "a"
  render(
    <Keyboard
      activeLetter={[]}
      inactiveLetter={[]}
      addGuessLetter={mockAddGuess}
      disabled={false}
    />
  )
  await user.click(screen.getByText('a'))
  
  // then: the function should be called with "a"
  expect(mockAddGuess).toHaveBeenCalledWith('a')
})

it('calls addGuessLetter for each button clicked', async () => {
  // given: mock function
  const mockAddGuess = jest.fn()
  const user = userEvent.setup()
  
  // when: we click multiple buttons
  render(
    <Keyboard
      activeLetter={[]}
      inactiveLetter={[]}
      addGuessLetter={mockAddGuess}
      disabled={false}
    />
  )
  await user.click(screen.getByText('a'))
  await user.click(screen.getByText('b'))
  
  // then: function should be called twice with different letters
  expect(mockAddGuess).toHaveBeenCalledTimes(2)
  expect(mockAddGuess).toHaveBeenNthCalledWith(1, 'a')
  expect(mockAddGuess).toHaveBeenNthCalledWith(2, 'b')
})

it('disables buttons for active letters (correct guesses)', () => {
  // given: we guessed "a", "b", "c" correctly (active)
  // when: we render keyboard
  render(
    <Keyboard
      activeLetter={['a', 'b', 'c']}
      inactiveLetter={[]}
      addGuessLetter={() => {}}
      disabled={false}
    />
  )
  
  // then: those buttons should be disabled
  expect(screen.getByText('a')).toBeDisabled()
  expect(screen.getByText('b')).toBeDisabled()
  expect(screen.getByText('c')).toBeDisabled()
  // others like 'd' should NOT be disabled
  expect(screen.getByText('d')).not.toBeDisabled()
})

it('disables buttons for inactive letters (wrong guesses)', () => {
  // given: we guessed "x", "z" and they were wrong (inactive)
  // when: we render keyboard
  render(
    <Keyboard
      activeLetter={[]}
      inactiveLetter={['x', 'z']}
      addGuessLetter={() => {}}
      disabled={false}
    />
  )
  
  // then: those buttons should be disabled
  expect(screen.getByText('x')).toBeDisabled()
  expect(screen.getByText('z')).toBeDisabled()
  // others should work
  expect(screen.getByText('a')).not.toBeDisabled()
})

it('disables all buttons when disabled prop is true (game over)', () => {
  // given: game is over (disabled=true)
  // when: we render keyboard
  render(
    <Keyboard
      activeLetter={[]}
      inactiveLetter={[]}
      addGuessLetter={() => {}}
      disabled={true}
    />
  )
  
  // then: ALL buttons should be disabled
  expect(screen.getByText('a')).toBeDisabled()
  expect(screen.getByText('z')).toBeDisabled()
  const allButtons = screen.getAllByRole('button')
  allButtons.forEach(button => {
    expect(button).toBeDisabled()
  })
})

it('renders all 26 alphabet letters', () => {
  // given: we render the keyboard
  render(
    <Keyboard
      activeLetter={[]}
      inactiveLetter={[]}
      addGuessLetter={() => {}}
      disabled={false}
    />
  )
  
  // when/then: all letters a-z should exist
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  alphabet.split('').forEach(letter => {
    expect(screen.getByText(letter)).toBeInTheDocument()
  })
})

it('applies active styling to correct guess buttons', () => {
  // given: we guessed "a" correctly
  // when: we render keyboard
  const { container } = render(
    <Keyboard
      activeLetter={['a']}
      inactiveLetter={[]}
      addGuessLetter={() => {}}
      disabled={false}
    />
  )
  
  // then: "a" button should have active class
  const aButton = screen.getByText('a')
  expect(aButton.className).toContain('active')
})

it('applies inactive styling to wrong guess buttons', () => {
  // given: we guessed "q" and it was wrong
  // when: we render keyboard
  const { container } = render(
    <Keyboard
      activeLetter={[]}
      inactiveLetter={['q']}
      addGuessLetter={() => {}}
      disabled={false}
    />
  )
  
  // then: "q" button should have inactive class
  const qButton = screen.getByText('q')
  expect(qButton.className).toContain('inactive')
})

it('does not call handler when clicking a disabled button', async () => {
  // given: "a" is already guessed (active)
  const mockAddGuess = jest.fn()
  const user = userEvent.setup()
  
  // when: we try to click "a" again
  render(
    <Keyboard
      activeLetter={['a']}
      inactiveLetter={[]}
      addGuessLetter={mockAddGuess}
      disabled={false}
    />
  )
  await user.click(screen.getByText('a'))
  
  // then: handler should NOT be called (button is disabled)
  expect(mockAddGuess).not.toHaveBeenCalled()
})

it('enables all buttons when no letters have been guessed', () => {
  // given: fresh game, no guesses yet
  // when: we render keyboard with empty arrays
  render(
    <Keyboard
      activeLetter={[]}
      inactiveLetter={[]}
      addGuessLetter={() => {}}
      disabled={false}
    />
  )
  
  // then: all letters should be enabled (clickable)
  expect(screen.getByText('a')).not.toBeDisabled()
  expect(screen.getByText('m')).not.toBeDisabled()
  expect(screen.getByText('z')).not.toBeDisabled()
})
})