export type ExpiryStatus = 'expired' | 'soon' | 'ok' | 'unknown';

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getDaysUntilExpiry(expiryDate?: Date): number | null {
  if (!expiryDate) return null;
  const today = startOfDay(new Date());
  const expiry = startOfDay(new Date(expiryDate));
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getExpiryStatus(expiryDate?: Date): ExpiryStatus {
  const days = getDaysUntilExpiry(expiryDate);
  if (days === null) return 'unknown';
  if (days < 0) return 'expired';
  if (days <= 3) return 'soon';
  return 'ok';
}

export function formatExpiryLabel(expiryDate?: Date): string | null {
  const days = getDaysUntilExpiry(expiryDate);
  if (days === null) return null;
  if (days < 0) return `Périmé depuis ${Math.abs(days)}j`;
  if (days === 0) return 'Expire aujourd\'hui';
  if (days === 1) return 'Expire demain';
  if (days <= 3) return `Expire dans ${days}j`;
  return `${days}j restants`;
}
