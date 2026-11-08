import '@testing-library/jest-dom'
import { render } from '@testing-library/react' 
import Home from '../app/page';

// just checks the home heading for now. fine for p6, swap it out later
describe('Home component', () => {
  it('should render the Home component correctly', () => {
    const { getByRole } = render(<Home />);
    expect(getByRole('heading', { name: 'LocalLoop. Find local. Love local.' })).toBeInTheDocument();
  }) 
})