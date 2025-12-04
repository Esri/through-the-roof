import './style.css'

const SERVICE_ACS_POPULATION_AND_HOUSING_BASICS_TRACT = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_10_14_Highlights_Population_Housing_Basics_Boundaries/FeatureServer/2';
const FIELD_MEDIAN_CONTRACT_RENT = 'B25058_001E';
const FIELD_MEDIAN_HOME_VALUE = 'B25077_001E';
const FIELD_MEDIAN_HOUSEHOLD_INCOME = 'B19049_001E';
const FIELD_STATE = 'State';
const FIELD_COUNTY = 'County';
const FIELD_NAME = 'NAME';

const parseLatLonFromURL = () =>{
  const params = new URLSearchParams(window.location.search);
  const lat = params.get("lat");
  const lon = params.get("lon");
  
  if (lat && lon) {
    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);
    
    // Validate coordinates
    if (!isNaN(parsedLat) && !isNaN(parsedLon) && 
        parsedLat >= -90 && parsedLat <= 90 && 
        parsedLon >= -180 && parsedLon <= 180) {
      return [parsedLat, parsedLon];
    }
  }
  
  return null; // Return null if parsing/validation fails
}

const fetchTractByLatLon = async (lat, lon) => {
  const queryUrl = `${SERVICE_ACS_POPULATION_AND_HOUSING_BASICS_TRACT}/query?where=1%3D1&geometry=${lon}%2C${lat}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=json`;
  const response = await fetch(queryUrl);
  const data = await response.json();
  
  if (data.features && data.features.length > 0) {
    return data.features[0]; // Return the first matching tract
  } else {
    throw new Error("No tract found for the given coordinates.");
  }
}

async function main() {

  const STORY_ID = '4961e406d6364e198c71cdf3de491285';

  const LATLON = parseLatLonFromURL() || [43.6767, -70.3477]; // Default to Lamb Street, Portland, ME

  const tractFeature = await fetchTractByLatLon(LATLON[0], LATLON[1]);
  console.log("Tract Feature:", tractFeature);

  /*
  SERVICE_ACS_POPULATION_AND_HOUSING_BASICS_STATE = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_10_14_Highlights_Population_Housing_Basics_Boundaries/FeatureServer/0';
  SERVICE_ACS_HOUSING_COSTS_BOUNDARIES_STATE = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Housing_Costs_Boundaries/FeatureServer/2';
  const FIELD_MEDIAN_CONTRACT_RENT_STATE = 'B25058_001E';
  const FIELD_MEDIAN_HOME_VALUE_STATE = 'B25077_001E';
  */

  /*
  // Create and insert the embed script manually
  const s = document.createElement('script');
  s.src = "https://storymaps.arcgis.com/embed/view";
  s.setAttribute("data-story-id", STORY_ID);
  s.setAttribute("data-root-node", ".storymaps-root");
  document.body.appendChild(s);
  */

}

main();
