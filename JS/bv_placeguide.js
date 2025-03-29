// Function to trigger the file input when clicking the "+ Photo" button
function triggerFileInput() {
    const fileInput = document.getElementById('photos');
    fileInput.click();  // Trigger the file input click event
}

// Initialize an array to store selected images
let imagesArray = [];

// Function to preview the selected images and keep adding to the existing ones
function previewImages() {
    const previewContainer = document.getElementById('image-preview');
    const files = document.getElementById('photos').files;

    // Loop through all selected files and preview them
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check if the image has already been added
        if (!imagesArray.some(img => img.name === file.name && img.size === file.size && img.type === file.type)) {
            const reader = new FileReader();

            reader.onload = function (event) {
                // Create the image container
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('image-container');

                // Create the image element
                const img = document.createElement('img');
                img.src = event.target.result;
                img.classList.add('preview-img');

                // Create the delete button (X)
                const closeButton = document.createElement('span');
                closeButton.textContent = 'X';
                closeButton.classList.add('close-button');
                closeButton.onclick = function () {
                    imgContainer.remove();  // Remove the image container
                    removeFileFromInput(i);  // Remove file from the file input
                    toggleAddPhotoButton();  // Check if the button should be hidden or shown
                    toggleFileInput();       // Show or hide file input based on image count
                    toggleImagePreviewContainer(); // Update container visibility
                };

                // Append image and close button to the container
                imgContainer.appendChild(img);
                imgContainer.appendChild(closeButton);

                // Append the container to the preview section
                previewContainer.appendChild(imgContainer);

                // Update container visibility
                toggleImagePreviewContainer();

                // Check if the button should be shown after adding the first image
                toggleAddPhotoButton();
                toggleFileInput();

                // Add the file to the images array to be included in the FormData
                imagesArray.push(file);
            };

            // Read the file as data URL
            reader.readAsDataURL(file);
        }
    }
}

// Function to remove the file from the file input list
function removeFileFromInput(index) {
    const fileInput = document.getElementById('photos');
    const dataTransfer = new DataTransfer(); // To modify the file list

    // Loop through all existing files in the input
    for (let i = 0; i < fileInput.files.length; i++) {
        if (i !== index) {
            dataTransfer.items.add(fileInput.files[i]); // Keep the files that are not removed
        }
    }

    fileInput.files = dataTransfer.files; // Update the file input
}

// Function to toggle the visibility of the "+ Photo" button
function toggleAddPhotoButton() {
    const previewContainer = document.getElementById('image-preview');
    const addButton = document.getElementById('add-photo-btn');
    
    // Show the button if there are images in the preview
    if (previewContainer.children.length > 0) {
        addButton.style.display = 'inline-block';  // Show button
    } else {
        addButton.style.display = 'none';  // Hide button
    }
}

// Function to toggle the visibility of the file input
function toggleFileInput() {
    const fileInput = document.getElementById('photos');
    
    // Hide the file input if there are images in the preview
    if (document.getElementById('image-preview').children.length > 0) {
        fileInput.style.display = 'none';
    } else {
        fileInput.style.display = 'inline-block';  // Show the file input if there are no images
    }
}

// Function to toggle the visibility of the image preview container
function toggleImagePreviewContainer() {
    const previewContainer = document.getElementById('image-preview');
    const imagePreviewContainer = document.querySelector('.image-preview-container'); // Get the container

    // Check if there are images in the preview
    if (previewContainer.children.length === 0) {
        imagePreviewContainer.style.display = 'none';  // Hide the container if empty
    } else {
        imagePreviewContainer.style.display = 'block'; // Show the container if not empty
    }
}

