/**
 * Centralized Error Handler & Sanitizer for Happy Walls
 * 
 * Enterprise Security & Architecture Principles:
 * 1. Information Disclosure Prevention (OWASP ASVS / CWE-200 / CWE-209):
 *    Never leak internal infrastructure details, environment variable names (e.g. NEXT_PUBLIC_*),
 *    backend vendor names (e.g. Supabase, PostgreSQL), configuration file paths (.env.local),
 *    or raw database schema names (tables, columns, constraints) into client-facing UI.
 * 2. Developer Ergonomics in Development:
 *    When running in development (`NODE_ENV === 'development'`), safe diagnostics are logged
 *    to the browser/Node console with a clear developer prefix.
 * 3. Graceful User Experience:
 *    End-users and administrators receive clear, human-friendly, actionable feedback.
 */

export interface AppError {
  message: string;
  code?: string;
  details?: string;
}

const SENSITIVE_PATTERNS = [
  "next_public_",
  ".env",
  "supabase",
  "postgres",
  "anon_key",
  "service_role",
  "pgrst",
  "jwt secret",
  "apikey",
  "api_key",
  "bearer",
  "relation \"",
  "column \"",
  "syntax error",
  "password authentication failed",
  "violates foreign key",
  "violates unique constraint",
  "42501",
  "23505",
  "23503",
  "pgrst116",
  "database error",
];

export function sanitizeErrorMessage(
  rawMessage: string,
  fallbackMessage: string = "An unexpected error occurred. Please try again."
): string {
  if (!rawMessage || typeof rawMessage !== "string") {
    return fallbackMessage;
  }

  const lower = rawMessage.toLowerCase();

  // If running in development, log the raw technical message for the developer
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    if (SENSITIVE_PATTERNS.some((pattern) => lower.includes(pattern))) {
      console.warn("[HappyWalls Dev Diagnostic]:", rawMessage);
    }
  }

  // Authentication & Session
  if (
    lower.includes("invalid login credentials") ||
    lower.includes("invalid email or password") ||
    lower.includes("invalid_credentials")
  ) {
    return "Invalid email address or password. Please verify your credentials.";
  }

  if (lower.includes("email not confirmed")) {
    return "Please confirm your email address before signing in.";
  }

  if (
    lower.includes("jwt") ||
    lower.includes("session expired") ||
    lower.includes("refresh_token_not_found") ||
    lower.includes("token has expired")
  ) {
    return "Your session has expired. Please sign in again.";
  }

  // Authorization & Permissions
  if (
    lower.includes("42501") ||
    lower.includes("permission denied") ||
    lower.includes("not authorized") ||
    lower.includes("access denied") ||
    lower.includes("unauthorized")
  ) {
    return "Access denied. You do not have permission to perform this action.";
  }

  // Unique constraint (Duplicates)
  if (
    lower.includes("23505") ||
    lower.includes("unique constraint") ||
    lower.includes("already exists")
  ) {
    if (lower.includes("slug") || lower.includes("title") || lower.includes("name")) {
      return "An item with this title or name already exists. Please use a different name.";
    }
    return "A record with this information already exists.";
  }

  // Foreign key / Referential integrity
  if (
    lower.includes("23503") ||
    lower.includes("foreign key") ||
    lower.includes("dependent")
  ) {
    return "Cannot complete action because related items depend on this record.";
  }

  // Record not found
  if (
    lower.includes("pgrst116") ||
    lower.includes("not found") ||
    lower.includes("no rows")
  ) {
    return "The requested record was not found or may have been removed.";
  }

  // Network & Connectivity
  if (
    lower.includes("network") ||
    lower.includes("failed to fetch") ||
    lower.includes("timeout") ||
    lower.includes("connection refused") ||
    lower.includes("getaddrinfo")
  ) {
    return "Connection issue. Please check your internet connection and try again.";
  }

  // Rate Limiting
  if (
    lower.includes("rate limit") ||
    lower.includes("too many requests") ||
    lower.includes("429")
  ) {
    return "Too many requests. Please wait a moment before trying again.";
  }

  // Sensitive patterns catch-all: if it leaks any internal technical info, shield it
  if (SENSITIVE_PATTERNS.some((pattern) => lower.includes(pattern))) {
    return "The service is temporarily unavailable. Please try again later or contact support.";
  }

  // If the message is safe, short, and contains no internal code structures, allow it
  if (
    rawMessage.length < 120 &&
    !rawMessage.includes("{") &&
    !rawMessage.includes("}") &&
    !rawMessage.includes("/") &&
    !rawMessage.includes("\\")
  ) {
    return rawMessage;
  }

  return fallbackMessage;
}

export function parseAppError(
  error: unknown,
  fallbackMessage: string = "An unexpected error occurred. Please try again."
): string {
  if (!error) return fallbackMessage;

  if (typeof error === "string") {
    return sanitizeErrorMessage(error, fallbackMessage);
  }

  if (error instanceof Error) {
    return sanitizeErrorMessage(error.message, fallbackMessage);
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const errorObj = error as { message?: unknown };
    if (typeof errorObj.message === "string") {
      return sanitizeErrorMessage(errorObj.message, fallbackMessage);
    }
  }

  return fallbackMessage;
}
