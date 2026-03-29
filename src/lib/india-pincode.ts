/** Indian postal PIN: exactly 6 digits (API confirms whether it exists). */
const PIN_REGEX = /^\d{6}$/;

export function isValidIndiaPincode(pin: string): boolean {
  return PIN_REGEX.test(pin.trim());
}

export function normalizePincodeInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}
