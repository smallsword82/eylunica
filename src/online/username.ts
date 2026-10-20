export const usernamePattern = /^[a-z][a-z0-9_]{2,19}$/;
export function accountAddress(username: string): string {
  const normalized = username.trim().toLowerCase();
  if (!usernamePattern.test(normalized)) throw new Error("Kullanıcı adı 3–20 karakter olmalı; küçük harfle başlamalı, yalnız a-z, 0-9 ve _ içermeli.");
  return `${normalized}@accounts.eylunica.netlify.app`;
}
