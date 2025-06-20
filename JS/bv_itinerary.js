// Date change confirmation variables
let hasExistingItinerary = false;
let originalStartDate = '';
let originalEndDate = '';
let pendingDateChange = null;

document.addEventListener("DOMContentLoaded", function () {
  // Get travel_id from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const travelId = urlParams.get("travel_id"); // Assuming the URL is like: bv_itinerary.html?travel_id=123

  if (!travelId) {
    alert("Travel ID is missing!");
    return;
  }

  $.ajax({
    url: `../PHP/get_itinerary.php`,
    method: "GET",
    data: { travel_id: travelId },
    dataType: "json",
    success: function (data) {
      console.log("Response Data:", data);

      // If there's an existing itinerary already
      if (data.start_date && data.end_date) {
        $("#client-name").val(data.client_name);
        $("#destination").val(data.destination);
        $("#start-date").val(data.start_date.split(" ")[0]);
        $("#end-date").val(data.end_date.split(" ")[0]);
        $("#lodging").val(data.lodging);

        // Set original dates for confirmation check
        originalStartDate = data.start_date.split(" ")[0];
        originalEndDate = data.end_date.split(" ")[0];
        hasExistingItinerary = true;

        computeItineraryDuration(data.itinerary_days);

        toggleEditMode(true);
      } else {
        toggleEditMode(false);
        $("#client-name").val(data.FullName);
        $("#destination").val(data.travel_name);
        hasExistingItinerary = false;
      }

      // Initialize date change confirmation after data is loaded
      initializeDateChangeConfirmation();
    },
    error: function (xhr, status, error) {
      console.error("Error fetching itinerary data:", error);
      console.error("XHR:", xhr);
      console.error("Status:", status);
    },
  });
});

// Function to check if there's existing itinerary data
function checkForExistingItinerary() {
  const mainDayContainer = document.getElementById("main-day-container");
  const clientName = document.getElementById("client-name").value;
  const destination = document.getElementById("destination").value;
  const lodging = document.getElementById("lodging").value;
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;
  
  // Check if there's existing data (any time slots or filled fields)
  const hasTimeSlots = mainDayContainer.children.length > 0;
  const hasFilledFields = clientName || destination || lodging || startDate || endDate;
  
  if (hasTimeSlots || hasFilledFields) {
    hasExistingItinerary = true;
    if (!originalStartDate) originalStartDate = startDate;
    if (!originalEndDate) originalEndDate = endDate;
  }
}

// Function to show date change confirmation modal
function showDateChangeConfirmation(inputElement, newValue) {
  pendingDateChange = {
    element: inputElement,
    newValue: newValue,
    originalValue: inputElement.id === 'start-date' ? originalStartDate : originalEndDate
  };
  
  // Show the confirmation modal
  document.getElementById('date-change-confirmation-modal').style.display = 'flex';
}

// Function to hide the confirmation modal
function hideDateChangeModal() {
  document.getElementById('date-change-confirmation-modal').style.display = 'none';
  pendingDateChange = null;
}

// Function to clear the entire itinerary schedule
function clearItinerarySchedule() {
  const mainDayContainer = document.getElementById("main-day-container");
  mainDayContainer.innerHTML = ""; // Clear all day containers
  
  // Reset duration text
  const durationText = document.getElementById("duration-text");
  durationText.innerHTML = `<b>Duration:</b> 0 Days, 0 Nights`;
  
  // Reset duration values
  document.getElementById("duration-days").value = '';
  document.getElementById("duration-nights").value = '';
  
  // Reset endTimes array
  endTimes = [];
  
  console.log("Itinerary schedule cleared");
}

// Function to handle date input changes with confirmation
function handleDateChangeWithConfirmation(event) {
  const inputElement = event.target;
  const newValue = event.target.value;
  
  // Check if there's existing itinerary data and the value has actually changed
  if (hasExistingItinerary) {
    const originalValue = inputElement.id === 'start-date' ? originalStartDate : originalEndDate;
    
    if (newValue !== originalValue && newValue !== '' && originalValue !== '') {
      // Prevent the change and show confirmation
      event.preventDefault();
      inputElement.value = originalValue; // Reset to original value
      showDateChangeConfirmation(inputElement, newValue);
      return false; // Prevent further processing
    }
  }
  
  // If no existing data or no change, proceed normally
  return true;
}

