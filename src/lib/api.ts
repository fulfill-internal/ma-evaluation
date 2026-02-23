// basePath must match next.config.ts basePath.
// Webflow Cloud also provides BASE_URL at runtime as a fallback.
const basePath = process.env.BASE_URL || '/evaluate';

export function apiUrl(path: string): string {
  return `${basePath}${path}`;
}
