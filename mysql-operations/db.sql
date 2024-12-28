CREATE DATABASE weather_app;

USE weather_app;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);


CREATE TABLE weather_data (
    city VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    temperature DECIMAL(5,2),
    air_quality VARCHAR(50),
    wind_speed DECIMAL(5,2),
    humidity DECIMAL(5,2),
    quality VARCHAR(50),
    conditions VARCHAR(100),
    PRIMARY KEY (city, date)
);

CREATE USER 'user'@'localhost' IDENTIFIED BY 'user1234';
GRANT ALL PRIVILEGES ON weather_app.* TO 'user'@'localhost
