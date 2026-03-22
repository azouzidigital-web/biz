/**
 * Utility functions for handling form submissions to Google Apps Script
 */

/**
 * Submit form data to Google Apps Script Web App
 * This function handles form submission with built-in retries and CORS handling
 * 
 * @param scriptUrl - The Google Apps Script Web App URL
 * @param formData - The form data to submit
 * @param maxRetries - Maximum number of retry attempts (default: 2)
 * @returns Promise resolving to a boolean indicating success
 */
export async function submitToGoogleScript(
  scriptUrl: string, 
  formData: FormData,
  maxRetries = 2
): Promise<boolean> {
  let retries = 0;
  
  // Convert FormData to plain object for easier manipulation
  const formDataObj: Record<string, string> = {};
  formData.forEach((value, key) => {
    formDataObj[key] = value.toString();
  });
  
  // Add timestamp if not present
  if (!formDataObj.timestamp) {
    formDataObj.timestamp = new Date().toISOString();
  }
  
  // Function to perform the actual fetch operation
  const performFetch = async (): Promise<boolean> => {
    try {
      // We have to use no-cors mode which means we won't be able to read the response
      // Fetch with JSON payload to Google Apps Script
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObj)
      });
      
      // Since we used no-cors, we can't check for response status
      // We assume success if no errors were thrown
      return true;
    } catch (error) {
      console.error(`Attempt ${retries + 1} failed:`, error);
      
      if (retries < maxRetries) {
        retries++;
        // Exponential backoff: wait longer between each retry
        const delay = Math.pow(2, retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return performFetch();
      }
      
      return false;
    }
  };
  
  return performFetch();
}

/**
 * Create an iframe-based form submission as a fallback method
 * This is a more reliable way to submit to Google Apps Script in some browsers
 * 
 * @param scriptUrl - The Google Apps Script Web App URL
 * @param formData - The form data to submit
 * @returns Promise resolving to void
 */
export function submitViaIframe(scriptUrl: string, formData: FormData): Promise<void> {
  return new Promise((resolve) => {
    // Create a hidden form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = scriptUrl;
    form.target = 'hidden-iframe';
    form.style.display = 'none';
    
    // Add form data as hidden inputs
    formData.forEach((value, key) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value.toString();
      form.appendChild(input);
    });
    
    // Create iframe to submit to
    const iframe = document.createElement('iframe');
    iframe.name = 'hidden-iframe';
    iframe.style.display = 'none';
    
    // Add to DOM
    document.body.appendChild(iframe);
    document.body.appendChild(form);
    
    // Handle completion
    iframe.onload = function() {
      setTimeout(() => {
        document.body.removeChild(form);
        document.body.removeChild(iframe);
        resolve();
      }, 100);
    };
    
    // Submit the form
    form.submit();
  });
}
