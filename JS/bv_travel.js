// Show the modal when 'Add Travel' is clicked
document.getElementById('add-travel').addEventListener('click', function() {
    document.getElementById('add-travel-modal').style.display = 'block';
});

// Close the modal when the close (X) button is clicked
document.getElementById('close-modal-btn').addEventListener('click', function() {
    document.getElementById('add-travel-modal').style.display = 'none';
});

// Close the modal when the user clicks outside of it
window.addEventListener('click', function(e) {
    const addTravelModal = document.getElementById('add-travel-modal');
    
    // If the click target is not inside the modal content
    if (e.target === addTravelModal) {
        addTravelModal.style.display = 'none';
    }
});

// Automatically close the modal when 'Add a New Travel' button is clicked
document.getElementById('create-travel-btn').addEventListener('click', function() {
    document.getElementById('add-travel-modal').style.display = 'none';
    // Your existing logic to open the "New Travel" modal
    const newTravelModal = document.getElementById('new-travel-modal');
    newTravelModal.style.display = 'block';

    // Generate a random share code
    const shareCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    document.getElementById('share-code').value = shareCode;
});

// Automatically close the modal when 'Join with a Code' button is clicked
document.getElementById('join-travel-btn').addEventListener('click', function() {
    document.getElementById('add-travel-modal').style.display = 'none';
});

// Open the modal for creating a new travel
document.getElementById('create-travel-btn').addEventListener('click', function() {
    const newTravelModal = document.getElementById('new-travel-modal');
    newTravelModal.style.display = 'block';

    // Generate a random share code
    const shareCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    document.getElementById('share-code').value = shareCode;
});

// Close the new travel modal
document.getElementById('cancel-travel-btn').addEventListener('click', function() {
    document.getElementById('new-travel-modal').style.display = 'none';
});

// Submit the new travel form
document.getElementById('new-travel-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission

    // Collect form data (no need for travel description)
    const travelName = document.getElementById('travel-name').value;
    const shareCode = document.getElementById('share-code').value;

    // Send data to the backend using Fetch API
    fetch('../PHP/create_travel.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            travel_name: travelName,
            share_code: shareCode
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Close the modal
            document.getElementById('new-travel-modal').style.display = 'none';

            // Refresh the page
            location.reload();
        } else {
            alert('Failed to create travel. ' + (data.message || 'Please try again.'));
        }
    })
    .catch(error => console.error('Error:', error));
});

document.addEventListener('DOMContentLoaded', function() {
    // Fetch the created travels from the backend
    fetch('../PHP/fetch_travels.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const travels = data.travels;
                const travelWidgetsContainer = document.querySelector('.travel-widgets');

                // Loop through the fetched travels and create a widget for each
                travels.forEach(travel => {
                    // Create a new travel widget
                    const travelWidget = document.createElement('div');
                    travelWidget.classList.add('travel-widget');
                    travelWidget.classList.add('created-travel');
                    travelWidget.dataset.id = travel.id;
                    
                    // Create the travel widget content (name, logo)
                    travelWidget.innerHTML = `
                        <img src="../Images/bv_logo.png" alt="Travel Logo" class="travel-logo">
                        <span class="travel-name">${travel.travel_name}</span>
                    `;  

                    // Create ellipsis menu for options (edit, delete, share code)
                    const ellipsisMenu = document.createElement('div');
                    ellipsisMenu.classList.add('ellipsis-menu');
                    ellipsisMenu.innerHTML = `
                        <i class="fa fa-ellipsis-v"></i>
                    `;

                    // Create menu options container
                    const menuOptions = document.createElement('div');
                    menuOptions.classList.add('menu-options');
                    menuOptions.id = `menu-options-${travel.id}`;

                    // Create the role badge inside the menu options
                    const roleBadge = document.createElement('span');
                    roleBadge.classList.add('role-badge', travel.role); // Dynamically add 'creator' or 'collaborator' class
                    roleBadge.textContent = travel.role.charAt(0).toUpperCase() + travel.role.slice(1); // Capitalize the role name

                    // Add edit, delete, and share code buttons
                    menuOptions.innerHTML += `
                        <button class="edit-btn" data-id="${travel.id}">Edit</button>
                        <button class="delete-btn" data-id="${travel.id}">Delete</button>
                        <button class="share-code-btn" data-id="${travel.id}">View Share Code</button>
                    `;

                    // Append the role badge to the menu options
                    menuOptions.appendChild(roleBadge);

                    // Append ellipsis and menu options to the travel widget
                    travelWidget.appendChild(ellipsisMenu);
                    travelWidget.appendChild(menuOptions);

                    // Append the widget to the container
                    travelWidgetsContainer.appendChild(travelWidget);
                });
            } else {
                console.error('Failed to fetch travels:', data.message);
            }
        })
        .catch(error => console.error('Error fetching travels:', error));

        //function 
});