// Initialize date change confirmation
function initializeDateChangeConfirmation() {
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const confirmBtn = document.getElementById('confirm-date-change');
  const cancelBtn = document.getElementById('cancel-date-change');
  const modal = document.getElementById('date-change-confirmation-modal');

  // Add event listeners to date inputs
  if (startDateInput) {
    startDateInput.addEventListener('input', handleDateChangeWithConfirmation);
    startDateInput.addEventListener('change', handleDateChangeWithConfirmation);
  }
  
  if (endDateInput) {
    endDateInput.addEventListener('input', handleDateChangeWithConfirmation);
    endDateInput.addEventListener('change', handleDateChangeWithConfirmation);
  }

  // Confirm button click handler
  if (confirmBtn) {
    confirmBtn.addEventListener('click', function() {
      if (pendingDateChange) {
        // Clear the existing itinerary first
        clearItinerarySchedule();
        
        // Apply the pending change
        pendingDateChange.element.value = pendingDateChange.newValue;
        
        // Update original values
        if (pendingDateChange.element.id === 'start-date') {
          originalStartDate = pendingDateChange.newValue;
        } else {
          originalEndDate = pendingDateChange.newValue;
        }
        
        // Trigger the duration computation with new dates
        computeItineraryDuration();
        
        // Show success message
        showModal('Date changed successfully. Itinerary schedule has been cleared.');
      }
      hideDateChangeModal();
    });
  }

  // Cancel button click handler
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
      hideDateChangeModal();
    });
  }

  // Close modal when clicking outside
  if (modal) {
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        hideDateChangeModal();
      }
    });
  }

  // Escape key to close modal
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal && modal.style.display === 'flex') {
      hideDateChangeModal();
    }
  });
}

// Generate day containers dynamically
function generateDayContainers(duration, startDate, itinerary_days = []) {
  const mainDayContainer = document.getElementById("main-day-container");

  mainDayContainer.innerHTML = ""; // Clear existing containers
  for (let i = 0; i < duration; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);

    // Format the date as 'Day #: Date (Day)'
    const dayOfWeek = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
    }); // Get the day of the week
    const date = currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const dayContainer = document.createElement("div");
    dayContainer.classList.add("day-container");
    dayContainer.innerHTML = `
                <h3>Day ${i + 1}: ${date} (${dayOfWeek})</h3>
                <div class="time-slots-container" id="time-slots-day-${i + 1}">
                    <!-- Time slots will be added here -->
                     <input hidden type="text" name="date-${
                       i + 1
                     }" placeholder="Date..." required value="${date}">
                </div>
                <button type="button" class="add-time-btn" data-day="${
                  i + 1
                }" data-date="${date}">+ Add Time</button>
            `;
    mainDayContainer.appendChild(dayContainer);

    if (itinerary_days.length) {
      const activities = itinerary_days[i].activities;

      if (activities.length) {
        for (let j = 0; j < activities.length; j++) {
          addTimeSlot(
            i + 1,
            activities[j].start_time,
            activities[j].end_time,
            activities[j].activity,
            itinerary_days[i].date
          );
        }
      }
    }
  }

  // Add event listeners for "Add Time Slot" buttons
  document.querySelectorAll(".add-time-btn").forEach((button, index) => {
    button.addEventListener("click", function () {
      const dayNumber = button.getAttribute("data-day");
      const date = button.getAttribute("data-date");
      addTimeSlot(dayNumber, "", "", "", date);
    });
  });
}

