import { fireEvent, render, screen } from "@testing-library/react";
import BusinessDashboard from "@/components/businessDashboard";
import { getDashboardBusiness, SAMPLE_BUSINESS } from "@/lib/ownerBusiness";

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
    render(<BusinessDashboard />);
    expect(screen.getByText("settings")).toBeInTheDocument();
    expect(await screen.findByText("Moss & Clay Studio")).toBeInTheDocument();
    expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Business information")).not.toBeInTheDocument();
    expect(screen.queryByText("Products & services")).not.toBeInTheDocument();
  });

  it("replaces sample data when a database business is found", async () => {
    mockGetDashboardBusiness.mockResolvedValue(sampleBusiness);
    render(<BusinessDashboard />);

    expect(await screen.findByText("hello bakery")).toBeInTheDocument();
    expect(screen.getByText("food")).toBeInTheDocument();
    expect(screen.queryByText("fresh bread downtown")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Preview" })[0]).toHaveAttribute(
      "href",
      "/business/biz-1",
    );
    expect(screen.getByRole("link", { name: "Listings" })).toHaveAttribute("href", "/product");
  });

  it("keeps profile and account on different pages", () => {
    render(<BusinessDashboard />);
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("href", "/profile");
    expect(screen.getByRole("link", { name: "Account" })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("link", { name: "Listings" })).toHaveAttribute("href", "/product");
    expect(screen.getAllByRole("link", { name: "Preview" })[0]).toHaveAttribute(
      "href",
      `/business/${SAMPLE_BUSINESS.business_id}`,
    );
    expect(screen.getByRole("link", { name: "Open profile" })).toHaveAttribute("href", "/profile");
    expect(screen.getByRole("link", { name: "Sign out" })).toHaveAttribute("href", "/login");
    expect(screen.queryByRole("link", { name: "Promos" })).not.toBeInTheDocument();
  });

  it("uses the studio photos", () => {
    render(<BusinessDashboard />);
    expect(screen.getByAltText("maker working at the studio bench")).toHaveAttribute(
      "src",
      "/images/business-1.jpg",
    );
    expect(screen.getByAltText("handmade ceramics on the studio shelves")).toHaveAttribute(
      "src",
      "/images/profile-header.jpg",
    );
  });

  it("flips the preference switches", async () => {
    render(<BusinessDashboard />);
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
