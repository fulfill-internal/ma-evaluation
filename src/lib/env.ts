// Webflow Cloud provides env vars only at runtime, not build time.
// Next.js normally inlines NEXT_PUBLIC_* at build time, which won't work.
// This helper reads from window.__ENV__ (injected by layout.tsx) on the client,
// and from process.env on the server.

declare global {
  interface Window {
    __ENV__?: Record<string, string | undefined>;
  }
}

export function getEnv(key: string): string | undefined {
  if (typeof window !== 'undefined' && window.__ENV__) {
    return window.__ENV__[key];
  }
  return process.env[key];
}
