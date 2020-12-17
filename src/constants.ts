export const IS_BROWSER = typeof window !== "undefined";

export const SERVER_URL = IS_BROWSER
  ? window.location.origin
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const IS_PRODUCTION = process.env.NODE_ENV === "production";
