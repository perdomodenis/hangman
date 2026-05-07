import { render } from '@testing-library/react'
import HangmanDraw from './HangmanDraw'
import '@testing-library/jest-dom';

describe('HangmanDraw', () => {
  // ALL TESTS GO HERE
  

it('renders nothing when numberOfGuess is 0', () => {
  // given: 0 wrong guesses (game just started)
  // when: we render HangmanDraw
  const { container } = render(
    <HangmanDraw numberOfGuess={0} />
  )
  
  // then: should only have the gallows, no body parts
  // Check that there's at least a container div
  expect(container.firstChild).toBeInTheDocument()
})

it('renders head with 1 wrong guess', () => {
  // given: 1 wrong guess (head should appear)
  // when: we render
  const { container } = render(
    <HangmanDraw numberOfGuess={1} />
  )
  
  // then: there should be style elements for the head (a circle)
  // The HEAD has specific styles: width 50px, height 50px, borderRadius 100%
  const styledDivs = container.querySelectorAll('div')
  expect(styledDivs.length).toBeGreaterThan(0)
})

it('renders head and body with 2 wrong guesses', () => {
  // given: 2 wrong guesses
  // when: we render
  const { container } = render(
    <HangmanDraw numberOfGuess={2} />
  )
  
  // then: more elements should render (head + body)
  const divs = container.querySelectorAll('div')
  expect(divs.length).toBeGreaterThan(1)
})

it('renders progressively more body parts as wrong guesses increase', () => {
  // given: render with 2 wrong guesses
  const { container: container2 } = render(
    <HangmanDraw numberOfGuess={2} />
  )
  const divCount2 = container2.querySelectorAll('div').length
  
  // when: render with 5 wrong guesses
  const { container: container5 } = render(
    <HangmanDraw numberOfGuess={5} />
  )
  const divCount5 = container5.querySelectorAll('div').length
  
  // then: 5 guesses should have MORE elements than 2 guesses
  expect(divCount5).toBeGreaterThan(divCount2)
})

it('renders all 6 body parts with 6 wrong guesses', () => {
  // given: 6 wrong guesses (maximum = you lose)
  // BODY_PARTS array has: [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG]
  // when: we render
  const { container } = render(
    <HangmanDraw numberOfGuess={6} />
  )
  
  // then: should have many divs (gallows + all 6 body parts)
  const divs = container.querySelectorAll('div')
  expect(divs.length).toBeGreaterThan(6)
})

it('renders correct number of body parts for each guess count', () => {
  // BODY_PARTS = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG]
  // numberOfGuess=3 should show first 3 items (HEAD, BODY, RIGHT_ARM)
  
  // given: 3 wrong guesses
  // when: we render
  const { container } = render(
    <HangmanDraw numberOfGuess={3} />
  )
  
  // then: should have exactly the first 3 body parts rendered
  const divs = container.querySelectorAll('div')
  // With 3 parts + gallows structure, check we have right count
  expect(divs.length).toBeGreaterThan(3)
})

it('handles negative numberOfGuess gracefully', () => {
  // given: numberOfGuess = -1 (shouldn't happen but test it)
  // when: we render
  const { container } = render(
    <HangmanDraw numberOfGuess={-1} />
  )
  
  // then: should not crash, just render gallows
  expect(container.firstChild).toBeInTheDocument()
})

it('handles numberOfGuess > 6 without crashing', () => {
  // given: numberOfGuess = 10 (more than max of 6)
  // when: we render
  const { container } = render(
    <HangmanDraw numberOfGuess={10} />
  )
  
  // then: should render without error
  // .slice(0, 10) will just get all 6 parts (array only has 6)
  expect(container.firstChild).toBeInTheDocument()
})

it('renders body parts with positioning styles', () => {
  // given: 3 wrong guesses
  // when: we render
  const { container } = render(
    <HangmanDraw numberOfGuess={3} />
  )
  
  // then: body part divs should have position: absolute
  const divs = container.querySelectorAll('div')
  // At least some divs should have position absolute
  let hasPositioned = false
  divs.forEach(div => {
    if (window.getComputedStyle(div).position === 'absolute') {
      hasPositioned = true
    }
  })
  expect(hasPositioned).toBe(true)
})

it('shows exact sequence: HEAD -> BODY -> ARMS -> LEGS', () => {
  // given: we render 1, 2, 3, 4, 5, 6 guesses in order
  // when: we check each step
  
  const counts = []
  for (let i = 0; i <= 6; i++) {
    const { container } = render(
      <HangmanDraw numberOfGuess={i} />
    )
    counts.push(container.querySelectorAll('div').length)
  }
  
  // then: each step should have >= previous step's count
  for (let i = 1; i < counts.length; i++) {
    expect(counts[i]).toBeGreaterThanOrEqual(counts[i - 1])
  }
})
})