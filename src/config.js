/**
 * Configuration for services and field mappings
 */
export const CENSUS_CONFIG = {
  "Housing Affordability Index 2025": {
    zip: {
      url: 'https://services8.arcgis.com/peDZJliSvYims39Q/ArcGIS/rest/services/USA_Latest_Esri_Demographics/FeatureServer/1',
      fields: {
        id: 'ID',
        name: 'NAME',
        medianHomeValue: 'MEDVAL_CY',
        mediaHouseholdIncome: 'MEDHINC_CY',
        housingAffordabilityIndex: 'HAI_CY'
      }
    },
    state: {
      url: 'https://services8.arcgis.com/peDZJliSvYims39Q/ArcGIS/rest/services/USA_Latest_Esri_Demographics/FeatureServer/2',
      fields: {
        name: 'NAME', 
        medianHomeValue: 'MEDVAL_CY',
        mediaHouseholdIncome: 'MEDHINC_CY',
        housingAffordabilityIndex: 'HAI_CY'
      }
    },
    nation: {
      url: 'https://services8.arcgis.com/peDZJliSvYims39Q/ArcGIS/rest/services/USA_Latest_Esri_Demographics/FeatureServer/0',
      fields: {
        name: 'NAME', 
        medianHomeValue: 'MEDVAL_CY',
        mediaHouseholdIncome: 'MEDHINC_CY',
        housingAffordabilityIndex: 'HAI_CY'
      }
    }
  }
};