// dummy sum so there's something to test. not used in the app
export function sum(a: number, b: number): string {
  return `Sum is ${a + b}`;
}

describe('sum', () => {
  it('should add two numbers correctly', () => {
    expect(sum(2, 3)).toBe('Sum is 5')
  })

  it('should add a positive and negative number correctly', () => {
    expect(sum(5, -3)).toBe('Sum is 2')
  })

  it('should add two negative numbers correctly', () => {
    expect(sum(-2, -3)).toBe('Sum is -5')
  })

  it('should handle zero correctly', () => {
    expect(sum(0, 5)).toBe('Sum is 5')
  })
  
})

