/**
 * Fetch census tract data for given coordinates
 * @param {number} lat - Latitude coordinate
 * @param {number} lon - Longitude coordinate
 * @param {string} serviceUrl - ArcGIS service URL for the census tract data
 * @returns {Promise<Object|null>} Census tract feature data, or null if no tract found
 * @throws {Error} For network errors or malformed responses
 */
export const fetchTractByLatLon = async (lat, lon, serviceUrl) => {
  const queryUrl = `${serviceUrl}/query?where=1%3D1&geometry=${lon}%2C${lat}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=json`;
  const response = await fetch(queryUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  // return either the first matching tract or null (no tract found)
  return data.features && data.features.length > 0 ? data.features[0] : null;
};