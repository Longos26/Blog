<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json"); // Set the response content type to JSON
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow specific headers

if (isset($_SERVER['HTTP_ORIGIN'])) {
    // Should do a check here to match $_SERVER['HTTP_ORIGIN'] to a
    // whitelist of safe domains
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // allowed methods

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

// Handle preflight (OPTIONS) requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/dbconnection.php';
require_once __DIR__ . '/../src/routes/routes.php';
require_once __DIR__ . '/../src/controllers/userAuth-controller.php';
require_once __DIR__ . '/../src/controllers/blog-controller.php';
// require_once __DIR__ . '/../src/controllers/blog-controller.php';

// environment variables
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../config');
$dotenv->load();

// setup routing
$router = new Router();

// get request URI and request method
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// // for debugging
// echo $requestUri . '<br>';
// echo $requestMethod . '<br>';

// remove the query string from URI
$baseDir = '/blog_assessment-no/api/'; 
$path = str_replace($baseDir, '', $requestUri); // Remove leading directories

// Remove query string
$path = strtok($path, '?');

//  // for debugging purposes
// echo $path;

// routing
$router->dispatch($requestMethod, $path);