let endTimes = [];
// Add a new time slot dynamically
function addTimeSlot(dayNumber, startTime = "", endTime = "", activity = "") {
  const timeSlotsContainer = document.getElementById(
    `time-slots-day-${dayNumber}`
  );
  const timeSlotDiv = document.createElement("div");
  timeSlotDiv.classList.add("time-slot");
  timeSlotDiv.dataset.day = dayNumber;

  const uniqueId = Date.now(); // Unique ID for delete functionality
  timeSlotDiv.setAttribute("data-id", uniqueId);

  timeSlotDiv.innerHTML = ` 
           <div class="form-group time-slot-row">
                <input type="time" name="time_range[${dayNumber}][]" required value="${startTime}">
                <input type="time" name="time_range[${dayNumber}][]" required value="${endTime}" disabled>
                <input type="text" name="activity[${dayNumber}][]" placeholder="Activity..." required value="${activity}">
                <button type="button" class="delete-time-btn" data-id="${uniqueId}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

  timeSlotsContainer.appendChild(timeSlotDiv);

  timeSlotDiv
    .querySelector(".delete-time-btn")
    .addEventListener("click", function () {
      deleteTimeSlot(uniqueId);
    });

  // Add event listener to validate time inputs
  const startTimeInput = timeSlotDiv.querySelector(
    "input[type='time']:nth-child(1)"
  );
  const endTimeInput = timeSlotDiv.querySelector(
    "input[type='time']:nth-child(2)"
  );

  // Event listener to check if startTime is earlier than endTime
  startTimeInput.addEventListener("change", validateTime);
  endTimeInput.addEventListener("change", validateTime);

  function validateTime() {
    const startTimeValue = startTimeInput.value;
    const endTimeValue = endTimeInput.value;

    if (startTimeValue && !endTimeValue) {
      endTimeInput.disabled = false;
    }

    if (endTimes.length && startTimeValue && !endTimeValue) {
      const startTimeDate = new Date(`1970-01-01T${startTimeValue}:00`);
      const lastTimeDate = new Date(`1970-01-01T${endTimes[dayNumber - 1]}:00`);

      // If it's not the first day, check that the startTime is not earlier than lastEndTime
      if (startTimeDate < lastTimeDate) {
        alert(`Start time cannot be earlier than ${endTimes[dayNumber - 1]}`);
        startTimeInput.value = "";
        endTimeInput.disabled = true;
        return; // Prevent adding the time slot
      }
    }

    if (startTimeValue && endTimeValue) {
      const startTimeDate = new Date(`1970-01-01T${startTimeValue}:00`);
      const endTimeDate = new Date(`1970-01-01T${endTimeValue}:00`);

      if (startTimeDate >= endTimeDate) {
        alert("Start time must be earlier than end time.");
        endTimeInput.value = "";
        // Reset the end time if validation fails
        endTimeInput.setCustomValidity(
          "Start time must be earlier than end time."
        );
      } else {
        endTimeInput.setCustomValidity(""); // Clear any previous validation messages
        if (!endTimes.length) {
          endTimes.push(endTimeValue);
        } else {
          endTimes[dayNumber - 1] = endTimeValue;
        }
      }
    }
  }
}

// Delete a specific time slot
function deleteTimeSlot(uniqueId) {
  const timeSlot = document.querySelector(`.time-slot[data-id="${uniqueId}"]`);
  if (timeSlot) {
    if (endTimes.length) {
      const previous = timeSlot.previousElementSibling;
      if (previous) {
        endTimes[previous.dataset.day - 1] = previous.querySelector(
          "input[type='time']:nth-child(2)"
        ).value;
      } else if (endTimes[timeSlot.dataset.day - 1]) {
        endTimes.splice(timeSlot.dataset.day - 1, 1);
      }
    }
    timeSlot.remove();
  }
}

function computeItineraryDuration(itinerary_days = []) {
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const durationText = document.getElementById("duration-text");
  const durationDays = document.getElementById("duration-days");
  const durationNights = document.getElementById("duration-nights");

  const mainDayContainer = document.getElementById("main-day-container");
  const form = document.getElementById("itinerary-form");

  // Listen for changes in the start and end dates
  function updateDuration() {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (startDate && endDate && startDate <= endDate) {
      // Calculate the duration in days
      const duration =
        Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start day
      const nights = duration > 1 ? duration - 1 : 0; // Nights is duration - 1, but can't be less than 0
      const dayText = duration === 1 ? "Day" : "Days";
      const nightText =
        nights === 1 ? "Night" : nights === 0 ? "Night" : "Nights";

      // Update the duration text
      durationText.innerHTML = `<b>Duration:</b> ${duration} ${dayText}, ${nights} ${nightText}`;
      durationDays.value = duration;
      durationNights.value = nights;

      // Generate day containers
      generateDayContainers(duration, startDate, itinerary_days);

      // Check if there's existing data for confirmation
      if (startDateInput.value || endDateInput.value) {
        checkForExistingItinerary();
      }

      // Show the "Submit" button only if there's at least one day-container
      console.log(duration);
      if (!duration) {
        durationText.innerHTML = `<b>Duration:</b> Invalid Dates`;
        mainDayContainer.innerHTML = ""; // Clear day containers
        const saveBtn = document.getElementById("save-btn");
        if (saveBtn) saveBtn.style.display = "none"; // Hide the button if dates are invalid
      }
    }
  }

  updateDuration();
}

// Function to display the modal message
function showModal(message, isError = false) {
  const modal = document.getElementById("modal-popup");
  const modalMessage = document.getElementById("modal-message");

  // Set the message
  modalMessage.textContent = message;

  // Add the appropriate class (error or success) based on the isError flag
  if (isError) {
    modal.classList.add("error-modal");
    modal.classList.remove("success-modal");
  } else {
    modal.classList.add("success-modal");
    modal.classList.remove("error-modal");
  }

  // Show the modal
  modal.style.display = "block";

  // Close the modal when the "close" button is clicked
  const closeBtn = modal.querySelector(".close");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  toggleEditMode(false);

  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");

  // Don't clear values on page load - they may be set by AJAX
  // startDateInput.value = "";
  // endDateInput.value = "";

  // Remove the original event listeners since we handle them in initializeDateChangeConfirmation
  // The date change confirmation will handle these events
});

document.addEventListener("DOMContentLoaded", function () {
  const buttonContainer = document.getElementById("destination-buttons");
  const dataContainer = document.getElementById("destination-data");
  const searchContainer = document.getElementById("search-container");
  const searchInput = document.getElementById("search-input");

  // Fetch destinations and create buttons
  fetch("../PHP/placeguide_handler.php?action=get_destinations") // Modify if needed based on your server-side logic
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        data.destinations.forEach((destination) => {
          const button = document.createElement("button");
          button.textContent = destination;
          button.classList.add("destination-button");
          button.onclick = () => {
            loadDestinationData(destination);
            setActiveButton(button); // Set this button as active
            toggleSearchBar(true); // Show the search bar
          };
          buttonContainer.appendChild(button);
        });
      }
    })
    .catch((error) => console.error("Error fetching destinations:", error));

  // Function to load destination data
  function loadDestinationData(destination) {
    fetch(
      `../PHP/placeguide_handler.php?action=get_places&destination=${encodeURIComponent(
        destination
      )}&search=${searchInput.value}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          displayDestinationData(destination, data.places);
        } else {
          dataContainer.innerHTML = `<p>No data available for ${destination}.</p>`;
        }
      })
      .catch((error) => console.error("Error fetching places:", error));
  }

  // Function to display destination data
  function displayDestinationData(destination, places) {
    dataContainer.innerHTML = `<h2 class="destination-title">Places in ${destination}</h2>`;
    places.forEach((place) => {
      const placeDiv = document.createElement("div");
      placeDiv.classList.add("place-item");

      placeDiv.innerHTML = `
                <h3>${place.place_name}</h3>
                <p><strong>Location:<br></strong> ${place.location}</p>
                <p><strong>Description:<br></strong> ${place.description}</p>
                <p><strong>Activities:</strong> ${place.activitiesHtml}</p>
                <div class="images">
                    ${place.images
                      .map(
                        (image) =>
                          `<img src="../uploads/${image}" alt="Place image" class="place-image">`
                      )
                      .join("")}
                </div>
            `;
      dataContainer.appendChild(placeDiv);
    });
  }

  // Function to set the active button
  function setActiveButton(button) {
    const allButtons = document.querySelectorAll(".destination-button");
    allButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  }

  // Function to toggle the search bar visibility
  function toggleSearchBar(show) {
    if (show) {
      searchContainer.style.display = "block";
    } else {
      searchContainer.style.display = "none";
    }
  }

  // Real-time search
  searchInput.addEventListener("input", function () {
    const destination = document.querySelector(".destination-button.active");
    if (destination) {
      loadDestinationData(destination.textContent); // Trigger search with the current active destination
    }
  });
});

