import '@testing-library/jest-dom'
import { render } from '@testing-library/react' 
import Home from '../app/page';

/**
 * Test suite for the Home component
 * 
 * Tests the one aspect of the rendering of the Home component and checks if the expected text is present in the document.
 * Will need to be updated in future. Current test is for sake of P6 deliverable. 
 */
describe('Home component', () => {
  it('should render the Home component correctly', () => {
    const { getByRole } = render(<Home />);
    expect(getByRole('heading', { name: 'LocalLoop. Find local. Love local.' })).toBeInTheDocument();
  }) 
})