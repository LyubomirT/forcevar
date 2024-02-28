// Get the elements from the popup.html
const varName = document.getElementById("var-name");
const varValue = document.getElementById("var-value");
const varUrl = document.getElementById("var-url");
const addButton = document.getElementById("add-button");
const configUl = document.getElementById("config-ul");
const clearAllButton = document.getElementById("clear-all-button");

// Load the existing config from the global storage
let config = [];
chrome.storage.local.get("config", function(result) {
  config = result.config || [];
  // Display the config in the popup
  displayConfig();
});

// Display the config in the popup
function displayConfig() {
  // Clear the existing list
  configUl.innerHTML = "";

  // Loop through the config array
  for (let i = 0; i < config.length; i++) {
    // Create a list item for each config object
    let li = document.createElement("li");

    // Create a span for each property of the config object
    let nameSpan = document.createElement("span");
    nameSpan.textContent = config[i].name;
    li.appendChild(nameSpan);

    let valueSpan = document.createElement("span");
    valueSpan.textContent = config[i].value;
    li.appendChild(valueSpan);

    let urlSpan = document.createElement("span");
    urlSpan.textContent = config[i].url;
    li.appendChild(urlSpan);

    // Create a button for editing the config object
    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-button";
    editButton.addEventListener("click", function() {
      // Fill the input fields with the current values
      varName.value = config[i].name;
      varValue.value = config[i].value;
      varUrl.value = config[i].url;

      // Remove the current config object from the array
      config.splice(i, 1);

      // Save the updated config to the global storage
      chrome.storage.local.set({ config: config });

      // Display the updated config in the popup
      displayConfig();
    });
    li.appendChild(editButton);

    // Create a button for deleting the config object
    let deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
      // Remove the current config object from the array
      config.splice(i, 1);

      // Save the updated config to the global storage
      chrome.storage.local.set({ config: config });

      // Display the updated config in the popup
      displayConfig();
    });
    li.appendChild(deleteButton);

    // Append the list item to the unordered list
    configUl.appendChild(li);
  }

  // Show or hide the clear all button based on the number of items displayed
  if (config.length > 0) {
    clearAllButton.removeAttribute("hidden");
  } else {
    clearAllButton.setAttribute("hidden", true);
  }
}

// List of disallowed characters in a URL query variable
const disallowedChars = ['<', '>', '"', '`', ' ', '\t', '\n', '\r', '{', '}', '|', '\\', '^', '~', '[', ']', '`', ';', '/', '?', ':', '@', '=', '&'];

// Function to validate a string for URL query variable
function isValidURLVariable(str) {

  // Check each character in the string
  for (let i = 0; i < str.length; i++) {
    if (disallowedChars.includes(str[i])) {
      return false; // If any disallowed character found, return false
    }
  }
  return true; // If no disallowed character found, return true
}

function listInvalidChars(str) {
  let invalidChars = [];
  for (let i = 0; i < str.length; i++) {
    if (disallowedChars.includes(str[i])) {
      invalidChars.push(str[i]);
    }
  }
  return invalidChars;
}

// Add a new config object to the array
function addConfig() {
  // Get the values from the input fields
  let name = varName.value;
  let value = varValue.value;
  let url = varUrl.value;

  // Validate the input values
  if (name && value && url && isValidURLVariable(name) && isValidURLVariable(value)) {
    // Create a new config object
    let newConfig = {
      name: name,
      value: value,
      url: url
    };

    // Add the new config object to the array
    config.push(newConfig);

    // Save the updated config to the global storage
    chrome.storage.local.set({ config: config });

    // Display the updated config in the popup
    displayConfig();

    // Clear the input fields
    varName.value = "";
    varValue.value = "";
    varUrl.value = "";
  } else {
    // Also tell the user the disallowed characters they used in the input fields (if any)
    if (!isValidURLVariable(name)) {
      if (listInvalidChars(name).length > 1) {
        alert("The variable name contains disallowed characters: " + listInvalidChars(name).join(", "));
      } else {
        alert("The variable name contains disallowed character: " + listInvalidChars(name).join(", "));
      }
    }
    if (!isValidURLVariable(value)) {
      if (listInvalidChars(value).length > 1) {
        alert("The variable value contains disallowed characters: " + listInvalidChars(value).join(", "));
      } else {
        alert("The variable value contains disallowed character: " + listInvalidChars(value).join(", "));
      }
    }
    // Alert the user to enter valid values
    alert("Please enter valid values for the variable name, value, and URL");
  }
}


// Add an event listener to the add button
addButton.addEventListener("click", addConfig);

// Add an event listener to the clear all button
clearAllButton.addEventListener("click", function() {
  // Clear the config array
  config = [];

  // Save the updated config to the global storage
  chrome.storage.local.set({ config: config });

  // Display the updated config in the popup
  displayConfig();
});
