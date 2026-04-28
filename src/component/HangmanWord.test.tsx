import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Keyboard from './Keyboard'

describe('Keyboard', () => {
  it('calls addGuessLetter when a button is clicked', async () => {
    const user = userEvent.setup()
    const handleGuess = jest.fn()

    render(
      <Keyboard
        activeLetter={[]}
        inactiveLetter={[]}
        addGuessLetter={handleGuess}
        disabled={false}
      />
    )

    await user.click(screen.getByText('a'))
    expect(handleGuess).toHaveBeenCalledWith('a')
  })

  it('disables letters that are inactive or active', () => {
    render(
      <Keyboard
        activeLetter={['a']}
        inactiveLetter={['b']}
        addGuessLetter={() => {}}
        disabled={false}
      />
    )

    expect(screen.getByText('a')).toBeDisabled()
    expect(screen.getByText('b')).toBeDisabled()
    expect(screen.getByText('c')).not.toBeDisabled()
  })
})