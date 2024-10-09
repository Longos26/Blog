<?php

require_once __DIR__ . '/../models/comment-model.php';
require_once __DIR__ . '/../services/jwt-service.php';
require_once __DIR__ . '/../services/cookie-service.php';


class CommentController {
    private $cookieService;
    private $jwtService;
    private $commentModel;

    public function __construct(){
        $this->cookieService = new CookieService();
        $this->jwtService = new JWTService();
        $this->commentModel = new CommentModel();
    }

    // POST
    public function createComment(){
        // echo "createComment in controller reached";
        $data = json_decode(file_get_contents('php://input'), true);

        try {
            $token = $this->cookieService->getTokenCookie();
            if($token){
                $validate = $this->jwtService->validateToken($token);
                if($validate){
                    $user_id = $validate['data']['user_id'];
                    $result = $this->commentModel->addComment($data, $user_id);
    
                    http_response_code(201); // Created
                    echo json_encode(['message' => 'Comment created successfully', 'result' => $result]);
                } else {
                    throw new Exception("Error validating token");
                }
            } else {
                throw new Exception("No token found");
            }
        } catch (\Exception $e) {
            http_response_code(400); // Bad Request
            echo json_encode(['message' => $e->getMessage()]);
        }
    } 

    // GET
    public function getCommentsByBlogId($blog_id){
        try {
            $comments = $this->commentModel->getBlogComments($blog_id);
            http_response_code(200); // OK
            echo json_encode(['message' => 'Comments retrieved successfully', 'comments' => $comments]);
        } catch (\Exception $e) {
            http_response_code(400); // Bad Request
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    // DELETE 
    public function removeComment(){
        try {
            // validate user logged in
            $token = $this->cookieService->getTokenCookie();
            if ($token) {
                $validate = $this->jwtService->validateToken($token);
                
                if ($validate) {
                    $user_id = $validate['data']['user_id'];
                    $comment_id = $_GET['comment_id'];
                    $delComment = $this->commentModel->deleteComment($comment_id);

                    if($delComment){
                        http_response_code(200); // OK
                        echo json_encode(['message' =>'Comment deleted successfully', 'delComment' => $delComment]);
                    }

                } else {
                    throw new Exception("Error validating token");
                }
            } else {
                throw new Exception("No token found");
            }
        } catch (Exception $e) {
            http_response_code(400); // Bad request
            echo json_encode(['message' => $e->getMessage()]);
        }
    }
}

