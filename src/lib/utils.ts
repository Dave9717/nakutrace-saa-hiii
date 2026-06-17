import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCoords(
  lat: number | null | undefined,
  lng: number | null | undefined,
): string | null {
  if (lat == null || lng == null) return null;
  return `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
}

export function formatTimestamp(
  isoString: string,
  style: "datetime" | "time" = "datetime",
): string {
  const d = new Date(isoString);
  return style === "time" ? d.toLocaleTimeString() : d.toLocaleString();
}

export function formatTimestampWithCoords(
  isoString: string,
  lat: number | null | undefined,
  lng: number | null | undefined,
  style: "datetime" | "time" = "datetime",
): string {
  const ts = formatTimestamp(isoString, style);
  const coord = formatCoords(lat, lng);
  return coord ? `${ts} • ${coord}` : ts;
}

export function requireAuth(user: unknown, action: string): user is NonNullable<typeof user> {
  if (user) return true;
  toast.error(`Sign in to ${action}.`);
  return false;
}

export const AI_DISCLAIMER =
  "AI guidance is informational only and must not replace professional emergency, rescue, navigation, medical, or security services.";
