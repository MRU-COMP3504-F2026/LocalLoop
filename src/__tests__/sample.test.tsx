import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react' 
import Home from '../app/page';

export function sum(a: number, b: number): string {
  return `Sum is ${a + b}`;
}

describe('sum', () => {
  it('should add two numbers correctly', () => {
    expect(sum(2, 3)).toBe('Sum is 5')
  })
})

describe('Home component', () => {
  it('should render the Home component correctly', () => {
    const { getByText } = render(<Home />);
    expect(getByText('Hello, LocalLoop')).toBeInTheDocument();
  }) 
})