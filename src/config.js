/*

Copyright 2026 Esri

Licensed under the Apache License Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. 

*/

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