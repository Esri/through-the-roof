// zipService.js

const ZIP_SERVICE_URL = `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_ZIP_Code_Areas_anaylsis/FeatureServer/0/query`;

/**
 * Returns an array of ZIP codes that start with the given prefix.
 */
export async function fetchMatchingZips(prefix) {
  if (prefix.length < 3) return [];

  const whereClause = encodeURIComponent(`ZIP_CODE LIKE '${prefix}%'`);
  const url = `${ZIP_SERVICE_URL}?where=${whereClause}&outFields=ZIP_CODE&returnDistinctValues=true&returnGeometry=false&orderByFields=ZIP_CODE&f=json`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.features?.length) return [];

  return data.features.map((f) => f.attributes.ZIP_CODE);
}

/**
 * Returns a ZIP feature with full attributes and centroid geometry.
 * @param {string} zip - A 5-digit ZIP code
 * @returns {Promise<object|null>} Feature object or null if not found
 */
export async function fetchZipDetails(zip) {
  const whereClause = encodeURIComponent(`'${zip}'`);
  const url = `${ZIP_SERVICE_URL}?where=ZIP_CODE%3D${whereClause}&outFields=*&returnGeometry=false&returnCentroid=true&returnEnvelope=true&outSR=4326&f=json`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.features?.length) return null;

  return data.features[0]; // full feature with attributes and centroid
}

export async function fetchZipByLatLon(lat, lon) {

  const params = new URLSearchParams({
    f: "json",
    geometry: `${lon},${lat}`, // Note: x,y = lon,lat
    geometryType: "esriGeometryPoint",
    spatialRel: "esriSpatialRelIntersects",
    inSR: "4326",
    outFields: "*",
    returnGeometry: true
  });

  const response = await fetch(`${ZIP_SERVICE_URL}?${params.toString()}`);
  const data = await response.json();

  if (data.features?.length) {
    return data.features[0];
  } else {
    return null;
  }
}

export async function getZipByGeoLocation() {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    });

    const { latitude, longitude } = position.coords;
    const zipFeature = await fetchZipByLatLon(latitude, longitude);

    return zipFeature?.attributes?.ZIP_CODE ?? null;
  } catch (error) {
    console.warn("❌ Geolocation failed or was denied:", error);
    return null;
  }
}