// Select the save button
const saveBtn = document.getElementById("save-btn");
const editBtn = document.getElementById("edit-btn");

// Get all input and textarea fields
const inputs = document.querySelectorAll("input, textarea");

// Add click event to the save button
if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    toggleEditMode(true);
  });
}

if (editBtn) {
  editBtn.addEventListener("click", () => {
    toggleEditMode(false);
  });
}

// Function to toggle edit mode
function toggleEditMode(isEditMode) {
  // Apply to the regular input fields
  const inputs = document.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.disabled = isEditMode; // Disable or enable inputs based on the mode
  });

  // Apply to the time slots and activity fields in each generated day container
  const timeSlotInputs = document.querySelectorAll(
    ".day-container .time-slot input"
  );
  timeSlotInputs.forEach((input) => {
    input.disabled = isEditMode; // Disable or enable each time slot input
  });

  // Hide/show the "+ Add Time" buttons based on edit mode
  const addTimeButtons = document.querySelectorAll(".add-time-btn");
  addTimeButtons.forEach((button) => {
    if (isEditMode) {
      button.style.display = "none"; // Hide buttons in save mode
    } else {
      button.style.display = "block"; // Show buttons in edit mode
    }
  });

  // Hide/show the delete time buttons based on edit mode
  const deleteTimeButtons = document.querySelectorAll(".delete-time-btn");
  deleteTimeButtons.forEach((button) => {
    if (isEditMode) {
      button.style.display = "none"; // Hide delete buttons in save mode
    } else {
      button.style.display = "inline-flex"; // Show delete buttons in edit mode
    }
  });

  if (isEditMode) {
    const saveBtn = document.getElementById("save-btn");
    const editBtn = document.getElementById("edit-btn");
    if (saveBtn) saveBtn.style.display = "none";
    if (editBtn) editBtn.style.display = "block";
  } else {
    const saveBtn = document.getElementById("save-btn");
    const editBtn = document.getElementById("edit-btn");
    if (saveBtn) saveBtn.style.display = "block";
    if (editBtn) editBtn.style.display = "none";
  }
}