// Handle the ellipsis menu actions
document.addEventListener('click', function(e) {
    // Check if the clicked element is an ellipsis
    if (e.target.classList.contains('fa-ellipsis-v')) {
        const menuOptions = e.target.closest('.travel-widget').querySelector('.menu-options');
        menuOptions.style.display = 'block';
    }

    if (e.target.classList.contains('travel-logo')) {
        //alert("Z");
        const travelWidget = e.target.closest('.travel-widget');
        const travelId = travelWidget.dataset.id; // Get the travel ID from the parent travel widget
        console.log(`Image in travel widget with ID: ${travelId} clicked!`);
        // Perform an action, such as navigation
        window.location.href = `../User_HTML/bv_itinerary.html?travel_id=${travelId}`;
    }

    // Close the menu if clicked anywhere else
    if (!e.target.closest('.travel-widget')) {
        const openMenus = document.querySelectorAll('.menu-options');
        openMenus.forEach(menu => menu.style.display = 'none');
        //window.location.href = `../User_HTML/bv_itinerary.html?travel_id=${travel.id}`;
    }
});

// Handle dynamically created Edit and Delete buttons using event delegation
document.querySelector('.travel-widgets').addEventListener('click', function(e) {
    if (e.target.classList.contains('edit-btn')) {
        const travelId = e.target.dataset.id;
        const travelName = e.target.closest('.travel-widget').querySelector('.travel-name').textContent;

        // Populate modal with current travel name
        document.getElementById('edit-travel-name').value = travelName;
        document.getElementById('edit-travel-id').value = travelId;
        document.getElementById('edit-travel-modal').style.display = 'block';
    }

    if (e.target.classList.contains('delete-btn')) {
        const travelId = e.target.dataset.id;

        // Show the confirmation modal
        document.getElementById('confirmation-modal').style.display = 'block';
        
        // Save the travelId in a global variable to reference it later
        window.travelIdToDelete = travelId;
    }
});

// Cancel the deletion when the user clicks "Cancel"
document.getElementById('cancel-delete-btn').addEventListener('click', function() {
    document.getElementById('confirmation-modal').style.display = 'none';
});

// Confirm the deletion when the user clicks "Yes, Delete"
document.getElementById('confirm-delete-btn').addEventListener('click', function() {
    const travelId = window.travelIdToDelete;

    // Send the delete request to the backend
    fetch('../PHP/delete_travel.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ travel_id: travelId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Remove the travel widget from the UI
            const travelWidget = document.querySelector(`.travel-widget[data-id="${travelId}"]`);
            travelWidget.remove();
        } else {
            alert('Failed to delete travel.');
        }

        // Close the confirmation modal
        document.getElementById('confirmation-modal').style.display = 'none';
    });
});

