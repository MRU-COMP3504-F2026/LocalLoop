/**
 * Basic Sum function to demonstrate testing.
 * Function will likely not see use in final product.
 * @param a a number
 * @param b a number
 * @returns a string with the sum of a and b
 */
export function sum(a: number, b: number): string {
  return `Sum is ${a + b}`;
}

/**
 * Test suite for the sum function
 */
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

