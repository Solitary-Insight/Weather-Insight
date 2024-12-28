<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$servername = "localhost";
$username = "user";
$password = "user1234";
$dbname = "weather_app";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(array('message' => 'Connection failed: ' . $conn->connect_error)));
}

$city = isset($_POST['city']) ? $conn->real_escape_string($_POST['city']) : '';
$date = isset($_POST['date']) ? $conn->real_escape_string($_POST['date']) : '';
$temperature = isset($_POST['temperature']) ? floatval($_POST['temperature']) : 0;
$airQuality = isset($_POST['air_quality']) ? $conn->real_escape_string($_POST['air_quality']) : '';
$windSpeed = isset($_POST['wind_speed']) ? floatval($_POST['wind_speed']) : 0;
$humidity = isset($_POST['humidity']) ? floatval($_POST['humidity']) : 0;
$quality = isset($_POST['quality']) ? $conn->real_escape_string($_POST['quality']) : '';
$conditions = isset($_POST['conditions']) ? $conn->real_escape_string($_POST['conditions']) : '';

if (empty($city) || empty($date)) {
    echo json_encode(array('message' => 'City and Date are required'));
    exit;
}

// Check if data already exists for the given city and date
$sql_check = "SELECT * FROM weather_data WHERE city = ? AND date = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("ss", $city, $date);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows > 0) {
    echo json_encode(array('message' => 'Weather data already exists for this city and date'));
} else {
    // Prepare and execute SQL query to insert new data
    $sql_insert = "INSERT INTO weather_data (city, date, temperature, air_quality, wind_speed, humidity, quality, conditions)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt_insert = $conn->prepare($sql_insert);
    $stmt_insert->bind_param("ssdssdss", $city, $date, $temperature, $airQuality, $windSpeed, $humidity, $quality, $conditions);

    try {
        if ($stmt_insert->execute()) {
            echo json_encode(array('message' => 'Weather data inserted successfully'));
        } else {
            throw new Exception('Failed to execute SQL statement: ' . $stmt_insert->error);
        }
    } catch (Exception $e) {
        echo json_encode(array('message' => 'Error inserting weather data: ' . $e->getMessage()));
    }

    $stmt_insert->close();
}

$stmt_check->close();
$conn->close();
?>
