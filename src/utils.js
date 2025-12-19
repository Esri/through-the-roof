/**
 * Redirect to the same page with ZIP code URL parameter
 * @param {string} zip - ZIP code to redirect to
 * @param {number} delay - Optional delay in milliseconds before redirect
 */
export function redirectToZip(zip, delay) {
  const safeDelay = Number(delay) || 0;
  const base = window.location.href.split("?").shift();
  const targetUrl = `${base}?zip=${encodeURIComponent(zip)}`;

  if (safeDelay > 0) {
    setTimeout(() => (window.location.href = targetUrl), safeDelay);
  } else {
    window.location.href = targetUrl;
  }
}