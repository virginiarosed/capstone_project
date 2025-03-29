<?php
$host = "localhost"; // Database host
$dbname = 'bondvoyage_db'; // Database name
$username = 'root'; // Your database username
$password = ''; // Your database password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Check if 'id' is provided in the query string
if (isset($_GET['id'])) {
    $id = $_GET['id'];

    // Begin a transaction to delete the itinerary and its related days
    try {
        // Delete related activities first
        $stmt = $pdo->prepare("DELETE FROM itinerary_days WHERE itinerary_id = :id");
        $stmt->execute([':id' => $id]);

        // Now delete the itinerary
        $stmt = $pdo->prepare("DELETE FROM itineraries WHERE id = :id");
        $stmt->execute([':id' => $id]);

        // Respond with a success message
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        // If an error occurs, respond with an error message
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No itinerary ID provided']);
}
?>
