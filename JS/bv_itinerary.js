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

        computeItineraryDuration(data.itinerary_days);

        toggleEditMode(true);
      } else {
        toggleEditMode(false);
        $("#client-name").val(data.FullName);
        $("#destination").val(data.travel_name);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching itinerary data:", error);
      console.error("XHR:", xhr);
      console.error("Status:", status);
    },
  });
});

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

  // Hide the "Add Itinerary" button initially
  //   document.querySelector(".add-itinerary-btn").style.display = "none";

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

      // Show the "Submit" button only if there's at least one day-container
      console.log(duration);
      if (!duration) {
        // document.querySelector(".add-itinerary-btn").style.display =
        //   "inline-block";
        durationText.innerHTML = `<b>Duration:</b> Invalid Dates`;
        mainDayContainer.innerHTML = ""; // Clear day containers
        saveBtn.style.display = "none"; // Hide the button if dates are invalid
      }
    }
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
    modal.querySelector(".close").addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  updateDuration();
}

document.addEventListener("DOMContentLoaded", () => {
  toggleEditMode(false);
  // localStorage.setItem("isSaveMode", "false"); // Save the mode

  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");

  startDateInput.value = "";
  endDateInput.value = "";

  startDateInput.addEventListener("change", () => {
    computeItineraryDuration();
  });
  endDateInput.addEventListener("change", () => {
    computeItineraryDuration();
  });
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

// Check if the page is in "save mode" from localStorage
// if (localStorage.getItem("isSaveMode") === "true") {
//   toggleEditMode(false);
// }

// Add click event to the save button
saveBtn.addEventListener("click", () => {
  toggleEditMode(true);
});

editBtn.addEventListener("click", () => {
  toggleEditMode(false);
});

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

  if (isEditMode) {
    saveBtn.style.display = "none";
    editBtn.style.display = "block";
  } else {
    saveBtn.style.display = "block";
    editBtn.style.display = "none";
  }

  //   // Store values in localStorage when in Save Mode, or restore them in Edit Mode
  //   if (!isEditable) {
  //     // Save the current values for both standard and dynamic inputs to localStorage
  //     inputs.forEach((input, index) => {
  //       localStorage.setItem(`input-${index}`, input.value);
  //     });

  //     // Also save time slot values
  //     timeSlotInputs.forEach((input, index) => {
  //       localStorage.setItem(`timeSlot-${index}`, input.value);
  //     });
  //   } else {
  //     // Restore values from localStorage when switching to Edit Mode
  //     inputs.forEach((input, index) => {
  //       input.value = localStorage.getItem(`input-${index}`) || "";
  //     });

  //     // Restore time slot values from localStorage
  //     timeSlotInputs.forEach((input, index) => {
  //       input.value = localStorage.getItem(`timeSlot-${index}`) || "";
  //     });
  //   }
}
