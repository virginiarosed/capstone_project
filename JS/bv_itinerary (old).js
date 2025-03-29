document.addEventListener("DOMContentLoaded", function () {
    // Get itinerary_id from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const itineraryId = urlParams.get('itinerary_id'); // Assuming the URL is like: bv_itinerary.html?itinerary_id=123

    if (!itineraryId) {
        alert("Itinerary ID is missing!");
        return;
    }

    // Fetch itinerary data from the server based on itinerary_id
    fetch(`/PHP/get_itinerary.php?itinerary_id=${itineraryId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Populate the form with the fetched data
                document.getElementById("client-name").value = data.itinerary.client_name;
                document.getElementById("destination").value = data.itinerary.destination;
                document.getElementById("start-date").value = data.itinerary.start_date;
                document.getElementById("end-date").value = data.itinerary.end_date;
                document.getElementById("lodging").value = data.itinerary.lodging;

                // Dynamically generate days based on the fetched data
                generateDayContainers(data.itinerary.days, data.itinerary.start_date);
            } else {
                alert("Failed to fetch itinerary data.");
            }
        })
        .catch(error => {
            console.error("Error fetching itinerary data:", error);
        });

    // Generate day containers dynamically
    function generateDayContainers(days, startDate) {
        const mainDayContainer = document.getElementById("main-day-container");
        mainDayContainer.innerHTML = ""; // Clear existing containers

        days.forEach((day, index) => {
            const dayContainer = document.createElement("div");
            dayContainer.classList.add("day-container");
            dayContainer.innerHTML = `
                <h3>Day ${index + 1}: ${day.date} (${day.dayOfWeek})</h3>
                <div class="time-slots-container" id="time-slots-day-${index + 1}">
                    <!-- Time slots will be added here -->
                </div>
                <button type="button" class="add-time-btn" data-day="${index + 1}">+ Add Time</button>
            `;
            mainDayContainer.appendChild(dayContainer);

            // Populate time slots for the day
            day.time_slots.forEach(slot => {
                addTimeSlot(index + 1, slot.start_time, slot.end_time, slot.activity);
            });
        });
    }

    // Function to add a time slot to a day container
    function addTimeSlot(dayNumber, startTime, endTime, activity) {
        const timeSlotsContainer = document.getElementById(`time-slots-day-${dayNumber}`);
        const timeSlotDiv = document.createElement("div");
        timeSlotDiv.classList.add("time-slot");

        timeSlotDiv.innerHTML = `
            <div class="form-group time-slot-row">
                <input type="time" name="time_range[${dayNumber}][]" value="${startTime}" required>
                <input type="time" name="time_range[${dayNumber}][]" value="${endTime}" required>
                <input type="text" name="activity[${dayNumber}][]" value="${activity}" placeholder="Activity..." required>
                <button type="button" class="delete-time-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        timeSlotsContainer.appendChild(timeSlotDiv);
    }

    // Add event listeners for time slot deletion
    document.addEventListener('click', function (event) {
        if (event.target && event.target.matches('.delete-time-btn')) {
            event.target.closest('.time-slot').remove();
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");
    const durationText = document.getElementById("duration-text");
    const mainDayContainer = document.getElementById("main-day-container");
    const form = document.getElementById("itinerary-form");

    // Hide the "Add Itinerary" button initially
    document.querySelector('.add-itinerary-btn').style.display = 'none'; 

    // Listen for changes in the start and end dates
    function updateDuration() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (startDate && endDate && startDate <= endDate) {
            // Calculate the duration in days
            const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start day
            const nights = duration > 1 ? duration - 1 : 0; // Nights is duration - 1, but can't be less than 0
            const dayText = duration === 1 ? "Day" : "Days";
            const nightText = nights === 1 ? "Night" : (nights === 0 ? "Night" : "Nights"); 

            // Update the duration text
            durationText.innerHTML = `<b>Duration:</b> ${duration} ${dayText}, ${nights} ${nightText}`;

            // Generate day containers
            generateDayContainers(duration, startDate);

            // Show the "Submit" button only if there's at least one day-container
            if (duration > 0) {
                document.querySelector('.add-itinerary-btn').style.display = 'inline-block';
            }
        } else {
            durationText.innerHTML = `<b>Duration:</b> Invalid Dates`;
            mainDayContainer.innerHTML = ""; // Clear day containers
            document.querySelector('.add-itinerary-btn').style.display = 'none'; // Hide the button if dates are invalid
        }
    }

    // Generate day containers dynamically
    function generateDayContainers(duration, startDate) {
        mainDayContainer.innerHTML = ""; // Clear existing containers
        for (let i = 0; i < duration; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + i);

            // Format the date as 'Day #: Date (Day)'
            const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' }); // Get the day of the week
            const date = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            const dayContainer = document.createElement("div");
            dayContainer.classList.add("day-container");
            dayContainer.innerHTML = `
                <h3>Day ${i + 1}: ${date} (${dayOfWeek})</h3>
                <div class="time-slots-container" id="time-slots-day-${i + 1}">
                    <!-- Time slots will be added here -->
                </div>
                <button type="button" class="add-time-btn" data-day="${i + 1}">+ Add Time</button>
            `;
            mainDayContainer.appendChild(dayContainer);
        }

        // Add event listeners for "Add Time Slot" buttons
        document.querySelectorAll(".add-time-btn").forEach(button => {
            button.addEventListener("click", function () {
                const dayNumber = this.getAttribute("data-day");
                addTimeSlot(dayNumber);
            });
        });
    }

    // Add a new time slot dynamically
    function addTimeSlot(dayNumber) {
        const timeSlotsContainer = document.getElementById(`time-slots-day-${dayNumber}`);
        const timeSlotDiv = document.createElement("div");
        timeSlotDiv.classList.add("time-slot");

        const uniqueId = Date.now(); // Unique ID for delete functionality
        timeSlotDiv.setAttribute("data-id", uniqueId);

        timeSlotDiv.innerHTML = ` 
           <div class="form-group time-slot-row">
                <input type="time" name="time_range[${dayNumber}][]" required>
                <input type="time" name="time_range[${dayNumber}][]" required>
                <input type="text" name="activity[${dayNumber}][]" placeholder="Activity..." required>
                <button type="button" class="delete-time-btn" data-id="${uniqueId}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        timeSlotsContainer.appendChild(timeSlotDiv);

        timeSlotDiv.querySelector(".delete-time-btn").addEventListener("click", function () {
            deleteTimeSlot(uniqueId);
        });
    }

    // Delete a specific time slot
    function deleteTimeSlot(uniqueId) {
        const timeSlot = document.querySelector(`.time-slot[data-id="${uniqueId}"]`);
        if (timeSlot) {
            timeSlot.remove();
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

    // Handle form submission and show modal
document.querySelector(".add-itinerary-btn").addEventListener("click", function () {
    const dayNumbers = [];
    const dates = [];
    const days = [];
    const startTimes = [];
    const endTimes = [];
    const activities = [];

    // Collect day-wise data
    document.querySelectorAll(".day-container").forEach(function (dayContainer, index) {
        const dayNumber = index + 1;
    
        // Get the date and convert to YYYY-MM-DD format using local time
        const currentDate = new Date(dayContainer.querySelector("h3").innerText.split(":")[1].split("(")[0].trim());
        
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');  // Month is 0-based, so add 1
        const dayOfMonth = String(currentDate.getDate()).padStart(2, '0');  // Ensure two digits for the day
    
        const formattedDate = `${year}-${month}-${dayOfMonth}`;  // Format as YYYY-MM-DD
    
        const dayOfWeek = dayContainer.querySelector("h3").innerText.split("(")[1].split(")")[0].trim(); // Get the day of the week
    
        // Collect time slot data for the day
        const timeSlots = dayContainer.querySelectorAll(".time-slot");
        timeSlots.forEach(function (timeSlot) {
            const startTime = timeSlot.querySelector("input[name^='time_range']").value;
            const endTime = timeSlot.querySelector("input[name^='time_range']").value;
            const activity = timeSlot.querySelector("input[name^='activity']").value;
    
            // Push values into the respective arrays
            dayNumbers.push(dayNumber);
            dates.push(formattedDate); // Push the properly formatted date
            days.push(dayOfWeek); // Use dayOfWeek instead of day
            startTimes.push(startTime);
            endTimes.push(endTime);
            activities.push(activity);
        });
    });    

    // Add hidden inputs for day data before submitting the form
    dayNumbers.forEach(function (value, index) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "day_number[]";
        input.value = value;
        form.appendChild(input);
    });

    // Repeat for other day data arrays
    dates.forEach(function (value, index) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "date[]";
        input.value = value;
        form.appendChild(input);
    });

    days.forEach(function (value, index) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "day[]";
        input.value = value;
        form.appendChild(input);
    });

    startTimes.forEach(function (value, index) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "start_time[]";
        input.value = value;
        form.appendChild(input);
    });

    endTimes.forEach(function (value, index) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "end_time[]";
        input.value = value;
        form.appendChild(input);
    });

    activities.forEach(function (value, index) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "activity[]";
        input.value = value;
        form.appendChild(input);
    });

    const formData = new FormData(form);

    fetch('submit_customized_itinerary.php', { // I still don't have submit_customized_itinerary.php file
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        // Handle success
        if (data.includes("Itinerary has been successfully added")) {
            showModal("Itinerary has been successfully added!", false); // Success message
            form.reset(); // Reset form
            document.getElementById("duration-text").innerHTML = ""; // Clear duration text
            document.getElementById("main-day-container").innerHTML = ""; // Clear day containers
            document.querySelector('.add-itinerary-btn').style.display = 'none'; // Hide button
        } else {
            showModal("There was an error submitting your itinerary. \nPlease fill up all the required fields.", true); // Error message
        }
    })
    .catch(error => {
        showModal("Error: " + error.message, true);
    });
});

    // Add event listeners
    startDateInput.addEventListener("change", updateDuration);
    endDateInput.addEventListener("change", updateDuration);
});

document.addEventListener('DOMContentLoaded', function () {
    const buttonContainer = document.getElementById('destination-buttons');
    const dataContainer = document.getElementById('destination-data');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');

    // Fetch destinations and create buttons
    fetch('../PHP/placeguide_handler.php?action=get_destinations')  // Modify if needed based on your server-side logic
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                data.destinations.forEach(destination => {
                    const button = document.createElement('button');
                    button.textContent = destination;
                    button.classList.add('destination-button');
                    button.onclick = () => {
                        loadDestinationData(destination);
                        setActiveButton(button); // Set this button as active
                        toggleSearchBar(true); // Show the search bar
                    };
                    buttonContainer.appendChild(button);
                });
            }
        })
        .catch(error => console.error('Error fetching destinations:', error));

    // Function to load destination data
    function loadDestinationData(destination) {
        fetch(`../PHP/placeguide_handler.php?action=get_places&destination=${encodeURIComponent(destination)}&search=${searchInput.value}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayDestinationData(destination, data.places);
                } else {
                    dataContainer.innerHTML = `<p>No data available for ${destination}.</p>`;
                }
            })
            .catch(error => console.error('Error fetching places:', error));
    }

    // Function to display destination data
    function displayDestinationData(destination, places) {
        dataContainer.innerHTML = `<h2 class="destination-title">Places in ${destination}</h2>`;
        places.forEach(place => {
            const placeDiv = document.createElement('div');
            placeDiv.classList.add('place-item');

            placeDiv.innerHTML = `
                <h3>${place.place_name}</h3>
                <p><strong>Location:<br></strong> ${place.location}</p>
                <p><strong>Description:<br></strong> ${place.description}</p>
                <p><strong>Activities:</strong> ${place.activitiesHtml}</p>
                <div class="images">
                    ${place.images.map(image => `<img src="../uploads/${image}" alt="Place image" class="place-image">`).join('')}
                </div>
            `;
            dataContainer.appendChild(placeDiv);
        });
    }

    // Function to set the active button
    function setActiveButton(button) {
        const allButtons = document.querySelectorAll('.destination-button');
        allButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    // Function to toggle the search bar visibility
    function toggleSearchBar(show) {
        if (show) {
            searchContainer.style.display = 'block';
        } else {
            searchContainer.style.display = 'none';
        }
    }

    // Real-time search
    searchInput.addEventListener('input', function () {
        const destination = document.querySelector('.destination-button.active');
        if (destination) {
            loadDestinationData(destination.textContent);  // Trigger search with the current active destination
        }
    });
});
