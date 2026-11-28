import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ExplorePage from '../app/(site)/explore/page';
import { BusinessCard } from '@/components/explore/businessCard';
import { UserLocationProvider } from '@/context/userLocationContext';
import { listBusinesses, type BusinessRecord } from '@/lib/database';

jest.mock('@/lib/database', () => ({listBusinesses: jest.fn().mockResolvedValue([])}));
jest.mock('@/lib/geocodeAddress', () => ({searchAddresses: jest.fn().mockResolvedValue([]),}));

const mockedListBusinesses = jest.mocked(listBusinesses);

const SAMPLE_BUSINESS: BusinessRecord = {
  business_id: 'b-1',
  owner_id: 'o-1',
  name: "River Market Bakery",
  description: 'Sourdough and coffee',
  category: 'Bakery',
  location: 'Calgary, AB',
  address: '123 Main Street',
  email: 'hello@rivermarket.example',
  phone_number: null,
  online_store: null,
  opening_hours: {
    monday:    { open: "09:00", close: "17:00", closed: false },
    tuesday:   { open: "09:00", close: "17:00", closed: false },
    wednesday: { open: "09:00", close: "17:00", closed: false },
    thursday:  { open: "09:00", close: "17:00", closed: false },
    friday:    { open: "09:00", close: "17:00", closed: false },
    saturday:  { open: "09:00", close: "17:00", closed: false },
    sunday:    { open: "09:00", close: "17:00", closed: false },
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  mockedListBusinesses.mockResolvedValue([]);
  window.localStorage.clear();
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


describe('BusinessCard component', () => { 
  it('renders a business card with the correct information', () => {
  render(
      <BusinessCard
        id="b-1"
        name="River Market Bakery"
        imageUrl="/images/business-1.jpg"
        category="Bakery"
        location="Calgary, AB"
        description="Sourdough and coffee"
      />
    );
  
    expect(screen.getByRole('heading', { name: "River Market Bakery" })).toBeInTheDocument();
    expect(screen.getByText('Bakery')).toBeInTheDocument();
    expect(screen.getByText('Sourdough and coffee')).toBeInTheDocument();
    expect(screen.getByText('Calgary, AB')).toBeInTheDocument();
    expect(screen.getByAltText("River Market Bakery logo")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Business Profile' })).toHaveAttribute(
      'href',
      '/business/b-1'
    );
  });
});

describe('ExplorePage with UserLocationProvider', () => { 
  it('renders businesses returned by the data layer', async () => {
    mockedListBusinesses.mockResolvedValue([SAMPLE_BUSINESS]);
    render(
      <UserLocationProvider>
        <ExplorePage />
      </UserLocationProvider>
    );

    expect(await screen.findByRole('heading', { name: "River Market Bakery" })).toBeInTheDocument();
  

    expect(screen.getByRole('link', { name: 'View Business Profile' })).toHaveAttribute(
      'href',
      '/business/b-1'
    );
  });
});
