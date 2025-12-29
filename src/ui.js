/**
 * Display an error message for failed data requests
 * @param {number[]} latLon - Array containing latitude and longitude coordinates
 * @param {Error} error - Error object with message
 */
export const displayErrorMessage = (latLon, error) => {
  const lat = latLon[0];
  const lon = latLon[1];
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    padding: 20px;
    margin: 20px;
    border: 1px solid #ff6b6b;
    border-radius: 8px;
    background-color: #ffe0e0;
    color: #d63031;
    font-family: Arial, sans-serif;
    max-width: 600px;
  `;
  errorDiv.innerHTML = `
    <h3>Error Loading Data</h3>
    <p>Failed to fetch census tract data for coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}</p>
    <p><em>${error.message}</em></p>
  `;
  document.body.insertBefore(errorDiv, document.body.firstChild);
};

/**
 * Display a temporary debug message
 * @param {string} msg - Message to display
 */
export function showTemporaryMessage(msg) {
  const div = document.createElement('div');
  div.textContent = msg;
  div.style.padding = '0.5em';
  div.style.fontFamily = 'sans-serif';
  div.style.backgroundColor = '#ffeeba';
  div.style.border = '1px solid #f0ad4e';
  div.style.margin = '0.5em';
  document.body.appendChild(div);
}
