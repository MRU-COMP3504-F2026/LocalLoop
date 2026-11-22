import '@testing-library/jest-dom'
import { fireEvent, render, screen } from "@testing-library/react";
import  ProfilePage  from '../app/(site)/profile/page';
import { useAccount } from "@/context/accounts/accountContext";
import { BusinessHours, useBusiness } from "@/context/accounts/businessContext";

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
    monday:    { open: "09:00", close: "17:00", closed: false },
    tuesday:   { open: "09:00", close: "17:00", closed: false },
    wednesday: { open: "09:00", close: "17:00", closed: false },
    thursday:  { open: "09:00", close: "17:00", closed: false },
    friday:    { open: "09:00", close: "17:00", closed: false },
    saturday:  { open: "09:00", close: "17:00", closed: false },
    sunday:    { open: "09:00", close: "17:00", closed: false },
  } satisfies BusinessHours,  
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

test("clicking save button calls setAccountData and setBusinessData with updated values", () => {
  render(<ProfilePage />);

  // Act 1: edit a field
  const nameInput = screen.getByLabelText(/business name/i);
  fireEvent.change(nameInput, { target: { value: "River Market Bakery II" } });

  // Act 2: click save
  fireEvent.click(screen.getByRole("button", { name: "Save profile changes" }));

  // Assert: both setters called exactly once, each with an updater function
  expect(setAccountData).toHaveBeenCalledTimes(1);
  expect(setBusinessData).toHaveBeenCalledTimes(1);
  expect(setAccountData).toHaveBeenCalledWith(expect.any(Function));
  expect(setBusinessData).toHaveBeenCalledWith(expect.any(Function));

  // The updater gotcha: the argument is a FUNCTION — apply it to the current data
  const applyAccountUpdate = setAccountData.mock.calls[0][0];
  expect(applyAccountUpdate(SAMPLE_ACCOUNT).username).toBe("River Market Bakery II");

  const applyBusinessUpdate = setBusinessData.mock.calls[0][0];
  expect(applyBusinessUpdate(SAMPLE_BUSINESS)).toEqual(SAMPLE_BUSINESS);

  // UI feedback: the button now reads "Saved"
  expect(screen.getByRole("button", { name: "Saved" })).toBeInTheDocument();
});
// Save test: the button is type="submit" inside a <form> with onSubmit → clicking it calls saveProfile. setAccountData receives an updater function ((current) => ({...current, username: form.name, ...}), line 181) — your mock.calls[0][0] is that function; apply it to SAMPLE_ACCOUNT and assert on the result. After saving, the button's name flips to "Saved" (line 473) — that's your UI assertion.

// Add and remove categories test
test("choosing a category from the picker adds its chip and closes the picker", () => {
  render(<ProfilePage />);

  // Act 1: open the picker
  fireEvent.click(screen.getByRole("button", { name: "+" }));

  // Act 2: pick "Ceramics"
  fireEvent.click(screen.getByRole("button", { name: "Ceramics" }));

  // Assert: the chip exists...
  expect(screen.getByRole("button", { name: /Remove Ceramics/i })).toBeInTheDocument();
  // ...the picker closed — exact "Ceramics" can only be a picker option now...
  expect(screen.queryByRole("button", { name: "Ceramics" })).not.toBeInTheDocument();
  // ...and + vanished: 3 of 3 categories
  expect(screen.queryByRole("button", { name: "+" })).not.toBeInTheDocument();
});

test("clicking a category chip removes that category", () => {
  render(<ProfilePage />);

  fireEvent.click(screen.getByRole("button", { name: /Remove Bakery/i }));

  expect(screen.queryByRole("button", { name: /Remove Bakery/i })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Remove Cafe/i })).toBeInTheDocument(); // sibling untouched
  expect(screen.getByRole("button", { name: "+" })).toBeInTheDocument();           // 2 < 3 again
});

test("clicking + opens the picker with the remaining options", () => {
  render(<ProfilePage />);
  fireEvent.click(screen.getByRole("button", { name: "+" }));
  expect(screen.getByRole("button", { name: "Ceramics" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Other" })).toBeInTheDocument();
});
// Categories: heads-up — "Bakery" and "Cafe" are not in the real CATEGORY_OPTIONS (Ceramics, Handmade, Workshops, Food & Beverage, Clothing, Jewelry, Services, Other). Chips render and remove fine anyway, and the "+" menu will show all 8 options. The remove chip's accessible name includes the sr-only text (line 313), so query it with getByRole("button", { name: /Remove Bakery/i }).

// Hours test
// Hours accordion: the toggle's name is summarizeHours(...) → with your fixture, /Mon–Sun 9–5/ (note the en-dashes –, not hyphens — copy from source when you write it).

// Upload images test