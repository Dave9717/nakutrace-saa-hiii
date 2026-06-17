import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

const mockUnsubscribe = vi.fn();
const mockOnAuthStateChange = vi.fn(() => ({
  data: { subscription: { unsubscribe: mockUnsubscribe } },
}));
const mockGetSession = vi.fn(() => Promise.resolve({ data: { session: null } }));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      get onAuthStateChange() {
        return mockOnAuthStateChange;
      },
      get getSession() {
        return mockGetSession;
      },
    },
  },
}));

import { useAuth } from "@/hooks/use-auth";

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });
    mockGetSession.mockResolvedValue({ data: { session: null } });
  });

  it("starts with loading=true", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
  });

  it("sets loading=false after getSession resolves", async () => {
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("returns null session and user when not authenticated", async () => {
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeNull();
  });

  it("returns session and user when authenticated", async () => {
    const mockUser = { id: "user-123", email: "test@example.com" };
    const mockSession = { user: mockUser, access_token: "token" };
    mockGetSession.mockResolvedValue({ data: { session: mockSession } });

    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.session).toEqual(mockSession);
    expect(result.current.user).toEqual(mockUser);
  });

  it("subscribes to auth state changes", () => {
    renderHook(() => useAuth());
    expect(mockOnAuthStateChange).toHaveBeenCalledOnce();
  });

  it("unsubscribes on unmount", () => {
    const { unmount } = renderHook(() => useAuth());
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalledOnce();
  });

  it("updates state when auth state changes", async () => {
    let authCallback: (event: string, session: unknown) => void = () => {};
    mockOnAuthStateChange.mockImplementation((cb) => {
      authCallback = cb;
      return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
    });

    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const newUser = { id: "user-456", email: "new@example.com" };
    const newSession = { user: newUser, access_token: "new-token" };

    await waitFor(() => {
      authCallback("SIGNED_IN", newSession);
      return expect(result.current.user).toEqual(newUser);
    });
  });
});
