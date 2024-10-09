<?php

require_once __DIR__ . '/../services/jwt-service.php';
require_once __DIR__ . '/../models/blog-model.php';
require_once __DIR__ . '/../services/cookie-service.php';

class BlogController {
    private $JWTservice;
    private $blogModel;
    private $cookieService;
    public function __construct(){
        $this->JWTservice = new JWTservice();
        $this->blogModel = new Blog();
        $this->cookieService = new CookieService();
    }

    // POST
    public function createBlog(){
        // echo "createBlog in controller reached";
        $data = json_decode(file_get_contents('php://input'), true);

        try {
            // get token from cookie
            $token = $this->cookieService->getTokenCookie();

            if($token){
                // validate token
                $validate = $this->JWTservice->validateToken($token);
                // echo json_encode($validate);

                // extract data if token is valid
                if($validate){
                    $userid = $validate['data']['user_id'];
                    $result = $this->blogModel->addBlog($data, $userid);

                    http_response_code(201); // Created
                    echo json_encode(['message' => 'Blog created successfully', 'result' => $result ]);
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
    public function getAllBlogs(){
        // echo "getAllBlogs in controller reached";
        try {
            
            $blogs = $this->blogModel->getBlogsWithAuthors();
            http_response_code(200); // OK
            echo json_encode(['message' => 'Blogs retrieved successfully', 'blogs' => $blogs]);
        
        } catch (\Exception $e) {
            http_response_code(400); // Bad Request
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    public function getSpecificBlog($blog_id){
        // echo "getSpecificBlog in controller reached";
        try {
            // increment blog views
            // echo json_encode([isset($_COOKIE["viewed_blog_$blog_id"])]);
            // echo json_encode([$_COOKIE]);
            if(!isset($_COOKIE["viewed_blog_$blog_id"])) {
                $this->blogModel->addViews($blog_id);
                    setcookie("viewed_blog_$blog_id", true, time() + 3600, "/", "", true, false);
            } else {
                // echo json_encode(['message' => 'Blog already viewed']);
            }

            // $this->blogModel->addViews($blog_id);

            // fetch specific blog details
            $blog = $this->blogModel->getBlogById($blog_id);
            http_response_code(200); // OK
            if($blog) {
                echo json_encode(['message' => 'Blog retrieved successfully', 'blog' => $blog]);
            } else {
                throw new Exception("Blog not found");
            }

        
        } catch (Exception $e) {
            http_response_code(400); // Bad Request
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    public function getSearchBlogs() {
        // echo "getSearchBlogs in controller reached";
        try {
            $search = isset($_GET['search']) ? $_GET['search'] : '';
            $blogs = $this->blogModel->searchBlogs($search);
            http_response_code(200); // OK
            echo json_encode(['message' => 'Blogs searched successfully', 'blogs' => $blogs]);
        } catch (Exception $e) {
            http_response_code(400); // Bad Request
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    // PUT
    public function updateSpecificBlog(){
        // echo "updateSpecificBlog in controller reached";
        try {
            // get token
            $token = $this->cookieService->getTokenCookie();
            if ($token) {
                // validate token
                $validate = $this->JWTservice->validateToken($token);

                if ($validate){
                    $data = json_decode(file_get_contents('php://input'), true);
                    $user_id = $validate['data']['user_id'];
                    $blog_id = $data['blog_id']; // get blog id from url

                    // ensure this blog belongs to the user
                    $blog = $this->blogModel->getBlogById($blog_id);
                    if($blog['author_user_id'] == $user_id) {
                        $result = $this->blogModel->updateBlog($data, $blog_id);
                        http_response_code(200); // OK
                        echo json_encode(['message' => 'Blog updated successfully', 'result' => $result]);
                    } else {
                        http_response_code(401); // Unauthorized
                        throw new Exception("Unauthorized to update this blog");
                    }
                } else {
                    throw new Exception("Error validating token");
                }
            } else {
                throw new Exception("No token found");
            }
        } catch (Exception $e) {
            http_response_code(400); // Bad Request
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    // DELETE
    public function deleteSpecificBlog(){
        // echo "deleteSpecificBlog in controller reached";
        try {
            // get token
            $token = $this->cookieService->getTokenCookie();
            if($token){
                // validate token
                $validate = $this->JWTservice->validateToken($token);

                // extract data if token is valid
                if($validate){
                    $user_id = $validate['data']['user_id'];
                    $blog_id = $_GET['blog_id']; // get blog id from url

                    // ensure this blog belongs to the user
                    $blog = $this->blogModel->getBlogById($blog_id);
                    if($blog['author_user_id'] == $user_id) {
                        $delResult = $this->blogModel->deleteBlog($blog_id, $user_id);
                    } else {
                        http_response_code(401); // Unauthorized
                        throw new Exception("Unauthorized to delete this blog");
                    }

                    http_response_code(200); // OK
                    echo json_encode(['message' => 'Blog deleted successfully', 'result' => $delResult]);
                } else {
                    throw new Exception("Error validating token");
                }
            } else {
                throw new Exception("No token found");
            }
            
        } catch (Exception $e) {
            http_response_code(400); // Bad Request
            echo json_encode(['message' => $e->getMessage()]);
        }
    }
}
