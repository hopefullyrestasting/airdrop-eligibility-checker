// Utility functions for safe API interactions

// Validate EVM address format
function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Safe fetch wrapper with timeout
async function safeFetch(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// Log errors safely (no sensitive data)
function logError(context, error) {
  console.error(`[${context}]`, error.message);
}

// Export for use in popup.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { isValidAddress, safeFetch, logError };
}