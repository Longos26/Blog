<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

// load .env file
$dotenv = Dotenv::createImmutable(__DIR__ . '/../config');
$dotenv->load();

// retrieve db credentials from .env
$server = $_ENV['SERVER'];
$database = $_ENV['DATABASE'];
$user = $_ENV['USER'];
$pass = $_ENV['PASS'];
$driver = $_ENV['DRIVER'];

// // Output the values to verify
// echo 'Server: ' . htmlspecialchars($server) . '<br>';
// echo 'Database: ' . htmlspecialchars($database) . '<br>';
// echo 'User: ' . htmlspecialchars($user) . '<br>';
// echo 'Password: ' . htmlspecialchars($pass) . '<br>'; // Be cautious with passwords in output
// echo 'Driver: ' . htmlspecialchars($driver) . '<br>';

// default timezone
date_default_timezone_set('Asia/Manila');

// time limit of requests
set_time_limit(1000);

// define constants for server credentials/configs
define("SERVER", $server);
define("DATABASE", $database);
define("USER", $user);
define("PASSWORD", $pass);
define("DRIVER", $driver);

// // for debugging purposes
// echo 'Server: ' . htmlspecialchars(SERVER) . '<br>';
// echo 'Database: ' . htmlspecialchars(DATABASE) . '<br>';
// echo 'User: ' . htmlspecialchars(USER) . '<br>';
// echo 'Password: ' . htmlspecialchars(PASSWORD) . '<br>'; // Be cautious with passwords
// echo 'Driver: ' . htmlspecialchars(DRIVER) . '<br>';

class Connection{
    private $connectionString = DRIVER . ":host=" . SERVER . ";dbname=" . DATABASE . "; charset=utf8mb4";
    
    //options is a key=>value array of driver-specific connection options.
    private $options = [
        \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
        \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
        \PDO::ATTR_PERSISTENT => true, // Persistent connection
        \PDO::ATTR_EMULATE_PREPARES => false
    ];

    public function connect() {
        return new \PDO($this->connectionString, USER, PASSWORD, $this->options);
    }
}
