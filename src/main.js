import './style.css'

function parseLatLonFromURL() {
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

async function main() {

  const STORY_ID = '4961e406d6364e198c71cdf3de491285';
  const LATLON = parseLatLonFromURL() || [43.6767, -70.3477]; // Default to Lamb Street, Portland, ME

  // Create and insert the embed script manually
  const s = document.createElement('script');
  s.src = "https://storymaps.arcgis.com/embed/view";
  s.setAttribute("data-story-id", STORY_ID);
  s.setAttribute("data-root-node", ".storymaps-root");
  document.body.appendChild(s);

}

main();
