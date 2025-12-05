/**
 * Redirect to the same page with lat/lon URL parameters
 * @param {number[]} latlon - Array of [latitude, longitude]
 * @param {number} delay - Optional delay in milliseconds before redirect
 */
export const redirectToLatLon = (latlon, delay) => {
  const safeDelay = Number(delay) || 0;
  const base = window.location.href.split("?").shift();
  const targetUrl = `${base}?lat=${encodeURIComponent(latlon[0])}&lon=${encodeURIComponent(latlon[1])}`;

  if (safeDelay > 0) {
    setTimeout(() => (window.location.href = targetUrl), safeDelay);
  } else {
    window.location.href = targetUrl;
  }
};