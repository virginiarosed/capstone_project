<?php
// Start session
session_start();

// Include the database connection file
include('../PHP/db_connection.php');

// Fetch user ID from session
$travel_id = $_GET['travel_id'];

// Query to fetch user details
$sql = "
SELECT 
    T1.id, 
    CONCAT(T2.first_name, ' ', T2.last_name) AS FullName, 
    T1.travel_name, 
    T1.share_code, 
    T1.created_at,
    CI.client_name,
    CI.destination,
    CI.start_date,
    CI.end_date,
    CI.lodging,
    CI.id AS itinerary_id
FROM 
    create_travel T1
LEFT JOIN 
    users T2 ON T1.user_id = T2.id
LEFT JOIN 
    customized_intineraries CI ON T1.id = CI.travel_id
WHERE 
    T1.id = ?";


$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $travel_id);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();

// Fetch user details and return as JSONs
if ($data) {
    // Check if an itinerary exists for the given travel
    if (!empty($data['itinerary_id'])) {
        // Fetch itinerary days for the given itinerary_id
        $daysSql = "
            SELECT *
            FROM 
                customized_intinerary_days 
            WHERE 
                customized_initerary_id = ? 
            ORDER BY 
                date;
        ";
        $daysStmt = $conn->prepare($daysSql);
        $daysStmt->bind_param("i", $data['itinerary_id']);
        $daysStmt->execute();
        $daysResult = $daysStmt->get_result();
        
        // Group days and activities
        $groupedDays = [];
        while ($row = $daysResult->fetch_assoc()) {
            $date = $row['date']; // Grouping key
            if (!isset($groupedDays[$date])) {
                $groupedDays[$date] = [
                    'date' => $date,
                    'activities' => []
                ];
            }
            if (!empty($row['start_time']) && !empty($row['end_time']) && !empty($row['activity'])) {
                // Add time and activity to the respective day
                $groupedDays[$date]['activities'][] = [
                    'created_at' => $row['created_at'],
                    'start_time' => $row['start_time'],
                    'end_time' => $row['end_time'],
                    'activity' => $row['activity']
                ];
            }
        }

        // Re-index to ensure an array of grouped days
        $data['itinerary_days'] = array_values($groupedDays);
    } else {
        // If no itinerary exists, set itinerary_days to an empty array
        $data['itinerary_days'] = [];
    }

    // Return the data as JSON
    echo json_encode($data);
} else {
    echo json_encode(['error' => 'Itinerary not found']);
}


// Close the database connection
$stmt->close();
$conn->close();
?>
