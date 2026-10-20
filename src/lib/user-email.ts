// Users sign up with a username only; an internal email is derived for uniqueness.
const USER_EMAIL_DOMAIN = process.env.USER_EMAIL_DOMAIN || "pixel.local";

export function emailForUsername(username: string): string {
  return `${username.toLowerCase()}@${USER_EMAIL_DOMAIN}`;
}
