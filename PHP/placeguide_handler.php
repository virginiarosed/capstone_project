<?php

include('../PHP/db_connection.php');

// Handle POST request to add a place guide
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $destination = $_POST['destination'];
    $place_name = $_POST['place-name'];
    $location = $_POST['location'];
    $description = $_POST['place-description'];
    $activities = $_POST['activities'];

    $stmt = $conn->prepare("INSERT INTO places (destination, place_name, location, description, activities) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $destination, $place_name, $location, $description, $activities);
    if ($stmt->execute()) {
        $place_id = $stmt->insert_id;
        $stmt->close();

        // Handle file uploads
        if (isset($_FILES['photos'])) {
            $uploadDir = '../uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            foreach ($_FILES['photos']['tmp_name'] as $index => $tmpName) {
                if ($_FILES['photos']['error'][$index] === UPLOAD_ERR_OK) {
                    $fileName = basename($_FILES['photos']['name'][$index]);
                    $filePath = $uploadDir . uniqid() . "_" . $fileName;

                    if (move_uploaded_file($tmpName, $filePath)) {
                        $stmt = $conn->prepare("INSERT INTO place_images (place_id, image_path) VALUES (?, ?)");
                        $stmt->bind_param("is", $place_id, $filePath);
                        $stmt->execute();
                        $stmt->close();
                    }
                }
            }
        }
        echo json_encode(['success' => true, 'message' => "Place Guide added successfully!"]);
    } else {
        echo json_encode(['success' => false, 'message' => "Failed to add Place Guide."]);
    }
    exit;
}

// Handle GET request to fetch unique destinations
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_destinations') {
    $query = "SELECT DISTINCT destination FROM places";
    $result = $conn->query($query);

    $destinations = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $destinations[] = $row['destination'];
        }
    }
    echo json_encode(['success' => true, 'destinations' => $destinations]);
    exit;
}

// Handle GET request to fetch places by destination with optional search query
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_places') {
    $destination = $_GET['destination'];
    $searchQuery = isset($_GET['search']) ? $_GET['search'] : '';  // Handle search query if provided

    // Query to fetch places based on destination and search query
    $query = "SELECT * FROM places WHERE destination = ?";
    if (!empty($searchQuery)) {
        $query .= " AND place_name LIKE ?";  // Add search condition for place name
    }

    $stmt = $conn->prepare($query);

    if (!empty($searchQuery)) {
        $searchTerm = "%" . $searchQuery . "%";  // Wildcard search for place names
        $stmt->bind_param("ss", $destination, $searchTerm);
    } else {
        $stmt->bind_param("s", $destination);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $places = [];
    while ($row = $result->fetch_assoc()) {
        $placeId = $row['id'];
        $row['images'] = [];

        $imageStmt = $conn->prepare("SELECT image_path FROM place_images WHERE place_id = ?");
        $imageStmt->bind_param("i", $placeId);
        $imageStmt->execute();
        $imageResult = $imageStmt->get_result();

        while ($imageRow = $imageResult->fetch_assoc()) {
            $row['images'][] = $imageRow['image_path'];
        }

        // Process activities into a bulleted list with custom CSS
        $activities = explode("\n", $row['activities']);
        $activitiesHtml = '<ul class="activities-list" style="margin-left: 20px;">';
        foreach ($activities as $activity) {
            $activitiesHtml .= '<li>' . htmlspecialchars(trim($activity)) . '</li>';
        }
        $activitiesHtml .= '</ul>';

        // Add the formatted activities as a new field
        $row['activitiesHtml'] = $activitiesHtml;

        $places[] = $row;
    }
    echo json_encode(['success' => true, 'places' => $places]);
    exit;
}

// Default response for invalid requests
echo json_encode(['success' => false, 'message' => "Invalid request."]);
$conn->close();
?>