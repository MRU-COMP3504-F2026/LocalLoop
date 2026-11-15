import { supabase } from "@/lib/utils";
import {
  getBusinessForOwner,
  getCurrentUser,
  getDashboardBusiness,
} from "@/lib/ownerBusiness";

jest.mock("@/lib/utils", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
    from: jest.fn(),
  },
}));

const mockedSupabase = supabase as unknown as {
  auth: { getSession: jest.Mock };
  from: jest.Mock;
};

function mockQuery(result: { data: unknown; error: unknown }) {
  const limit = jest.fn().mockResolvedValue(result);
  return {
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({ limit }),
      limit,
    }),
  };
}

describe("ownerBusiness", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the signed in user", async () => {
    mockedSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: "owner-1", email: "owner@example.com" } } },
      error: null,
    });

    await expect(getCurrentUser()).resolves.toEqual({
      id: "owner-1",
      email: "owner@example.com",
    });
  });

  it("returns null when nobody is signed in", async () => {
    mockedSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    await expect(getCurrentUser()).resolves.toBeNull();
  });

  it("treats a missing auth session as signed out", async () => {
    mockedSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: { name: "AuthSessionMissingError", message: "Auth session missing!" },
    });

    await expect(getCurrentUser()).resolves.toBeNull();
  });

  it("finds a business by the auth user id", async () => {
    mockedSupabase.from.mockReturnValue(
      mockQuery({
        data: [{ business_id: "biz-1", owner_id: "owner-1", name: "hello bakery" }],
        error: null,
      }),
    );

    await expect(getBusinessForOwner("owner-1", "owner@example.com")).resolves.toEqual({
      business_id: "biz-1",
      owner_id: "owner-1",
      name: "hello bakery",
    });
    expect(mockedSupabase.from).toHaveBeenCalledWith("Businesses");
  });

  it("falls back to the User table when owner_id is not the auth id", async () => {
    mockedSupabase.from
      .mockReturnValueOnce(
        mockQuery({
          data: [],
          error: null,
        }),
      )
      .mockReturnValueOnce(
        mockQuery({
          data: [{ user_id: "user-22" }],
          error: null,
        }),
      )
      .mockReturnValueOnce(
        mockQuery({
          data: [{ business_id: "biz-2", owner_id: "user-22", name: "loop cafe" }],
          error: null,
        }),
      );

    await expect(getBusinessForOwner("auth-id", "owner@example.com")).resolves.toEqual({
      business_id: "biz-2",
      owner_id: "user-22",
      name: "loop cafe",
    });
    expect(mockedSupabase.from).toHaveBeenNthCalledWith(2, "User");
  });

  it("returns null when the user does not own a business", async () => {
    mockedSupabase.from
      .mockReturnValueOnce(mockQuery({ data: [], error: null }))
      .mockReturnValueOnce(mockQuery({ data: [], error: null }));

    await expect(getBusinessForOwner("auth-id", "customer@example.com")).resolves.toBeNull();
  });

  it("loads the first business for the mvp dashboard", async () => {
    mockedSupabase.from.mockReturnValue(
      mockQuery({
        data: [{ business_id: "biz-1", owner_id: "owner-1", name: "hello bakery" }],
        error: null,
      }),
    );

    await expect(getDashboardBusiness()).resolves.toEqual({
      business_id: "biz-1",
      owner_id: "owner-1",
      name: "hello bakery",
    });
  });

  it("returns null when the table is empty", async () => {
    mockedSupabase.from.mockReturnValue(mockQuery({ data: [], error: null }));
    await expect(getDashboardBusiness()).resolves.toBeNull();
  });
});
