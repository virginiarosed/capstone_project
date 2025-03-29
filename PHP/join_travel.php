<?php
session_start();
require '../PHP/db_connection.php'; // Include DB connection

// Read the incoming JSON request
$input = json_decode(file_get_contents('php://input'), true);

// Ensure the share code is provided
if (isset($input['share_code'])) {
    $shareCode = $input['share_code'];
    
    // Step 1: Validate the share code (check if it exists in the database)
    $sql = "SELECT id, travel_name FROM create_travel WHERE share_code = ? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $shareCode); // Bind the share code as string
    $stmt->execute();
    $result = $stmt->get_result();
    
    // Step 2: Check if the share code exists
    if ($result->num_rows > 0) {
        // Share code exists, now add the user as a collaborator
        $travel = $result->fetch_assoc();
        $travelId = $travel['id'];

        // Assuming the user is logged in and the user_id is available in the session
        if (isset($_SESSION['user_id'])) {
            $userId = $_SESSION['user_id'];

            // Insert into a table to link the user with the travel (collaboration table)
            $insertSql = "INSERT INTO travel_collaborators (user_id, travel_id) VALUES (?, ?)";
            $insertStmt = $conn->prepare($insertSql);
            $insertStmt->bind_param("ii", $userId, $travelId);

            if ($insertStmt->execute()) {
                // Success response
                echo json_encode(['success' => true, 'message' => 'Successfully joined the travel!']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to join the travel']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'User not logged in']);
        }
    } else {
        // Share code not found
        echo json_encode(['success' => false, 'message' => 'Invalid Share Code']);
    }
} else {
    // No share code provided
    echo json_encode(['success' => false, 'message' => 'Share Code is required']);
}

$stmt->close();
$conn->close();
?>
