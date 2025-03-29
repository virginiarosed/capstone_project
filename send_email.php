<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Capture the form data
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP(); 
        $mail->Host = 'smtp.gmail.com'; 
        $mail->SMTPAuth = true; 
        $mail->Username = 'bondvoyage.system@gmail.com'; 
        $mail->Password = 'uqsk liyv dwlz ujst'; 
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; 
        $mail->Port = 587; 

        // Recipients
        $mail->setFrom('bondvoyage.system@gmail.com', $name); 
        $mail->addAddress('bondvoyage.system@gmail.com'); 

        // Content
        $mail->isHTML(false); 
        $mail->Subject = 'Message from BondVoyage Contact Form';
        $mail->Body    = "You have received a new message from the contact form on your BondVoyage system.\n\n";
        $mail->Body   .= "Name: $name\n";
        $mail->Body   .= "Email: $email\n";
        $mail->Body   .= "\nMessage:\n$message\n";

        // Send the email
        $mail->send();
        echo 'Message sent successfully!';
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
?>