// Submit the edit form from the modal
document.getElementById('edit-travel-form').addEventListener('submit', function(e) {
    e.preventDefault();  // Prevent form submission

    const newTravelName = document.getElementById('edit-travel-name').value;
    const travelId = document.getElementById('edit-travel-id').value;

    fetch('../PHP/edit_travel.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ travel_name: newTravelName, travel_id: travelId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update the UI with the new travel name
            const travelNameElement = document.querySelector(`.travel-widget[data-id="${travelId}"] .travel-name`);
            travelNameElement.textContent = newTravelName;

            // Close the modal
            document.getElementById('edit-travel-modal').style.display = 'none';
        } else {
            alert('Failed to update travel name.');
        }
    });
});

// Handle the 'View Share Code' button click
document.querySelector('.travel-widgets').addEventListener('click', function(e) {
    if (e.target.classList.contains('share-code-btn')) {
        const travelId = e.target.dataset.id;

        // Fetch the share code from the backend
        fetch('../PHP/fetch_share_code.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ travel_id: travelId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Display the share code inside the modal
                document.getElementById('share-code-display').textContent = data.share_code;
                document.getElementById('share-code-modal').style.display = 'block';
            } else {
                alert('Failed to fetch share code.');
            }
        })
        .catch(error => console.error('Error:', error));
    }
});

// Close the share code modal
document.getElementById('close-share-code-modal').addEventListener('click', function() {
    document.getElementById('share-code-modal').style.display = 'none';
});

// Copy the share code to the clipboard
document.getElementById('copy-share-code-btn').addEventListener('click', function() {
    const shareCodeText = document.getElementById('share-code-display').textContent;

    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = shareCodeText;
    document.body.appendChild(textarea);

    // Select the text and copy it to the clipboard
    textarea.select();
    document.execCommand('copy');

    // Remove the temporary textarea
    document.body.removeChild(textarea);

    // Show the toast message
    const toast = document.getElementById('toast');
    toast.classList.add('show');

    // Hide the toast after 2 seconds
    setTimeout(function() {
        toast.classList.remove('show');
    }, 2000);  // Toast will stay visible for  seconds
});

// Close the modal if clicked outside the modal content
window.addEventListener('click', function(e) {
    if (e.target === document.getElementById('share-code-modal')) {
        document.getElementById('share-code-modal').style.display = 'none';
    }
});

// Open the join travel modal when the "Join with a Code" button is clicked
document.getElementById('join-travel-btn').addEventListener('click', function() {
    document.getElementById('join-travel-modal').style.display = 'block'; // Show modal
});

// Close modal when the close button is clicked
document.getElementById('close-modal-btn2').addEventListener('click', function() {
    document.getElementById('join-travel-modal').style.display = 'none'; // Hide the modal
});

// Close modal when the user clicks outside of the modal content
window.addEventListener('click', function(e) {
    const modal = document.getElementById('join-travel-modal');
    
    // Check if the click was outside of the modal content area
    if (e.target === modal) {
        modal.style.display = 'none'; // Close the modal
    }
});

// Handle the "Join Travel" button click event
document.getElementById('submit-share-code-btn').addEventListener('click', function () {
    const shareCode = document.getElementById('share-code-input').value.trim(); // Get the input value

    if (shareCode) {
        // Send the share code to the backend to verify and join the travel
        fetch('../PHP/join_travel.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ share_code: shareCode }) // Send the share code as JSON
        })
        .then(response => response.json())
        .then(data => {
            const modal = document.getElementById('response-modal'); // Reference to the modal
            const modalMessage = document.getElementById('response-modal-message'); // Reference to the modal message container

            if (data.success) {
                modalMessage.textContent = data.message; // Set the success message
                modal.classList.add('success'); // Add a success class for styling (optional)
                modal.style.display = 'block'; // Show the modal
                document.getElementById('join-travel-modal').style.display = 'none'; // Close the input modal
                setTimeout(() => location.reload(), 2000); // Reload to reflect changes after 2 seconds
            } else {
                modalMessage.textContent = data.message; // Set the error message
                modal.classList.add('error'); // Add an error class for styling (optional)
                modal.style.display = 'block'; // Show the modal
            }
        })
        .catch(error => {
            console.error('Error:', error); // Handle any errors
        });
    } else {
        const errorContainer = document.getElementById('join-error'); // Reference to the error container
        errorContainer.textContent = 'Please enter a share code.'; // Set the error message
        errorContainer.style.display = 'block'; // Show the error container
    }
});

