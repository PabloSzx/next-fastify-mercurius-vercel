const { VERCEL_URL } = process.env;

export const IS_BROWSER = typeof window !== "undefined";

export const SERVER_URL = IS_BROWSER
  ? window.location.origin
  : VERCEL_URL
  ? `https://${VERCEL_URL}`
  : "http://localhost:3000";
