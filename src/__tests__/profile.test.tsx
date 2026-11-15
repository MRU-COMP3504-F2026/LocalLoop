import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react";
import  ProfilePage  from '../app/(site)/profile/page';
import { useAccount } from "@/context/accounts/accountContext";
import { useBusiness } from "@/context/accounts/businessContext";

jest.mock("../context/accounts/accountContext");   
jest.mock("../context/accounts/businessContext");

const setAccountData = jest.fn();   
const setBusinessData = jest.fn();

const SAMPLE_ACCOUNT = { username: "Bakehouse", email: "hi@bakehouse.co", password: "" };
const SAMPLE_BUSINESS = {
  location: "12 Mill Road",
  description: "Sourdough and pies",
  category: ["Bakery", "Cafe"],
  onlineStore: "https://bakehouse.example",
  openingHours: {
    Monday: { open: "09:00", close: "17:00", closed: false },
    Tuesday: { open: "09:00", close: "17:00", closed: false },
    Wednesday: { open: "09:00", close: "17:00", closed: false },
    Thursday: { open: "09:00", close: "17:00", closed: false },
    Friday: { open: "09:00", close: "17:00", closed: false },
    Saturday: { open: "09:00", close: "17:00", closed: false },
    Sunday: { open: "09:00", close: "17:00", closed: false },
  },
  images: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  (useAccount as jest.Mock).mockReturnValue({ accountData: { SAMPLE_ACCOUNT }, setAccountData });
  (useBusiness as jest.Mock).mockReturnValue({ businessData: { SAMPLE_BUSINESS }, setBusinessData });
});

beforeAll(() => {                   
  Object.defineProperty(URL, "createObjectURL", { value: jest.fn(() => "blob:mock-url") });
  Object.defineProperty(URL, "revokeObjectURL", { value: jest.fn() });
});

test("renders the profile prefilled from account and business data", () => {
  render(<ProfilePage />);   

  expect(screen.getByLabelText(/business name/i)).toHaveValue("Bakehouse"); 
  expect(screen.getByRole("button", { name: "Save profile changes" })).toBeInTheDocument();
});