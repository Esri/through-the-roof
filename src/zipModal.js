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
 * Create and show a modal for ZIP code input
 * @param {Function} onSubmit - Callback function when ZIP is submitted, receives zipCode string
 * @param {Function} onCancel - Callback function when modal is cancelled
 */
export const showZipModal = (onSubmit, onCancel) => {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20px;
    z-index: 1000;
    font-family: Arial, sans-serif;
  `;
  
  // Create modal content
  const modal = document.createElement('div');
  modal.style.cssText = `
    background-color: #fff;
    border-radius: 8px;
    padding: 24px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    position: relative;
  `;
  
  // Create form content
  modal.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2 style="margin: 0; color: #333; font-size: 20px;">Enter ZIP Code</h2>
      <button id="zip-close-btn" style="
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">×</button>
    </div>
    
    <form id="zip-form">
      <div style="margin-bottom: 16px;">
        <input 
          type="text" 
          id="zip-input" 
          placeholder="Enter 5-digit ZIP code (e.g., 12345)"
          pattern="[0-9]{5}(-[0-9]{4})?"
          title="Enter a valid 5-digit ZIP code or 9-digit ZIP+4 format"
          maxlength="10"
          style="
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            box-sizing: border-box;
            transition: border-color 0.2s;
          "
          required
        />
        <div id="zip-error" style="
          color: #e74c3c;
          font-size: 12px;
          margin-top: 4px;
          display: none;
        "></div>
      </div>
      
      <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
        <button type="button" id="zip-cancel-btn" style="
          padding: 10px 20px;
          border: 1px solid #ddd;
          background-color: #f8f9fa;
          color: #333;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        ">Cancel</button>
        <button type="submit" id="zip-submit-btn" style="
          padding: 10px 20px;
          border: none;
          background-color: #276644;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        ">Search</button>
      </div>
    </form>
  `;
  
  // Add modal to overlay and overlay to document
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Get form elements
  const form = document.getElementById('zip-form');
  const input = document.getElementById('zip-input');
  const errorDiv = document.getElementById('zip-error');
  const submitBtn = document.getElementById('zip-submit-btn');
  const cancelBtn = document.getElementById('zip-cancel-btn');
  const closeBtn = document.getElementById('zip-close-btn');
  
  // Focus on input
  setTimeout(() => input.focus(), 100);
  
  // ZIP code validation function
  const validateZip = (zip) => {
    // Remove any spaces and convert to string
    const cleanZip = String(zip).trim();
    
    // Check for 5-digit ZIP or 9-digit ZIP+4 format
    const zipRegex = /^[0-9]{5}(-?[0-9]{4})?$/;
    
    if (!zipRegex.test(cleanZip)) {
      return {
        isValid: false,
        message: 'Please enter a valid 5-digit ZIP code (e.g., 12345) or ZIP+4 format (e.g., 12345-6789)'
      };
    }
    
    return { isValid: true };
  };
  
  // Input validation on typing
  input.addEventListener('input', (e) => {
    const value = e.target.value;
    
    // Allow only digits and hyphens
    const cleanValue = value.replace(/[^0-9-]/g, '');
    if (cleanValue !== value) {
      input.value = cleanValue;
    }
    
    // Clear previous error
    errorDiv.style.display = 'none';
    input.style.borderColor = '#ddd';
    
    // Auto-format ZIP+4 (add hyphen after 5 digits)
    if (cleanValue.length === 6 && !cleanValue.includes('-')) {
      input.value = cleanValue.slice(0, 5) + '-' + cleanValue.slice(5);
    }
  });
  
  // Show error message
  const showError = (message) => {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    input.style.borderColor = '#e74c3c';
    input.focus();
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const zipCode = input.value.trim();
    const validation = validateZip(zipCode);
    
    if (!validation.isValid) {
      showError(validation.message);
      return;
    }
    
    // Clean up the ZIP code (ensure 5-digit format for consistency)
    const cleanZip = zipCode.replace(/[^0-9]/g, '').slice(0, 5);
    
    // Close modal and call onSubmit with the ZIP code
    document.body.removeChild(overlay);
    onSubmit(cleanZip);
  };
  
  // Handle cancel/close
  const handleClose = () => {
    document.body.removeChild(overlay);
    onCancel();
  };
  
  // Event listeners
  form.addEventListener('submit', handleSubmit);
  cancelBtn.addEventListener('click', handleClose);
  closeBtn.addEventListener('click', handleClose);
  
  // Close on escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      handleClose();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
  
  // Close on overlay click (but not modal click)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      handleClose();
    }
  });
  
  // Style focus and hover effects
  input.addEventListener('focus', () => {
    input.style.borderColor = '#007bff';
  });
  
  submitBtn.addEventListener('mouseover', () => {
    submitBtn.style.backgroundColor = '#0056b3';
  });
  
  submitBtn.addEventListener('mouseout', () => {
    submitBtn.style.backgroundColor = '#007bff';
  });
  
  cancelBtn.addEventListener('mouseover', () => {
    cancelBtn.style.backgroundColor = '#e9ecef';
  });
  
  cancelBtn.addEventListener('mouseout', () => {
    cancelBtn.style.backgroundColor = '#f8f9fa';
  });
};