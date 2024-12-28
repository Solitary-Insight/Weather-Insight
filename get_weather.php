<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$city = $request->city;
$date = $request->date;

$servername = "localhost";
$username = "user";
$password = "user1234";
$dbname = "weather_app";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(array('message' => 'Connection failed: ' . $conn->connect_error)));
}

$sql = "SELECT * FROM weather_data WHERE city = ? AND date = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $city, $date);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(array(
        'temperature' => $row['temperature'],
        'air_quality' => $row['air_quality'],
        'date' => $row['date'],
        'wind_speed' => $row['wind_speed'],
        'humidity' => $row['humidity'],
        'conditions' => $row['conditions'],
        // Add other weather data fields as needed
    ));
} else {
    echo json_encode(array('message' => 'Weather data not found'));
}

$stmt->close();
$conn->close();
?>
