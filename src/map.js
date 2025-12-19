export async function initializeMap(mapDiv, latLon, zipFeature, zipServiceUrl) {

  const [Map, MapView, FeatureLayer] =
    await $arcgis.import([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer"
    ]);

  const map = new Map({
    basemap: "streets-navigation-vector"
  });

  // Create the map view
  const view = new MapView({
    container: mapDiv,
    map: map,
    center: [latLon[1], latLon[0]], // [longitude, latitude]
    zoom: 12
  });
  console.log("Created map view:", view);

  // Wait for the view to be ready
  await view.when();
  console.log("Map view is ready!");

  // Add zip boundary as FeatureLayer (only if we have zip data)
  if (zipFeature && zipFeature.attributes && zipFeature.attributes.ID) {
    const zipLayer = new FeatureLayer({
      url: zipServiceUrl,
      outFields: ["*"],
      definitionExpression: `ID = '${zipFeature.attributes.ID}'`, // Filter to just this zip code
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: [0, 123, 255, 0.3], // Semi-transparent blue
          outline: {
            color: [0, 123, 255],
            width: 2
          }
        }
      }
    });
    
    map.add(zipLayer);
    console.log("Added zip layer");

    // Wait for zip layer to load and zoom to its extent
    await zipLayer.when();
    console.log("Zip layer loaded");
    
    // Query the layer to get the extent of the filtered zip code
    const query = zipLayer.createQuery();
    const result = await zipLayer.queryExtent(query);
    
    if (result.extent) {
      console.log("Zooming to zip extent:", result.extent);
      await view.goTo(result.extent.expand(1.2)); // Add some padding
    }

  }


}