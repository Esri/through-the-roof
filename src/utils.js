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

/**
 * Waits for an element matching the selector to appear in the DOM, then executes a callback
 * @param {string} selector - CSS selector to search for
 * @param {Function} callback - Function to execute when element is found, receives the element as parameter
 */
export function waitForElement(selector, callback) {
  const interval = setInterval(
		() => {
			const element = document.querySelector(selector);
			if (element) {
				clearInterval(interval);
				callback(element);
			}
	  }, 
		100
	);
}
