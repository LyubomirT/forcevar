// Get the config from the storage.local
let configPromise = browser.storage.local.get("config");
let config = [];

configPromise.then((result) => {
  config = result.config || [];
  console.warn(config);
});

// Listen for changes in the local storage
browser.storage.onChanged.addListener((changes, areaName) => {
  // Update the config if it is changed
  if (areaName === "local" && changes.config) {
    config = changes.config.newValue;
  }
});

// Listen for tabs that are updated or created
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the tab is in a complete state
  if (changeInfo.status === "complete") {
    // Get the URL of the tab
    let url = tab.url;

    let urlObj = null;
    // Create a URL object from the string
    try {
        urlObj = new URL(url);
    } catch (error) {
        return;
    }

    // Loop through the config array
    for (let i = 0; i < config.length; i++) {
      // Check if the URL matches the config object
      if (url.includes(config[i].url)) {
        // Create a URLSearchParams object from the query string
        let params = new URLSearchParams(urlObj.search);

        // Check if the params already have the variable
        if (!params.has(config[i].name)) {
          // Add the variable to the params
          params.append(config[i].name, config[i].value);

          // Set the new query string to the URL object
          urlObj.search = params.toString();

          // Update the tab with the new URL
          browser.tabs.update(tabId, { url: urlObj.toString() });
        }
      }
    }
  }
});

browser.runtime.onStartup.addListener(() => {
    console.log(`onStartup()`);
});
