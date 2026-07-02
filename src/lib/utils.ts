import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const label = score >= 3 ? (score >= 4 ? "Strong" : "Good") : score >= 2 ? "Fair" : "Weak";
  return { score, label };
}

export function getDistanceKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export function getAssistantFallbackReply(question: string) {
  const normalized = question.toLowerCase();
  if (normalized.includes("snake") || normalized.includes("bite")) {
    return "For a suspected snakebite, keep the victim still, remove rings or tight clothing, and seek urgent medical care. Do not cut the wound or attempt to suck venom.";
  }
  if (normalized.includes("fuel") || normalized.includes("stuck")) {
    return "If your vehicle is stuck in sand or mud, reduce tyre pressure, keep momentum gentle, and avoid spinning. If you are stranded, move to a visible safe point and call for assistance.";
  }
  if (normalized.includes("lion") || normalized.includes("wildlife")) {
    return "If wildlife is close, remain calm, make yourself look large, back away slowly, and avoid turning your back. Do not run unless you are in immediate danger.";
  }
  return "I can help with navigation, first aid, vehicle recovery, wildlife safety, and survival planning. If you are in immediate danger, contact emergency services now.";
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
