const normalizeTenantCode = (code) => {
  const value = String(code || "").trim();
  return /^\d+$/.test(value) ? value : null;
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const haversineDistanceKm = (fromLat, fromLon, toLat, toLon) => {
  const R = 6371;
  const dLat = ((toLat - fromLat) * Math.PI) / 180;
  const dLon = ((toLon - fromLon) * Math.PI) / 180;

  const lat1 = (fromLat * Math.PI) / 180;
  const lat2 = (toLat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const extractCoordinates = (req) => {
  const latitude = req.query?.latitude ?? req.body?.latitude ?? req.headers?.["x-user-latitude"];
  const longitude = req.query?.longitude ?? req.body?.longitude ?? req.headers?.["x-user-longitude"];

  const lat = toNumber(latitude, NaN);
  const lon = toNumber(longitude, NaN);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  return { latitude: lat, longitude: lon };
};

const getPublicIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  const forwardedIp = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : "";
  const rawIp = forwardedIp || req.socket?.remoteAddress || req.connection?.remoteAddress || "";

  if (!rawIp) return null;

  const cleaned = rawIp.replace(/^::ffff:/, "");
  if (cleaned === "::1" || cleaned === "127.0.0.1" || cleaned === "localhost") {
    return null;
  }

  return cleaned;
};

module.exports = {
  normalizeTenantCode,
  toNumber,
  haversineDistanceKm,
  extractCoordinates,
  getPublicIp,
};
