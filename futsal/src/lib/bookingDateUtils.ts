export function getLocalDateString(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function normalizeBookingDate(value: string | Date | null | undefined): string | null {
  if (value == null || value === '') return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return getLocalDateString(value);
  }
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

function parseTimeToMinutes(timeStr: string | null | undefined): number | null {
  if (!timeStr) return null;
  const parts = String(timeStr).trim().split(':');
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1] ?? '0', 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

/** Booking date or timeslot end is already in the past */
export function isBookingInPast(
  bookingDate: string | Date | null | undefined,
  endTime?: string | null
): boolean {
  const dateStr = normalizeBookingDate(bookingDate);
  if (!dateStr) return false;

  const today = getLocalDateString();
  if (dateStr < today) return true;
  if (dateStr > today) return false;

  const endMinutes = parseTimeToMinutes(endTime);
  if (endMinutes == null) return false;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return endMinutes <= nowMinutes;
}

export function isBookingDateBeforeToday(bookingDate: string | Date | null | undefined): boolean {
  const dateStr = normalizeBookingDate(bookingDate);
  if (!dateStr) return false;
  return dateStr < getLocalDateString();
}
