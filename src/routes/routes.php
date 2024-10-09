<?php

require_once __DIR__ . '/../../config/dbconnection.php';
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../controllers/comment-controller.php';

use FastRoute\RouteCollector;
use function FastRoute\simpleDispatcher;

class Router {
    private $dispatcher;

    public function __construct(){
        $this->dispatcher = simpleDispatcher(function(RouteCollector $r) {
            // usage: $r->addRoute('REQ METHOD', '/route', ['controller', 'function from controller']);

            // users
            $r->addRoute('POST', '/register', ['UserAuthController', 'register']);
            $r->addRoute('POST', '/login', ['UserAuthController', 'login']);

            // posts
            $r->addRoute('POST', '/create-blog', ['BlogController', 'createBlog']);
            $r->addRoute('GET', '/blogs', ['BlogController', 'getAllBlogs']);
            $r->addRoute('GET', '/blogs/{blog_id}', ['BlogController', 'getSpecificBlog']);
            $r->addRoute('GET', '/search-blogs', ['BlogController', 'getSearchBlogs']);
            $r->addRoute('PUT', '/edit-blog', ['BlogController', 'updateSpecificBlog']);
            $r->addRoute('DELETE', '/delete-blog', ['BlogController', 'deleteSpecificBlog']);

            // comments
            $r->addRoute('POST', '/create-comment', ['CommentController', 'createComment']);
            $r->addRoute('GET', '/comments/{blog_id}', ['CommentController', 'getCommentsByBlogId']);
            $r->addRoute('DELETE', '/delete-comment', ['CommentController', 'removeComment']);
        });
    }

    public function dispatch($method, $uri){
        $routeInfo = $this->dispatcher->dispatch($method, $uri);
        switch ($routeInfo[0]) {
            case \FastRoute\Dispatcher::NOT_FOUND:
                echo '404 Not Found';
                break;
            case \FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
                $allowedMethods = $routeInfo[1];
                echo '405 Method Not Allowed';
                break;
            case \FastRoute\Dispatcher::FOUND:
                $handler = $routeInfo[1];
                $vars = $routeInfo[2];
                call_user_func_array([new $handler[0], $handler[1]], $vars);
                break;
        }
    }
}