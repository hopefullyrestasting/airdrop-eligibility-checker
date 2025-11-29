// Minimal service worker - no persistent connections needed
// All API calls happen in popup context

chrome.runtime.onInstalled.addListener(() => {
  console.log('Airdrop Eligibility Checker installed');
});

// Optional: Add analytics or update checks here
// Keep it minimal - MV3 service workers should be stateless