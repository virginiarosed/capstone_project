<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // reCAPTCHA validation
    $recaptchaSecret = '6LdzmHcqAAAAANDbzEmzoZiR47DbC6bAwBrjGM6T';
    $recaptchaResponse = $_POST['g-recaptcha-response'];

    $url = 'https://www.google.com/recaptcha/api/siteverify';
    $data = [
        'secret' => $recaptchaSecret,
        'response' => $recaptchaResponse,
    ];

    $options = [
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/x-www-form-urlencoded',
            'content' => http_build_query($data),
        ],
    ];

    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    $result = json_decode($response);

    if ($result->success) {
        // reCAPTCHA succeeded, process form submission

        include('../PHP/db_connection.php');

        // Sanitize and validate inputs
        $first_name = $conn->real_escape_string($_POST['first_name']);
        $last_name = $conn->real_escape_string($_POST['last_name']);
        $email = $conn->real_escape_string($_POST['email']);
        $mobile = $conn->real_escape_string($_POST['mobile']);
        $birthday = $conn->real_escape_string($_POST['birthday']);
        $password = password_hash($_POST['password'], PASSWORD_BCRYPT); // Encrypt the password

        // Hash the security answers
        $security_answer_1 = password_hash($_POST['security_answer_1'], PASSWORD_BCRYPT);
        $security_answer_2 = password_hash($_POST['security_answer_2'], PASSWORD_BCRYPT);
        $security_answer_3 = password_hash($_POST['security_answer_3'], PASSWORD_BCRYPT);

        // Sanitize and prepare other fields
        $security_question_1 = $conn->real_escape_string($_POST['security_question_1']);
        $security_question_2 = $conn->real_escape_string($_POST['security_question_2']);
        $security_question_3 = $conn->real_escape_string($_POST['security_question_3']);

        // Prepare SQL query to insert the data
        $sql = "INSERT INTO users (first_name, last_name, email, mobile, birthday, password, 
                security_question_1, security_answer_1, security_question_2, security_answer_2, 
                security_question_3, security_answer_3) 
                VALUES ('$first_name', '$last_name', '$email', '$mobile', '$birthday', '$password', 
                '$security_question_1', '$security_answer_1', '$security_question_2', '$security_answer_2', 
                '$security_question_3', '$security_answer_3')";

        // Execute query and check if successful
        if ($conn->query($sql) === TRUE) {
            // Redirect to success page with a message
            header("Location: /for_project/User_HTML/bv_success_signup_page.html");
            exit();
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        // Close the database connection
        $conn->close();
    } else {
        // Handle failed reCAPTCHA validation
        echo 'reCAPTCHA validation failed. Please try again.';
    }
}
?>
