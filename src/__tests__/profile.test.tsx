import userEvent from "@testing-library/user-event"; 
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
  Object.defineProperty(URL, "createObjectURL", { value: jest.fn((file: File) => `blob:${file.name}`) });
  Object.defineProperty(URL, "revokeObjectURL", { value: jest.fn() });
});

test("renders the profile prefilled from account and business data", () => {
  render(<ProfilePage />);   
  
  expect(screen.getByLabelText(/business name/i)).toHaveValue("River Market Bakery"); 
  expect(screen.getByRole("button", { name: "Save profile changes" })).toBeInTheDocument();
});

// Save profile tests
test("clicking save button calls setAccountData and setBusinessData with updated values", () => {
  render(<ProfilePage />);

  // Edit a field
  const nameInput = screen.getByLabelText(/business name/i);
  fireEvent.change(nameInput, { target: { value: "River Market Bakery II" } });

  // Click save
  fireEvent.click(screen.getByRole("button", { name: "Save profile changes" }));

  // Assert: both setters called exactly once, each with an updater function
  expect(setAccountData).toHaveBeenCalledTimes(1);
  expect(setBusinessData).toHaveBeenCalledTimes(1);
  expect(setAccountData).toHaveBeenCalledWith(expect.any(Function));
  expect(setBusinessData).toHaveBeenCalledWith(expect.any(Function));

  // The updater gotcha: the argument is a FUNCTION — apply it to the current data
  const applyAccountUpdate = setAccountData.mock.calls[0][0];
  expect(applyAccountUpdate(SAMPLE_ACCOUNT).username).toBe("River Market Bakery II");
  expect(applyAccountUpdate(SAMPLE_ACCOUNT).email).toBe("hello@rivermarket.example");

  const applyBusinessUpdate = setBusinessData.mock.calls[0][0];
  expect(applyBusinessUpdate(SAMPLE_BUSINESS)).toEqual(SAMPLE_BUSINESS);

  // UI feedback: the button now reads "Saved"
  expect(screen.getByRole("button", { name: "Saved" })).toBeInTheDocument();
});

// Add and remove categories tests
test("choosing a category from the picker adds its chip and closes the picker", () => {
  render(<ProfilePage />);

  // Open the picker
  fireEvent.click(screen.getByRole("button", { name: "+" }));

  // Pick "Ceramics"
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

// Profile hours tests
test("the hours toggle shows the summary and opens all seven days", () => {
  render(<ProfilePage />);

  const toggle = screen.getByRole("button", { name: /Mon–Sun 9–5/ });
  expect(toggle).toHaveAttribute("aria-expanded", "false");

  fireEvent.click(toggle);

  expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByText("Monday")).toBeInTheDocument();       // day rows render
  expect(screen.getAllByLabelText("Closed")).toHaveLength(7);   // one checkbox per day
  expect(screen.getAllByDisplayValue("09:00")).toHaveLength(7); // open time per day
  expect(screen.getAllByDisplayValue("17:00")).toHaveLength(7); // close time per day
});

test("marking a day closed hides its time inputs and updates the summary", () => {
  render(<ProfilePage />);

  fireEvent.click(screen.getByRole("button", { name: /Mon–Sun 9–5/ }));

  // DOM order = DAYS order, so [0] is Monday
  fireEvent.click(screen.getAllByLabelText("Closed")[0]);

  expect(screen.getAllByDisplayValue("09:00")).toHaveLength(6); // Monday's gone
  expect(screen.getAllByDisplayValue("17:00")).toHaveLength(6);
  expect(screen.getByRole("button", { name: /Tue–Sun 9–5 · Mon closed/ })).toBeInTheDocument();
});

test("editing a time updates the summary", () => {
  render(<ProfilePage />);

  fireEvent.click(screen.getByRole("button", { name: /Mon–Sun 9–5/ }));
  fireEvent.change(screen.getAllByDisplayValue("09:00")[0], { target: { value: "08:00" } });

  // Monday no longer matches the others, so it gets its own span
  expect(screen.getByRole("button", { name: /Mon 8–5 · Tue–Sun 9–5/ })).toBeInTheDocument();
});

// Upload images tests
test("uploading photos renders previews and marks the first as cover", async () => {
  const user = userEvent.setup();
  const bread = new File(["fake-image-data"], "bread.png", { type: "image/png" });
  const croissant = new File(["fake-image-data"], "croissant.jpg", { type: "image/jpeg" });
  const { container } = render(<ProfilePage />);
  const input = container.querySelector('input[type="file"]') as HTMLInputElement;

  expect(screen.getByText(/No photos added/)).toBeInTheDocument(); // empty state first

  await user.upload(input, [bread, croissant]);

  // setup check — the test below is meaningless unless both photos really arrived
  expect(screen.getByRole("button", { name: "Remove photo 1" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Remove photo 2" })).toBeInTheDocument();

  expect(screen.queryByText(/No photos added/)).not.toBeInTheDocument();
  expect(screen.getByText("Cover photo")).toBeInTheDocument();     // first photo only
  expect(screen.getByRole("button", { name: "Remove photo 1" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Remove photo 2" })).toBeInTheDocument();
  expect(URL.createObjectURL).toHaveBeenCalledWith(bread);
});

test("removing a photo renumbers the rest and revokes its preview URL", async () => {
  const user = userEvent.setup();
  const bread = new File(["fake-image-data"], "bread.png", { type: "image/png" });
  const croissant = new File(["fake-image-data"], "croissant.jpg", { type: "image/jpeg" });
  const { container } = render(<ProfilePage />);
  const input = container.querySelector('input[type="file"]') as HTMLInputElement;

  await user.upload(input, [bread, croissant]);

  // setup check — the test below is meaningless unless both photos really arrived
  expect(screen.getByRole("button", { name: "Remove photo 1" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Remove photo 2" })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Remove photo 1" }));

  expect(screen.queryByRole("button", { name: "Remove photo 2" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Remove photo 1" })).toBeInTheDocument(); // croissant renumbered
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:bread.png");
});