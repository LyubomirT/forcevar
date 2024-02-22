// Get the elements from the popup.html
const varName = document.getElementById("var-name");
const varValue = document.getElementById("var-value");
const varUrl = document.getElementById("var-url");
const addButton = document.getElementById("add-button");
const configUl = document.getElementById("config-ul");

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
}

// Add a new config object to the array
function addConfig() {
  // Get the values from the input fields
  let name = varName.value;
  let value = varValue.value;
  let url = varUrl.value;

  // Validate the input values
  if (name && value && url) {
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
    // Alert the user to enter valid values
    alert("Please enter valid values for the variable name, value, and URL");
  }
}

// Add an event listener to the add button
addButton.addEventListener("click", addConfig);
