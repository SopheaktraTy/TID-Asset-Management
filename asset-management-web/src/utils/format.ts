/**
 * Formats a string to Pascal Case (Space separated and capitalized).
 * Example: "SUPER_ADMIN" -> "Super Admin"
 */
export function toPascalCase(str: string | null | undefined): string {
  if (!str) return "–";
  return str
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Formats an ISO date string to a human-readable format.
 * Example: "2023-10-27T..." -> "Oct 27, 2023"
 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "–";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats an ISO date string to a human-readable format with time.
 * Example: "2023-10-27T10:30:00Z" -> "Oct 27, 2023, 10:30 AM"
 */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "–";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Gets the first two initials of a name.
 * Example: "John Doe" -> "JO"
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name.slice(0, 2).toUpperCase();
}

/**
 * Generates a consistent avatar color based on a string (hash-based).
 */
export function getAvatarColor(name: string | null | undefined): string {
  const colors = [
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (const c of name) hash = c.charCodeAt(0) + hash * 31;
  return colors[Math.abs(hash) % colors.length];
}
