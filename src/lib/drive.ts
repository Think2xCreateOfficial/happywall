/**
 * Helper to convert Google Drive File IDs or Share URLs into direct web-embeddable URLs.
 * Uses Google's direct CDN endpoint (lh3.googleusercontent.com/d/{id}) which supports
 * Next.js Image optimization, fast loading, and zero CORS restrictions for public files.
 */
export function getDriveImageUrl(fileIdOrUrl: string): string {
  if (!fileIdOrUrl) return "";

  // If already a local path or external non-drive URL
  if (
    fileIdOrUrl.startsWith("/") ||
    (!fileIdOrUrl.includes("drive.google.com") &&
      !fileIdOrUrl.includes("docs.google.com") &&
      fileIdOrUrl.startsWith("http"))
  ) {
    return fileIdOrUrl;
  }

  // Extract File ID from drive URL or bare ID
  const idMatch = fileIdOrUrl.match(/[-\w]{25,}/);
  const fileId = idMatch ? idMatch[0] : fileIdOrUrl;

  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