// Theme functionality - load and persist theme without session dependency
document.addEventListener('DOMContentLoaded', function() {
  const themeSelect = document.getElementById('theme-select');
  const logoImg = document.getElementById('main-logo');

  function updateLogo(theme) {
    if (!logoImg) return;
    switch (theme) {
        case 'summer':
            logoImg.src = '../Images/bv_logo_summer.png';
            break;
        case 'midnight':
            logoImg.src = '../Images/bv_logo_midnight.png';
            break;
        case 'rain':
            logoImg.src = '../Images/bv_logo_rain.png';
            break;
        default:
            logoImg.src = '../Images/bv_logo.png';
    }
  }

  function updateFavicon(theme) {
    // Get the current favicon link element
    let faviconLink = document.querySelector("link[rel*='icon']");
    
    // If no favicon link exists, create one
    if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        faviconLink.type = 'image/png';
        document.head.appendChild(faviconLink);
    }

    // Update favicon based on theme
    switch (theme) {
        case 'summer':
            faviconLink.href = '../Images/favicon-summer-32x32.png';
            break;
        case 'midnight':
            faviconLink.href = '../Images/favicon-midnight-32x32.png';
            break;
        case 'rain':
            faviconLink.href = '../Images/favicon-rain-32x32.png';
            break;
        default:
            faviconLink.href = '../Images/favicon-daylight-32x32.png';
    }

    // Force browser to reload favicon by adding timestamp
    faviconLink.href += '?v=' + new Date().getTime();
  }

  // Load saved theme from localStorage (persistent across sessions)
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      if (themeSelect) {
          themeSelect.value = savedTheme;
      }
      updateLogo(savedTheme);
      updateFavicon(savedTheme);
  } else {
      // Set default theme and favicon for daylight theme
      document.documentElement.setAttribute('data-theme', 'daylight');
      updateFavicon('daylight');
  }

  // Update theme on change and save to localStorage
  if (themeSelect) {
      themeSelect.addEventListener('change', function () {
          const selectedTheme = this.value;
          document.documentElement.setAttribute('data-theme', selectedTheme);
          localStorage.setItem('selectedTheme', selectedTheme);
          updateLogo(selectedTheme);
          updateFavicon(selectedTheme);
      });
  }
});