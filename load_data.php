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

$sql = "SELECT DISTINCT city, date FROM weather_data ORDER BY date DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = array(
            'city' => $row['city'],
            'date' => $row['date']
        );
    }
    echo json_encode($data);
} else {
    echo json_encode(array('message' => 'No data found'));
}

$conn->close();
?>
