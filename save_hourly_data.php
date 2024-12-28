<?php
// Database credentials
$servername = "localhost";  // Replace with your database server name
$username = "username";      // Replace with your database username
$password = "password";      // Replace with your database password
$dbname = "weather_app";     // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve and decode hourly data sent from JavaScript
$hourlyData = json_decode($_POST['hourlyData'], true);

// Example: Insert hourly data into 'hourly_weather_data' table
foreach ($hourlyData as $hour) {
    $datetime = $hour['datetime'];
    $temperature = $hour['temp'];
    $conditions = $hour['conditions'];
    $humidity = $hour['humidity'];
    // Add more fields as needed for your database schema

    // SQL query to insert data into database
    $sql = "INSERT INTO hourly_weather_data (datetime, temperature, conditions, humidity)
            VALUES ('$datetime', '$temperature', '$conditions', '$humidity')";

    if ($conn->query($sql) !== TRUE) {
        echo "Error: " . $sql . "<br>" . $conn->error;
        break; // Exit loop on first error (optional)
    }
}

// Close connection
$conn->close();

echo "Hourly data inserted successfully"; // Send response back to JavaScript
?>
