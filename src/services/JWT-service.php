<?php

require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\JWK;
use Dotenv\Dotenv;

// load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->load();

class JWTservice {
    private $secretKey;

    public function __construct(){
        $this->secretKey = $_ENV['SECRET_KEY'];
    }

    public function generateToken($data){
        $user_id = $data['user_id'];
        $user_email = $data['user_email'];

        $key = $this->secretKey;

        $issuedAt = time();
        $expirationTime = $issuedAt + 60 * 60;  // JWT valid for 1 hour from issued time
        $payload = [
            'user_id' => $user_id,
            'user_email' => $user_email,
            'iat' => $issuedAt,
            'exp' => $expirationTime
        ];

        $token = JWT::encode($payload, $key, 'HS256');
        return $token;
    }

    public function validateToken($token){
        $key = $this->secretKey;

        try {
            // check header
            $headers = apache_request_headers();
            // echo json_encode($headers);
            $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : null;
            if (!$auth_header) {
                return ['valid' => false, 'data' => 'No authorization header'];
            }

            // check token
            $checkToken = preg_match('/Bearer\s(\S+)/', $auth_header, $matches);
            // echo json_encode(['check token' => $checkToken]);
            if ($checkToken) {
                // decode token
                $jwt = $matches[1];
                $decoded = JWT::decode($jwt, new Firebase\JWT\Key($key, 'HS256'));
                return ['valid' => true, 'data' => (array) $decoded];
            
            } else {
                throw new Exception("Token not provided");
            }

        } catch (\Firebase\JWT\ExpiredException $e) {
            // Token has expired
            throw new Exception("Token has expired");
        } catch (\Firebase\JWT\SignatureInvalidException $e){
            // Invalid token sign
            throw new Exception("Invalid token signature");
        } catch(Exception $e) {
            // any other error
            throw new Exception("Invalid token: " . $e->getMessage());
        }
    }
}
