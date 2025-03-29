// Show the modal when 'Add Travel' is clicked
document.getElementById('add-travel').addEventListener('click', function() {
    document.getElementById('add-travel-modal').style.display = 'block';
});

// Close the modal when the close (X) button is clicked
document.getElementById('close-modal-btn').addEventListener('click', function() {
    document.getElementById('add-travel-modal').style.display = 'none';
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
});

// Handle the ellipsis menu actions
document.addEventListener('click', function(e) {
    // Check if the clicked element is an ellipsis
    if (e.target.classList.contains('fa-ellipsis-v')) {
        const menuOptions = e.target.closest('.travel-widget').querySelector('.menu-options');
        menuOptions.style.display = 'block';
    }

    // Close the menu if clicked anywhere else
    if (!e.target.closest('.travel-widget')) {
        const openMenus = document.querySelectorAll('.menu-options');
        openMenus.forEach(menu => menu.style.display = 'none');
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

    // Optionally, show a success message to the user
    alert('Share code copied to clipboard!');
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
document.getElementById('close-modal-btn').addEventListener('click', function() {
    document.getElementById('join-travel-modal').style.display = 'none'; // Hide modal
});

// Handle the "Join Travel" button click event
// Handle the "Join Travel" button click event
document.getElementById('submit-share-code-btn').addEventListener('click', function() {
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
            if (data.success) {
                alert(data.message); // Show success message
                document.getElementById('join-travel-modal').style.display = 'none'; // Close modal
                location.reload(); // Reload to reflect changes
            } else {
                document.getElementById('join-error').style.display = 'block'; // Show error message if invalid
            }
        })
        .catch(error => {
            console.error('Error:', error); // Handle any errors
        });
    } else {
        document.getElementById('join-error').textContent = 'Please enter a share code.'; // Show error if no input
        document.getElementById('join-error').style.display = 'block'; // Display the error message
    }
});

// Create a role badge (either 'Creator' or 'Collaborator')
const roleBadge = document.createElement('span');
roleBadge.classList.add('role-badge');
roleBadge.textContent = travel.role.charAt(0).toUpperCase() + travel.role.slice(1); // Capitalize the role name

// Add specific class for creator or collaborator
roleBadge.classList.add(travel.role); // Dynamically add 'creator' or 'collaborator' class

// Append the role badge after the travel name
travelWidget.appendChild(roleBadge);

// Toggle the visibility of the menu options when the ellipsis menu is clicked
ellipsisMenu.addEventListener('click', function(event) {
    const menu = travelWidget.querySelector('.menu-options');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
});
