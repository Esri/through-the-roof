/**
 * Parse and validate latitude/longitude coordinates from URL parameters
 * @returns {number[]|null} Array of [lat, lon] if valid coordinates found, null otherwise
 */
export function parseLatLonFromURL() {
  const params = new URLSearchParams(window.location.search);
  const lat = params.get("lat");
  const lon = params.get("lon");
  
  if (lat && lon) {
    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);
    
    // Validate coordinates using the helper function
    if (isValidCoordinate(parsedLat, parsedLon)) {
      return [parsedLat, parsedLon];
    }
  }
  
  return null; // Return null if parsing/validation fails
}

/**
 * Validate if a coordinate pair is within valid bounds
 * @param {number} lat - Latitude value
 * @param {number} lon - Longitude value
 * @returns {boolean} True if coordinates are valid
 */
export function isValidCoordinate(lat, lon) {
  return !isNaN(lat) && !isNaN(lon) && 
         lat >= -90 && lat <= 90 && 
         lon >= -180 && lon <= 180;
}

/**
 * Get coordinates from device geolocation
 * @returns {Promise<number[]|null>} Array of [lat, lon] if successful, null if failed
 */
export async function getLatLonByGeoLocation() {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    });

    const { latitude, longitude } = position.coords;
    return [latitude, longitude];
  } catch (error) {
    console.warn("❌ Geolocation failed or was denied:", error);
    return null;
  }
}