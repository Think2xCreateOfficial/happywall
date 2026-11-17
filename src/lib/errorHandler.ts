/**
 * Centralized Error Handler for Happy Walls
 * Transforms database, network, and validation errors into friendly, actionable messages.
 * Prevents raw PostgreSQL codes or internals from being exposed to the user.
 */

export interface AppError {
  message: string;
  code?: string;
  details?: string;
}

export function parseAppError(error: unknown, fallbackMessage: string = "An unexpected error occurred."): string {
  if (!error) return fallbackMessage;

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    const msg = error.message;

    // Check for PostgREST / PostgreSQL error patterns
    if (msg.includes("42501") || msg.toLowerCase().includes("permission denied")) {
      return "Access denied. Please ensure you are logged in with valid administrator privileges.";
    }

    if (msg.includes("23505") || msg.toLowerCase().includes("unique constraint")) {
      if (msg.toLowerCase().includes("slug")) {
        return "An item with this title or slug already exists. Please choose a different title.";
      }
      return "This record already exists. Please check for duplicate entries.";
    }

    if (msg.includes("23503") || msg.toLowerCase().includes("foreign key")) {
      return "Cannot complete action because related items exist (e.g. posters assigned to this category).";
    }

    if (msg.includes("PGRST116") || msg.toLowerCase().includes("no rows")) {
      return "The requested record was not found or has been removed.";
    }

    if (msg.toLowerCase().includes("network") || msg.toLowerCase().includes("failed to fetch")) {
      return "Network connection issue. Please check your internet connection and try again.";
    }

    if (msg.toLowerCase().includes("jwt") || msg.toLowerCase().includes("session expired")) {
      return "Your admin session has expired. Please log in again.";
    }

    return msg;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const errorObj = error as { message?: unknown; code?: unknown };
    if (typeof errorObj.message === "string") {
      return parseAppError(new Error(errorObj.message), fallbackMessage);
    }
  }

  return fallbackMessage;
}
