<?php
// Start session
session_start();

// Include the database connection file
include('../PHP/db_connection.php');


// Query to fetch user details
$sql = "
    SELECT 
        T1.id AS itinerary_id,
        T1.travel_id,
        T1.client_name,
        T1.destination,
        T1.start_date,
        T1.end_date,
        T1.lodging,
        CID.id,
        CID.activity,
        CID.start_time,
        CID.end_time,
        CID.created_at,
        CID.day_number,
        CID.date
    FROM 
        customized_intineraries T1
    LEFT JOIN 
        customized_intinerary_days CID ON T1.id = CID.customized_initerary_id
    ORDER BY 
        CID.date;
";

$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

$itineraries = [];
while ($row = $result->fetch_assoc()) {
    // Check if this itinerary already exists in the $itineraries array
    if (!isset($itineraries[$row['itinerary_id']])) {
        // If not, add the basic itinerary info
        $itineraries[$row['itinerary_id']] = [
            'itinerary_id' => $row['itinerary_id'],
            'travel_id' => $row['travel_id'],
            'client_name' => $row['client_name'],
            'destination' => $row['destination'],
            'start_date' => $row['start_date'],
            'end_date' => $row['end_date'],
            'lodging' => $row['lodging'],
            'itinerary_days' => []
        ];
    }

    // Group activities by date
    $date = $row['date'];
    if (!isset($itineraries[$row['itinerary_id']]['itinerary_days'][$date])) {
        $itineraries[$row['itinerary_id']]['itinerary_days'][$date] = [
            'date' => $date,
            'activities' => []
        ];
    }

    // Add activity details to the corresponding date
    if (!empty($row['activity']) || !empty($row['start_time']) || !empty($row['end_time'])) {
        $itineraries[$row['itinerary_id']]['itinerary_days'][$date]['activities'][] = [
            'created_at' => $row['created_at'],
            'start_time' => $row['start_time'],
            'end_time' => $row['end_time'],
            'activity' => $row['activity']
        ];
    }
}

// Convert the itinerary_days associative array to a simple array
foreach ($itineraries as &$itinerary) {
    $itinerary['itinerary_days'] = array_values($itinerary['itinerary_days']);
}

// Return the final data as JSON
echo json_encode(array_values($itineraries));

// Close the database connection
$stmt->close();
$conn->close();
?>
