import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react";
import  ProfilePage  from '../app/(site)/profile/page';
import { useAccount } from "@/context/accounts/accountContext";
import { useBusiness } from "@/context/accounts/businessContext";

jest.mock("@/context/accounts/accountContext");   
jest.mock("@/context/accounts/businessContext");

const setAccountData = jest.fn();   
const setBusinessData = jest.fn();

const SAMPLE_ACCOUNT = { 
  username: "River Market Bakery",
  email: "hello@rivermarket.example",
  password: "secret-loaf",
  confirmPassword: "secret-loaf",
  accountType: "business", 
};
const SAMPLE_BUSINESS = {
  location: "12 Mill Road",
  description: "Sourdough and pies",
  category: ["Bakery", "Cafe"],
  onlineStore: "https://bakehouse.example",
  openingHours: {
    mon: { open: "09:00", close: "17:00", closed: false },
    tue: { open: "09:00", close: "17:00", closed: false },
    wed: { open: "09:00", close: "17:00", closed: false },
    thu: { open: "09:00", close: "17:00", closed: false },
    fri: { open: "09:00", close: "17:00", closed: false },
    sat: { open: "09:00", close: "17:00", closed: false },
    sun: { open: "09:00", close: "17:00", closed: false },
  },  
  images: []
};

beforeEach(() => {
  jest.clearAllMocks();
  (useAccount as jest.Mock).mockReturnValue({ accountData:  SAMPLE_ACCOUNT, setAccountData });
  (useBusiness as jest.Mock).mockReturnValue({ businessData: SAMPLE_BUSINESS, setBusinessData });
});

beforeAll(() => {                   
  Object.defineProperty(URL, "createObjectURL", { value: jest.fn(() => "blob:mock-url") });
  Object.defineProperty(URL, "revokeObjectURL", { value: jest.fn() });
});

test("renders the profile prefilled from account and business data", () => {
  render(<ProfilePage />);   

  expect(screen.getByLabelText(/business name/i)).toHaveValue("River Market Bakery"); 
  expect(screen.getByRole("button", { name: "Save profile changes" })).toBeInTheDocument();
});

// Save test
test("clicking save button calls setAccountData and setBusinessData with updated values", () => {
  render(<ProfilePage />);
});

// Add and remove categories test

// Hours test

// Upload images test