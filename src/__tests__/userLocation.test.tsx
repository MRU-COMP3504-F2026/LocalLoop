// explore location: device watch, or pick an address from the list
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import UserLocationPanel from "@/components/explore/userLocationPanel";
import { UserLocationProvider } from "@/context/userLocationContext";
import { USER_LOCATION_STORAGE_KEY, readStoredUserLocation } from "@/lib/userLocation";

function renderPanel() {
  return render(
    <UserLocationProvider>
      <UserLocationPanel />
    </UserLocationProvider>,
  );
}

function mockGeolocation() {
  const watchPosition = jest.fn();
  const clearWatch = jest.fn();

  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: { watchPosition, clearWatch },
  });

  Object.defineProperty(navigator, "permissions", {
    configurable: true,
    value: {
      query: jest.fn().mockResolvedValue({ state: "prompt" }),
    },
  });

  return { watchPosition, clearWatch };
}

function addressField() {
  return screen.getByRole("combobox", { name: "Address" });
}

beforeEach(() => {
  window.localStorage.clear();
  mockGeolocation();
  global.fetch = jest.fn();
});

describe("user location", () => {
  it("asks for device permission and keeps the saved location updated", async () => {
    let onUpdate: PositionCallback = () => undefined;
    const { watchPosition } = mockGeolocation();
    watchPosition.mockImplementation((success: PositionCallback) => {
      onUpdate = success;
      success({
        coords: { latitude: 51.0447, longitude: -114.0719, accuracy: 18 },
      } as GeolocationPosition);
      return 4;
    });

    renderPanel();
    fireEvent.focus(addressField());
    fireEvent.mouseDown(screen.getByRole("option", { name: "Current location" }));

    expect(await screen.findByDisplayValue("Current location")).toBeInTheDocument();
    expect(screen.queryByText("51.04470, -114.07190")).not.toBeInTheDocument();
    expect(readStoredUserLocation()).toMatchObject({
      latitude: 51.0447,
      longitude: -114.0719,
      source: "device",
    });

    act(() => {
      onUpdate({
        coords: { latitude: 51.05, longitude: -114.08, accuracy: 9 },
      } as GeolocationPosition);
    });

    expect(readStoredUserLocation()?.latitude).toBe(51.05);
    expect(screen.queryByText("51.05000, -114.08000")).not.toBeInTheDocument();
  });

  it("offers real places while typing and saves the one that is chosen", async () => {
    const { watchPosition, clearWatch } = mockGeolocation();
    watchPosition.mockImplementation((success: PositionCallback) => {
      success({
        coords: { latitude: 51, longitude: -114, accuracy: 10 },
      } as GeolocationPosition);
      return 9;
    });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            latitude: 51.0528,
            longitude: -114.0859,
            label: "Kensington, Calgary, Alberta",
            title: "Kensington",
            subtitle: "Calgary, Alberta",
          },
        ],
      }),
    });

    renderPanel();
    fireEvent.focus(addressField());
    fireEvent.mouseDown(screen.getByRole("option", { name: "Current location" }));
    expect(await screen.findByDisplayValue("Current location")).toBeInTheDocument();

    fireEvent.change(addressField(), { target: { value: "Kensington" } });

    expect(await screen.findByRole("option", { name: "Kensington Calgary, Alberta" })).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByRole("option", { name: "Kensington Calgary, Alberta" }));

    expect(addressField()).toHaveValue("Kensington, Calgary, Alberta");
    expect(screen.queryByText(/51\.05280/)).not.toBeInTheDocument();
    expect(clearWatch).toHaveBeenCalledWith(9);
    expect(readStoredUserLocation()).toMatchObject({
      source: "address",
      label: "Kensington, Calgary, Alberta",
    });
  });

  it("shows current location before the browser answers", () => {
    const { watchPosition } = mockGeolocation();
    watchPosition.mockReturnValue(3);

    renderPanel();
    fireEvent.focus(addressField());
    fireEvent.mouseDown(screen.getByRole("option", { name: "Current location" }));

    expect(addressField()).toHaveValue("Current location");
  });

  it("shows a denial message and still accepts a typed address", async () => {
    const { watchPosition } = mockGeolocation();
    watchPosition.mockImplementation((_success: PositionCallback, failure: PositionErrorCallback) => {
      failure({ code: 1 } as GeolocationPositionError);
      return 2;
    });

    renderPanel();
    fireEvent.focus(addressField());
    fireEvent.mouseDown(screen.getByRole("option", { name: "Current location" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Location permission was denied");
  });

  it("resumes a live watch after refresh when permission is already granted", async () => {
    window.localStorage.setItem(
      USER_LOCATION_STORAGE_KEY,
      JSON.stringify({
        latitude: 51.01,
        longitude: -114.01,
        label: "Current location",
        source: "device",
        accuracy: 12,
        updatedAt: "2026-11-25T00:00:00.000Z",
      }),
    );

    const { watchPosition } = mockGeolocation();
    (navigator.permissions.query as jest.Mock).mockResolvedValue({ state: "granted" });
    watchPosition.mockImplementation((success: PositionCallback) => {
      success({
        coords: { latitude: 51.02, longitude: -114.02, accuracy: 6 },
      } as GeolocationPosition);
      return 5;
    });

    renderPanel();

    await waitFor(() => expect(watchPosition).toHaveBeenCalled());
    expect(await screen.findByDisplayValue("Current location")).toBeInTheDocument();
    expect(screen.queryByText("51.02000, -114.02000")).not.toBeInTheDocument();
  });
});