// Event listener to close the modal
document.getElementById('close-modal-btn').addEventListener('click', function () {
    const modal = document.getElementById('response-modal');
    modal.style.display = 'none'; // Hide the modal
    modal.classList.remove('success', 'error'); // Remove any status classes
});

// Create a role badge (either 'Creator' or 'Collaborator')
const roleBadge = document.createElement('span');
roleBadge.classList.add('role-badge');
//roleBadge.textContent = travel.role.charAt(0).toUpperCase() + travel.role.slice(1); // Capitalize the role name

// Toggle the visibility of the menu options when the ellipsis menu is clicked
// ellipsisMenu.addEventListener('click', function(event) {
//     const menu = travelWidget.querySelector('.menu-options');
//     menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
// });

// Fetch and display itineraries as buttons
document.addEventListener("DOMContentLoaded", function () {
    fetchItineraries();

    function fetchItineraries() {
        fetch('../PHP/fetch_itineraries.php')
            .then(response => response.json())
            .then(data => {
                const itineraryButtons = document.getElementById('itinerary-buttons');
                itineraryButtons.innerHTML = ''; // Clear any existing buttons

                data.forEach(itinerary => {
                    const button = document.createElement('button');
                    button.textContent = `${itinerary.destination} (${itinerary.duration_days}D ${itinerary.duration_nights}N)`;
                    button.classList.add('itinerary-btn');
                    button.setAttribute('data-id', itinerary.id);
                    itineraryButtons.appendChild(button);
                });
            })
            .catch(error => {
                console.error('Error fetching itineraries:', error);
            });
    }

    // Event listener for itinerary button clicks
    document.getElementById('itinerary-buttons').addEventListener('click', function (event) {
        if (event.target.classList.contains('itinerary-btn')) {
            const itineraryId = event.target.getAttribute('data-id');
            fetch(`../PHP/fetch_itinerary_details.php?id=${itineraryId}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);  // Log the data to check the structure
                    displayModal(data);
                })
                .catch(error => {
                    console.error('Error fetching itinerary details:', error);
                });
        }
    });

    function displayModal(data) {
        const modal = document.getElementById('itinerary-modal');
        const modalContent = document.getElementById('modal-content');
        
        // Check if data exists and log to debug
        if (!data || !data.itinerary || !data.days) {
            console.error('Invalid data received:', data);
            return;
        }
    
        // Populate modal with data
        modalContent.innerHTML = `
            <h1>${data.itinerary.destination}</h1>
            <p><strong>Duration:</strong> ${data.itinerary.duration_days} Days ${data.itinerary.duration_nights} Nights</p>
            <p style="margin-bottom: 30px;"><strong>Lodging:</strong> ${data.itinerary.lodging}</p>
            <div id="schedule-container">
                ${data.days.map(day => `
                    <div class="day-container">
                        <h2>Day ${day.day_number}</h2>
                        <!-- Table for activities -->
                        <table class="activity-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Activity</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${day.activities.map(activity => `
                                    <tr>
                                        <td style="text-align: center; font-weight:">${activity.start_time} - ${activity.end_time}</td>
                                        <td>${activity.activity}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `).join('')}
            </div>
            <button id="modal-close" class="modal-close">&times;</button> <!-- Close button inside the modal -->
        `;
    
        // Show modal
        modal.style.display = 'block';
        
        // Close modal when the close button is clicked
        document.getElementById('modal-close').addEventListener('click', function () {
            modal.style.display = 'none';
        });
    
        // Close modal when clicking outside of it
        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    
        // Adding event listener to the delete button inside the modal
        document.getElementById('delete-itinerary').addEventListener('click', function() {
            const itineraryId = data.itinerary.id; // Get the itinerary ID from the modal data
            deleteItinerary(itineraryId);
        });
    }
});