document.getElementById('place-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission

    const form = document.getElementById('place-form');
    const formData = new FormData(form); // Gather all form data, including files
    const loadingSpinner = document.getElementById('loading-spinner'); // Spinner element
    const submitButton = document.getElementById('add-place'); // Submit button

    // Append all images from the imagesArray to FormData
    imagesArray.forEach(function (imageFile) {
        // Check if the image is already added in the FormData object
        let isDuplicate = false;
        for (let pair of formData.entries()) {
            if (pair[0] === 'photos[]' && pair[1].name === imageFile.name && pair[1].size === imageFile.size) {
                isDuplicate = true;
                break;
            }
        }

        // If it's not a duplicate, append it to FormData
        if (!isDuplicate) {
            formData.append('photos[]', imageFile);  // Append each image file to 'photos' array in FormData
        }
    });

    // Show the spinner and disable the submit button
    loadingSpinner.style.display = 'block';
    submitButton.disabled = true;

    // Send the form data via AJAX
    fetch(form.action, {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json()) // Parse the JSON response from the server
        .then(data => {
            const successMessageDiv = document.getElementById('success-message');

            // Hide the spinner and enable the submit button
            loadingSpinner.style.display = 'none';
            submitButton.disabled = false;

            if (data.success) {
                // Display the success message
                successMessageDiv.textContent = data.message;
                successMessageDiv.style.display = 'block';
                successMessageDiv.style.color = 'green';

                // Reset the form completely
                form.reset();

                // Reset the file input
                const fileInput = document.getElementById('photos');
                fileInput.style.display = 'inline-block'; // Make sure it is visible again

                // Clear the image preview container
                const previewContainer = document.getElementById('image-preview');
                previewContainer.innerHTML = '';
                toggleImagePreviewContainer(); // Update visibility of the preview container

                // Reset the "+ Photo" button
                const addPhotoButton = document.getElementById('add-photo-btn');
                addPhotoButton.style.display = 'inline-block'; // Ensure the "+ Photo" button is visible

                // Hide the success message after 3 seconds
                setTimeout(function() {
                    successMessageDiv.style.display = 'none';  // Hide the success message
                }, 3000); // 3000 milliseconds = 3 seconds
            } else {
                // Display an error message
                successMessageDiv.textContent = data.message;
                successMessageDiv.style.display = 'block';
                successMessageDiv.style.color = 'red';

                // Hide the error message after 3 seconds
                setTimeout(function() {
                    successMessageDiv.style.display = 'none';  // Hide the error message
                }, 3000); // 3000 milliseconds = 3 seconds
            }
        })
        .catch(error => {
            console.error('Error:', error);

            // Hide the spinner and enable the submit button
            loadingSpinner.style.display = 'none';
            submitButton.disabled = false;

            const successMessageDiv = document.getElementById('success-message');
            successMessageDiv.textContent = 'An error occurred. Please try again.';
            successMessageDiv.style.display = 'block';
            successMessageDiv.style.color = 'red';

            // Hide the error message after 3 seconds
            setTimeout(function() {
                successMessageDiv.style.display = 'none';  // Hide the error message
            }, 3000); // 3000 milliseconds = 3 seconds
        });
});


// Fetch destinations and create buttons with search functionality
document.addEventListener('DOMContentLoaded', function () {
    const buttonContainer = document.getElementById('destination-buttons');
    const dataContainer = document.getElementById('destination-data');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');

    // Fetch destinations and create buttons
    fetch('../PHP/placeguide_handler.php?action=get_destinations')
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

            // Add place details
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
        // Remove the 'active' class from all buttons
        const allButtons = document.querySelectorAll('.destination-button');
        allButtons.forEach(btn => btn.classList.remove('active'));

        // Add the 'active' class to the clicked button
        button.classList.add('active');
    }

    // Function to toggle the search bar visibility
    function toggleSearchBar(show) {
        if (show) {
            searchContainer.style.display = 'block';  // Show the search bar
        } else {
            searchContainer.style.display = 'none';  // Hide the search bar
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

document.addEventListener("DOMContentLoaded", () => {
    const placeNameInput = document.getElementById("place-name");
    const placeNameError = document.getElementById("place-name-error");

    // Check real-time input as the user types
    placeNameInput.addEventListener("keyup", () => {
        const value = placeNameInput.value;
        const specialCharRegex = /^[^a-zA-Z0-9]/; // Matches if the first character is not a letter or digit

        // Show the error if the first character is a space or a special character
        if (value.startsWith(" ") || specialCharRegex.test(value)) {
            placeNameError.style.display = "block";
        } else {
            placeNameError.style.display = "none";
        }
    });

    // Check the field when it loses focus (blur event)
    placeNameInput.addEventListener("blur", () => {
        const value = placeNameInput.value.trim();
        const specialCharRegex = /^[^a-zA-Z0-9]/; // Matches if the first character is not a letter or digit

        // Show the error if the input starts with a special character or is too short
        if (value.length === 1 || specialCharRegex.test(value)) {
            placeNameError.style.display = "block";
        } else {
            placeNameError.style.display = "none";
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const locationInput = document.getElementById("location");
    const locationError = document.getElementById("location-error");

    // Check real-time input as the user types
    locationInput.addEventListener("keyup", () => {
        const value = locationInput.value;
        const specialCharRegex = /^[^a-zA-Z0-9]/; // Matches if the first character is not a letter or digit

        // Show the error if the first character is a space or a special character
        if (value.startsWith(" ") || specialCharRegex.test(value)) {
            locationError.style.display = "block";
        } else {
            locationError.style.display = "none";
        }
    });

    // Check the field when it loses focus (blur event)
    locationInput.addEventListener("blur", () => {
        const value = locationInput.value.trim();
        const specialCharRegex = /^[^a-zA-Z0-9]/; // Matches if the first character is not a letter or digit

        // Show the error if the input starts with a special character or is too short (1 character)
        if (value.length === 1 || specialCharRegex.test(value)) {
            locationError.style.display = "block";
        } else {
            locationError.style.display = "none";
        }
    });
});

function validateFiles() {
    const fileInput = document.getElementById("photos");
    const errorDiv = document.getElementById("file-error");

    if (fileInput.files.length === 0) {
        errorDiv.style.display = "block";  // Show error if no files selected
        return false;  // Prevent form submission
    }
    errorDiv.style.display = "none";  // Hide error if files are selected
    return true;  // Allow form submission
}

// Function to toggle the navigation menu
function toggleMenu() {
    const menu = document.getElementById("nav-menu");
    menu.classList.toggle("active");
  }