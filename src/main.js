import './style.css'
import { fetchZipDetails, getZipByGeoLocation } from './zipService.js'
import { fetchFeatureByLatLon } from './censusApi.js'
import { createZipCard, createNoDataMessageCard, displayErrorMessage, showTemporaryMessage } from './ui.js'
import { showZipModal } from './zipModal.js'
import { CENSUS_CONFIG } from './config.js'
import { redirectToZip } from './utils.js'
import { initializeMap } from './map.js'

const DEBUG_MODE = new URLSearchParams(window.location.search).has("debug");
const DEBUG_MESSAGE_DURATION = 3000;
const debugMessage = DEBUG_MODE ? showTemporaryMessage : () => {};
const DEFAULT_ZIP = '92373'; // Redlands, CA

// Debug: Check if API key is loaded
//console.log('API Key loaded:', import.meta.env.VITE_ARCGIS_API_KEY ? 'Yes' : 'No');

// Handle Find ZIP button click - show ZIP modal
const handleFindZip = () => {
  showZipModal(
    (zipCode) => {
      // zipCode is a clean 5-digit string like "12345"
      const newUrl = `${window.location.pathname}?zip=${zipCode}`;
      window.history.pushState({}, '', newUrl);
      
      // Reload the page with new ZIP code
      window.location.reload();
    },
    () => {
      console.log('ZIP search cancelled');
    }
  );
};

async function main() {

  const STORY_ID = '4961e406d6364e198c71cdf3de491285';

  // Parse the ZIP code from the query string
  const params = new URLSearchParams(window.location.search);
  const zipParam = params.get("zip");
  if (!zipParam) {

    debugMessage(`⚠️ No ZIP param provided.`);
    debugMessage(`Attempting geolocation...`);

    const zipByGeoLocation = await getZipByGeoLocation();

    if (zipByGeoLocation) {
        debugMessage(`ZIP found: ${zipByGeoLocation}`);
        debugMessage("Redirecting...");
        redirectToZip(zipByGeoLocation, DEBUG_MODE && DEBUG_MESSAGE_DURATION);
    } else {
        debugMessage(`⚠️ No ZIP found for location.`);
        debugMessage(`Defaulting to ZIP ${DEFAULT_ZIP}...`);
        debugMessage("Redirecting...");
        redirectToZip(DEFAULT_ZIP, DEBUG_MODE && DEBUG_MESSAGE_DURATION);
    }

    return;

  }

  const zipDetails = await fetchZipDetails(zipParam);
  if (zipDetails === null) {
    showTemporaryMessage(`❌ Invalid ZIP code: ${zipParam}`);
    showTemporaryMessage(`Please try again.`);
    return;
  }

  const latLon = zipDetails?.centroid ? 
                [zipDetails.centroid.y, zipDetails.centroid.x] : 
                null;
  // validate latLon
  if (!latLon || latLon.length !== 2 || isNaN(latLon[0]) || isNaN(latLon[1])) {
    showTemporaryMessage(`❌ Invalid lat/lon for ZIP code: ${zipParam}`);
    showTemporaryMessage(`Please try again.`);
    return;
  }   

  // Show loading spinner for data query
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading';
  loadingDiv.innerHTML = `
    <div class="spinner"></div>
    <div class="spinner-text">Loading data...</div>
  `;
  document.body.appendChild(loadingDiv);

  try {

    const zipFeature = await fetchFeatureByLatLon(latLon, CENSUS_CONFIG["Housing Affordability Index 2025"].zip.url);
    const stateFeature = await fetchFeatureByLatLon(latLon, CENSUS_CONFIG["Housing Affordability Index 2025"].state.url);
    const nationFeature = await fetchFeatureByLatLon(latLon, CENSUS_CONFIG["Housing Affordability Index 2025"].nation.url);

    // Remove loading spinner
    document.body.removeChild(loadingDiv);

    let card;
    if (zipFeature && stateFeature && nationFeature) {
      
      // Create field mappings object
      const fieldMappings = {
        zip: CENSUS_CONFIG["Housing Affordability Index 2025"].zip.fields,
        state: CENSUS_CONFIG["Housing Affordability Index 2025"].state.fields,
        nation: CENSUS_CONFIG["Housing Affordability Index 2025"].nation.fields
      };
      
      card = createZipCard(
        zipFeature.attributes,
        stateFeature.attributes,
        nationFeature.attributes,
        fieldMappings,
        handleFindZip
      );
      console.log("Created zip info card");
    } else {
      console.log("No zip data found for coordinates:", latLon);
      card = createNoDataMessageCard(latLon);
      console.log("Created no data message card");
    }

    const divContentContainer = document.createElement('div');
    divContentContainer.className = 'content-container';

    const divInfoPanel = document.createElement('div');
    divInfoPanel.className = 'info-panel';
    divInfoPanel.appendChild(card);

    const divMap = document.createElement('div');
    divMap.className = 'map';

    const divMapPanel = document.createElement('div');
    divMapPanel.className = 'map-panel';
    divMapPanel.appendChild(divMap);

    divContentContainer.appendChild(divInfoPanel);
    divContentContainer.appendChild(divMapPanel);

    document.body.insertBefore(divContentContainer, document.body.firstChild);

    await initializeMap(divMap, latLon, zipFeature, CENSUS_CONFIG["Housing Affordability Index 2025"].zip.url);
      
  } catch (error) {
    // Remove loading spinner on error
    if (document.body.contains(loadingDiv)) {
      document.body.removeChild(loadingDiv);
    }
    console.error("Error fetching data:", error);
    displayErrorMessage(latLon[0], latLon[1], error);
  }

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
