import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ExplorePage from '../app/(site)/explore/page';
import { BusinessCard } from '@/components/explore/businessCard';
import { UserLocationProvider } from '@/context/userLocationContext';
import { listBusinesses, type BusinessRecord } from '@/lib/database';

jest.mock('@/lib/database', () => ({listBusinesses: jest.fn().mockResolvedValue([])}));
jest.mock('@/lib/geocodeAddress', () => ({searchAddresses: jest.fn().mockResolvedValue([]),}));
const mockedListBusinesses = jest.mocked(listBusinesses);

beforeEach(() => {
  jest.clearAllMocks();
    mockedListBusinesses.mockResolvedValue([]);
});

describe('ExplorePage component', () => {
  it('should render the ExplorePage component correctly', () => {
    render(
      <UserLocationProvider>
        <ExplorePage />
      </UserLocationProvider>
    );

    expect(screen.getByRole('heading', { name: 'explore' })).toBeInTheDocument();
    expect(screen.getByText('Local businesses around you.')).toBeInTheDocument();
  });
});

// Test to render a business, product, or service card with the correct information

