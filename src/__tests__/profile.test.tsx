import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react";
import  ProfilePage  from '../app/(site)/profile/page';
import { useAccount } from "@/context/accounts/accountContext";
import { useBusiness } from "@/context/accounts/businessContext";

jest.mock("../hooks/useAccount");   
jest.mock("../hooks/useBusiness");

const setAccountData = jest.fn();   
const setBusinessData = jest.fn();

const SAMPLE_ACCOUNT = { username: "Bakehouse", email: "hi@bakehouse.co", password: "" };
const SAMPLE_BUSINESS = {
  location: "12 Mill Road",
  description: "Sourdough and pies",
  category: ["Bakery", "Cafe"],
  onlineStore: "https://bakehouse.example",
  openingHours: { /* match the real BusinessHours shape — every day key */ },
};

beforeEach(() => {                  
  jest.clearAllMocks();             
  (useAccount as jest.Mock).mockReturnValue({ accountData: SAMPLE_ACCOUNT, setAccountData });
  (useBusiness as jest.Mock).mockReturnValue({ businessData: SAMPLE_BUSINESS, setBusinessData });
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