import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react' 
import  ExplorePage  from '../app/(site)/explore/page';
import { useAccount } from "@/context/accounts/accountContext";
import { useBusiness } from "@/context/accounts/businessContext";

describe ('ExplorePage component', () => {
  it('should render the ExplorePage component correctly', () => {
    render(<ExplorePage />);

    expect(screen.getByRole('heading', { name: 'explore' })).toBeInTheDocument();
    expect(screen.getByText('Local businesses around you.')).toBeInTheDocument();
  })
})

// Test to render a business, product, or service card with the correct information

