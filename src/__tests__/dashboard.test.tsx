import { fireEvent, render, screen } from "@testing-library/react";
import { useEffect, useState, type ReactNode } from "react";
import BusinessDashboard from "@/components/businessDashboard";
import SiteNav from "@/components/siteNav";
import { AccountProvider, useAccount } from "@/context/accounts/accountContext";
import { BusinessProvider, useBusiness } from "@/context/accounts/businessContext";
import { getDashboardBusiness, SAMPLE_BUSINESS } from "@/lib/ownerBusiness";

function renderWithAccount(ui: ReactNode) {
  return render(
    <AccountProvider>
      <BusinessProvider>{ui}</BusinessProvider>
    </AccountProvider>,
  );
}

function FillCreatedShop({ children }: { children: ReactNode }) {
  const { setAccountData } = useAccount();
  const { setBusinessData } = useBusiness();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAccountData({
      username: "River Market Bakery",
      email: "hello@rivermarket.example",
      password: "secret-loaf",
      confirmPassword: "secret-loaf",
      accountType: "business",
    });
    setBusinessData((current) => ({
      ...current,
      location: "88 Bridgeland Avenue, Calgary",
      description: "Sourdough and morning buns baked before the neighbourhood wakes up.",
      category: ["Food & Beverage"],
      onlineStore: "https://rivermarket.example",
    }));
    setReady(true);
  }, [setAccountData, setBusinessData]);

  if (!ready) return null;
  return children;
}

jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

jest.mock("@/lib/ownerBusiness", () => {
  const actual = jest.requireActual("@/lib/ownerBusiness");
  return {
    ...actual,
    getDashboardBusiness: jest.fn(),
  };
});

const mockGetDashboardBusiness = getDashboardBusiness as jest.MockedFunction<
  typeof getDashboardBusiness
>;

const sampleBusiness = {
  business_id: "biz-1",
  owner_id: "owner-1",
  name: "hello bakery",
  description: "fresh bread downtown",
  category: "food",
  location: "calgary",
};

describe("BusinessDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    mockGetDashboardBusiness.mockResolvedValue(SAMPLE_BUSINESS);
  });

  it("shows settings without a login wall", async () => {
    renderWithAccount(<BusinessDashboard />);
    expect(screen.getByText("settings")).toBeInTheDocument();
    expect(await screen.findByText("Moss & Clay Studio")).toBeInTheDocument();
    expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Business information")).not.toBeInTheDocument();
    expect(screen.queryByText("Products & services")).not.toBeInTheDocument();
  });

  it("replaces sample data when a database business is found", async () => {
    mockGetDashboardBusiness.mockResolvedValue(sampleBusiness);
    renderWithAccount(
      <>
        <SiteNav />
        <BusinessDashboard />
      </>,
    );

    expect(await screen.findByText("hello bakery")).toBeInTheDocument();
    expect(screen.getByText("food")).toBeInTheDocument();
    expect(screen.queryByText("fresh bread downtown")).not.toBeInTheDocument();
    expect((await screen.findAllByRole("link", { name: "Preview" }))[0]).toHaveAttribute(
      "href",
      "/business/biz-1",
    );
    expect(screen.getByRole("link", { name: "Listings" })).toHaveAttribute("href", "/product");
  });

  it("keeps profile and account on different pages", async () => {
    renderWithAccount(
      <>
        <SiteNav />
        <BusinessDashboard />
      </>,
    );
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("href", "/profile");
    expect(screen.getByRole("link", { name: "Account" })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("link", { name: "Listings" })).toHaveAttribute("href", "/product");
    expect((await screen.findAllByRole("link", { name: "Preview" }))[0]).toHaveAttribute(
      "href",
      "/explore",
    );
    expect(screen.getByRole("link", { name: "Open profile" })).toHaveAttribute("href", "/profile");
    expect(screen.getByRole("link", { name: "Sign out" })).toHaveAttribute("href", "/login");
    expect(screen.queryByRole("link", { name: "Promos" })).not.toBeInTheDocument();
  });

  it("uses the shop typed during account creation", async () => {
    mockGetDashboardBusiness.mockResolvedValue(SAMPLE_BUSINESS);
    renderWithAccount(
      <FillCreatedShop>
        <BusinessDashboard />
      </FillCreatedShop>,
    );

    expect(await screen.findByRole("heading", { name: "River Market Bakery" })).toBeInTheDocument();
    expect(screen.getByText("hello@rivermarket.example")).toBeInTheDocument();
    expect(screen.getByText("Food & Beverage")).toBeInTheDocument();
    expect(screen.getByText("88 Bridgeland Avenue, Calgary")).toBeInTheDocument();
    expect(
      screen.getByText("Sourdough and morning buns baked before the neighbourhood wakes up."),
    ).toBeInTheDocument();
    expect(screen.getByText("https://rivermarket.example")).toBeInTheDocument();
    expect(screen.getByText(/Mon 9:00 AM–5:00 PM/)).toBeInTheDocument();
    expect(screen.queryByText("Moss & Clay Studio")).not.toBeInTheDocument();
    expect(screen.queryByAltText("maker working at the studio bench")).not.toBeInTheDocument();
    expect(screen.queryByAltText("handmade ceramics on the studio shelves")).not.toBeInTheDocument();
  });

  it("uses the studio photos", async () => {
    renderWithAccount(<BusinessDashboard />);
    expect(await screen.findByAltText("maker working at the studio bench")).toHaveAttribute(
      "src",
      "/images/business-1.jpg",
    );
    expect(screen.getByAltText("handmade ceramics on the studio shelves")).toHaveAttribute(
      "src",
      "/images/profile-header.jpg",
    );
  });

  it("flips the preference switches", async () => {
    renderWithAccount(<BusinessDashboard />);
    expect(await screen.findByText("Moss & Clay Studio")).toBeInTheDocument();
    const email = screen.getByRole("switch", { name: "Email alerts" });
    expect(email).toHaveAttribute("aria-checked", "true");
    fireEvent.click(email);
    expect(email).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("switch", { name: "Show address" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    fireEvent.click(screen.getByRole("switch", { name: "Show address" }));
    expect(screen.getByRole("switch", { name: "Show address" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("link", { name: "Help" })).toHaveAttribute(
      "href",
      "mailto:hello@localloop.ca",
    );
  });
});
