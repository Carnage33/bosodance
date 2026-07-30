/** Format helpers for booking form inputs */

export function formatPhonePL(raw: string): string {
  // Keep leading + if present, digits only otherwise
  let digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("++")) digits = "+" + digits.slice(2).replace(/\+/g, "");
  // Only one + at start
  if (digits.includes("+")) {
    digits = "+" + digits.replace(/\+/g, "").replace(/[^\d]/g, "");
  } else {
    digits = digits.replace(/\D/g, "");
  }

  const hasPlus = digits.startsWith("+");
  let d = hasPlus ? digits.slice(1) : digits;

  // Limit: +48 + 9 digits = 11, or 9 local
  if (d.startsWith("48")) {
    d = d.slice(0, 11); // 48 + 9
    const rest = d.slice(2);
    if (!rest) return hasPlus || raw.includes("+") ? "+48" : "48";
    // +48 XXX XXX XXX
    const p1 = rest.slice(0, 3);
    const p2 = rest.slice(3, 6);
    const p3 = rest.slice(6, 9);
    let out = (hasPlus || raw.includes("+") ? "+48" : "48") + " " + p1;
    if (p2) out += " " + p2;
    if (p3) out += " " + p3;
    return out.trim();
  }

  // Local 9-digit mobile
  d = d.slice(0, 9);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function isValidPhonePL(phone: string): boolean {
  const d = phoneDigits(phone);
  // 9 digits, or 48 + 9
  return d.length === 9 || (d.length === 11 && d.startsWith("48"));
}

export function formatName(raw: string): string {
  // Allow letters, spaces, hyphens, apostrophes; collapse spaces; max 60
  return raw
    .replace(/[^\p{L}\s\-']/gu, "")
    .replace(/\s+/g, " ")
    .slice(0, 60);
}

export function formatEmail(raw: string): string {
  return raw.replace(/\s/g, "").toLowerCase().slice(0, 80);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatCardExp(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function formatCvc(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 4);
}

export function formatCardName(raw: string): string {
  return raw
    .replace(/[^\p{L}\s\-'.]/gu, "")
    .replace(/\s+/g, " ")
    .toUpperCase()
    .slice(0, 40);
}

export function isValidCardExp(exp: string): boolean {
  const m = exp.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = Number(m[1]);
  return month >= 1 && month <= 12;
}
