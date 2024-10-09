<?php

require_once __DIR__ . '/../models/user-model.php';

class UserAuthService extends User{
    public function register($data){
        $username = $data['username'];
        $email = $data['email'];
        $password = $data['password'];

        $existingEmail = User::fetchDataByEmail($email);
        $exitingUsername = User::fetchDataByUsername($username);
        if (!$username || !$email || !$password) {
            throw new Exception("All fields are required");
        } else if ($existingEmail) {
            throw new Exception("Email already in use");
        } else if ($exitingUsername) {
            throw new Exception("Username already in use");
        } else {
            $user_id = User::create($data);
            $registeredUser = User::fetchDataById($user_id);

            // echo $user_id;
            // echo $registeredUser;
            return $registeredUser;
        }
    }

    public function login($data){
        $email = $data['email'];
        $password = $data['password'];
        if (!$email || !$password) {
            throw new Exception("All fields are required");
        }

        $user = User::fetchDataByEmail($email);
        if (!$user) {
            // echo "User not found";
            throw new Exception("User not found");
        } else if (!password_verify($password, $user['user_password'])) {
            // echo "user found, wrong password";
            // echo password_hash($password, PASSWORD_DEFAULT) . "<br>";
            // echo $user['password'];
            throw new Exception("Invalid password");
        } else {
            return $user;
        }
    }
}