<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ob_start();

$servername = "localhost";
$username = "user";
$password = "user1234";
$dbname = "weather_app";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

$response = ["status" => "", "message" => ""];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $action = $_POST['action'];

    if ($action == "register") {
        $username = $_POST['username'];
        $email = $_POST['email'];
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

        // Check if username or email already exists
        $checkQuery = "SELECT * FROM users WHERE username=? OR email=?";
        $stmt = $conn->prepare($checkQuery);
        $stmt->bind_param("ss", $username, $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $response["status"] = "error";
            $response["message"] = "Username or Email already exists";
        } else {
            $query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("sss", $username, $email, $password);

            if ($stmt->execute()) {
                $response["status"] = "success";
                $response["message"] = "Registration successful!";
            } else {
                $response["status"] = "error";
                $response["message"] = "Error: " . $stmt->error;
            }
        }

        $stmt->close();
    } elseif ($action == "login") {
        $username = $_POST['username'];
        $password = $_POST['password'];

        $query = "SELECT * FROM users WHERE username=?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if ($user && password_verify($password, $user['password'])) {
            session_start();
            $_SESSION['username'] = $user['username'];
            $response["status"] = "success";
            $response["message"] = "Login successful!";
        } else {
            $response["status"] = "error";
            $response["message"] = "Invalid username or password";
        }

        $stmt->close();
    }
}

$conn->close();
echo json_encode($response);
ob_end_flush();
?>
