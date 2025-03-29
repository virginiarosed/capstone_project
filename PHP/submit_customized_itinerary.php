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

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $client_name = $_POST['client_name'];
    $destination = $_POST['destination'];
    $lodging = $_POST['lodging'];
    $start_date = $_POST['start_date'];
    $end_date = $_POST['end_date'];
    $travel_id = $_POST['travel_id'];

    $duration_days = $_POST['duration_days'];
    $duration_nights = $_POST['duration_nights'];

    // SQL query to check if the travel has an itinerary
    $sql = "
        SELECT 
            T1.id AS travel_id, 
            CASE 
                WHEN CI.travel_id IS NOT NULL THEN 1 
                ELSE 0 
            END AS has_itinerary,
            CI.id AS itinerary_id
        FROM 
            create_travel T1
        LEFT JOIN 
            customized_intineraries CI 
        ON 
            T1.id = CI.travel_id
        WHERE 
            T1.id = ?;
    ";

    // Prepare and execute the query
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$travel_id]);
    $result = $stmt->fetch();

    // Check if the travel has an itinerary
    if ($result && $result['has_itinerary'] == 1) {
        error_log("Travel ID {$travel_id} has an itinerary.");

        // If itinerary exists, perform an UPDATE
        $updateSql = "
            UPDATE customized_intineraries 
            SET client_name = :client_name, 
                destination = :destination, 
                lodging = :lodging, 
                start_date = :start_date, 
                end_date = :end_date
            WHERE travel_id = :travel_id
        ";

        $stmt = $pdo->prepare($updateSql);
        $stmt->execute([
             ':client_name' => $client_name,
            ':destination' => $destination,
            ':lodging' => $lodging,
            ":start_date" => $start_date,
            ":end_date" => $end_date,
            ":travel_id" => intval($travel_id)
        ]);
        error_log(message: "Itinerary updated successfully.");

        // Get the last inserted itinerary ID
        $updatedItineraryId = $result['itinerary_id'];

        error_log(message: "UPDATED: " . $updatedItineraryId);

        $sql = "DELETE FROM 
            customized_intinerary_days 
            WHERE
            customized_initerary_id = :customized_initerary_id;";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':customized_initerary_id' => $updatedItineraryId
        ]);

        // Insert days and activities into the customized_intinerary_days table
        for ($day_number = 1; $day_number <= $duration_days; $day_number++) {
            // Get the time ranges and activities for this day
            $time_ranges = isset($_POST['time_range'][$day_number]) ? $_POST['time_range'][$day_number] : [];
            $activities = isset($_POST['activity'][$day_number]) ? $_POST['activity'][$day_number] : [];
            $date = isset($_POST['date-' . $day_number]) ? $_POST['date-' . $day_number] : null;

            error_log("TIME RANGES: " . count($time_ranges));
            error_log("ACTIVITIES: " . count(value: $activities));
            error_log("DURATION: " . $duration_days);


            // Check if there are time ranges for this day
            if (!empty($time_ranges) && !empty($activities)) {
                for ($i = 0; $i < count($time_ranges); $i++) {
                    // Make sure there is a corresponding activity for each time range
                    if (isset($time_ranges[$i * 2]) && isset($time_ranges[($i * 2) + 1]) && isset($activities[$i])) {
                        $start_time = $time_ranges[$i * 2];
                        $end_time = $time_ranges[($i * 2) + 1];
                        $activity = $activities[$i];
                        $dateTime = new DateTime(datetime: $date);
                        $formattedDate = $dateTime->format("Y-m-d H:i:s");
                        error_log("DATE: " . $formattedDate);

                        // Insert the day's details into the customized_intinerary_days table
                        $sql = "INSERT INTO customized_intinerary_days (customized_initerary_id, day_number, start_time, end_time, activity, date) 
                                VALUES (:customized_initerary_id, :day_number, :start_time, :end_time, :activity, :date)";
                        $stmt = $pdo->prepare($sql);
                        $stmt->execute([
                            ':customized_initerary_id' => $updatedItineraryId,
                            ':day_number' => $day_number,
                            ':start_time' => $start_time,
                            ':end_time' => $end_time,
                            ':activity' => $activity,
                            ':date' => $formattedDate
                        ]);
                    }
                }
            } else {
                $dateTime = new DateTime(datetime: $date);
                $formattedDate = $dateTime->format("Y-m-d H:i:s");
                error_log("DATE: " . $formattedDate);
                
                // Insert the day's details into the customized_intinerary_days table
                $sql = "INSERT INTO customized_intinerary_days (customized_initerary_id, day_number, date) 
                        VALUES (:customized_initerary_id, :day_number, :date)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':customized_initerary_id' => $updatedItineraryId,
                    ':day_number' => $duration_days,
                    ':date' => $formattedDate
                ]);
            }
        }
    } else {
        error_log("Travel ID {$travel_id} does not have an itinerary.");

        // Insert itinerary into the customized_intineraries table
        $sql = "INSERT INTO customized_intineraries (client_name, destination, lodging, start_date, end_date, travel_id) 
                VALUES (:client_name, :destination, :lodging, :start_date, :end_date, :travel_id)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':client_name' => $client_name,
            ':destination' => $destination,
            ':lodging' => $lodging,
            ":start_date" => $start_date,
            ":end_date" => $end_date,
            ":travel_id" => intval($travel_id)
        ]);
        
        // Get the last inserted itinerary ID
        $customized_initerary_id = $pdo->lastInsertId();

        // Insert days and activities into the customized_intinerary_days table
        for ($day_number = 1; $day_number <= $duration_days; $day_number++) {
            // Get the time ranges and activities for this day
            $time_ranges = isset($_POST['time_range'][$day_number]) ? $_POST['time_range'][$day_number] : [];
            $activities = isset($_POST['activity'][$day_number]) ? $_POST['activity'][$day_number] : [];
            $date = isset($_POST['date-' . $day_number]) ? $_POST['date-' . $day_number] : null;

            error_log("TIME RANGES: " . count($time_ranges));
            error_log("ACTIVITIES: " . count(value: $activities));
            error_log("DURATION: " . $duration_days);


            // Check if there are time ranges for this day
            if (!empty($time_ranges) && !empty($activities)) {
                for ($i = 0; $i < count($time_ranges); $i++) {
                    // Make sure there is a corresponding activity for each time range
                    if (isset($time_ranges[$i * 2]) && isset($time_ranges[($i * 2) + 1]) && isset($activities[$i])) {
                        $start_time = $time_ranges[$i * 2];
                        $end_time = $time_ranges[($i * 2) + 1];
                        $activity = $activities[$i];
                        $dateTime = new DateTime(datetime: $date);
                        $formattedDate = $dateTime->format("Y-m-d H:i:s");
                        error_log("DATE: " . $formattedDate);

                        // Insert the day's details into the customized_intinerary_days table
                        $sql = "INSERT INTO customized_intinerary_days (customized_initerary_id, day_number, start_time, end_time, activity, date) 
                                VALUES (:customized_initerary_id, :day_number, :start_time, :end_time, :activity, :date)";
                        $stmt = $pdo->prepare($sql);
                        $stmt->execute([
                            ':customized_initerary_id' => $customized_initerary_id,
                            ':day_number' => $day_number,
                            ':start_time' => $start_time,
                            ':end_time' => $end_time,
                            ':activity' => $activity,
                            ':date' => $formattedDate
                        ]);
                    }
                }
            } else {
                $dateTime = new DateTime(datetime: $date);
                $formattedDate = $dateTime->format("Y-m-d H:i:s");
                error_log("DATE: " . $formattedDate);
                
                // Insert the day's details into the customized_intinerary_days table
                $sql = "INSERT INTO customized_intinerary_days (customized_initerary_id, day_number, date) 
                        VALUES (:customized_initerary_id, :day_number, :date)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':customized_initerary_id' => $customized_initerary_id,
                    ':day_number' => $duration_days,
                    ':date' => $formattedDate
                ]);
            }
        }
    }
    // Redirect to a success page or show a success message
    header("Location: /for_project/User_HTML/bv_itinerary.html?travel_id=" . $travel_id);
    exit();
}
?>