/** Local calendar date as YYYY-MM-DD */
const getLocalDateString = (d = new Date()) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

/** Normalize MySQL DATE / ISO string to YYYY-MM-DD */
const normalizeBookingDate = (value) => {
    if (value == null || value === "") return null;
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return getLocalDateString(value);
    }
    const str = String(value);
    const match = str.match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : null;
};

const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const parts = String(timeStr).trim().split(":");
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1] ?? "0", 10);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
};

/**
 * True when booking_date is before today, or same day but slot end time has passed.
 */
const isBookingInPast = (bookingDate, endTime = null) => {
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
};

const isBookingDateBeforeToday = (bookingDate) => {
    const dateStr = normalizeBookingDate(bookingDate);
    if (!dateStr) return false;
    return dateStr < getLocalDateString();
};

module.exports = {
    getLocalDateString,
    normalizeBookingDate,
    isBookingInPast,
    isBookingDateBeforeToday,
};
