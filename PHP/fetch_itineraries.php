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

// Fetch itineraries
$sql = "SELECT id, destination, duration_days, duration_nights FROM itineraries";
$stmt = $pdo->query($sql);
$itineraries = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return JSON response
header('Content-Type: application/json');
echo json_encode($itineraries);
?>
