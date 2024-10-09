<?php
require_once __DIR__ . '/../../config/dbconnection.php';
class CommentModel extends Connection{
    private $pdo;

    public function __construct() {
        $connection = new Connection();
        $this->pdo = $connection->connect();
    }

    // POST
    public function addComment($data, $user_id) {
        try{
            $comment_body = isset($data['comment_body']) ? $data['comment_body'] : null;
            $comment_blog_id = isset($data['comment_blog_id']) ? $data['comment_blog_id'] : null;
            $comment_user_id = $user_id;

            if(!$comment_body) {
                throw new Exception("Please provide comment body");
            } else if (!$comment_blog_id) {
                throw new Exception("Please provide blog id");
            } else if (!$comment_user_id) {
                throw new Exception("Please provide user id");
            }

            $query = "INSERT INTO comments (comment_body, comment_blog_id, comment_user_id) VALUES (:comment_body, :comment_blog_id, :comment_user_id)";
            $stmt = $this->pdo->prepare($query);
            $stmt->bindParam(':comment_body', $comment_body);
            $stmt->bindParam(':comment_blog_id', $comment_blog_id);
            $stmt->bindParam(':comment_user_id', $comment_user_id);
            $stmt->execute();

            $comment_id = $this->pdo->lastInsertId();
            if (!$comment_id) {
                throw new Exception("Error adding comment");
            }

            return array(
                'comment_id' => $comment_id, 
                'comment_body' => $comment_body, 
                'comment_blog_id' => $comment_blog_id, 
                'comment_user_id' => $comment_user_id);

        } catch (Exception $e) {
            error_log("Error adding comment: " . $e->getMessage());
            throw new Exception("Error adding comment: " . $e->getMessage());
        }
    }

    // GET
    public function getBlogComments($blog_id) {
        try {
            $query = "
            SELECT 
                comments.comment_id,
                comments.comment_body,
                comments.comment_blog_id,
                comments.comment_user_id,
                users.user_id,
                users.user_username,
                author_posts.author_posts_user_id
            FROM 
                comments
            JOIN 
                users 
            ON 
                comments.comment_user_id = users.user_id
            JOIN
                author_posts
            ON
                comments.comment_blog_id = author_posts.author_posts_blog_id
            WHERE 
                comments.comment_blog_id = :blog_id
            ORDER BY
                comments.comment_created_at DESC
            ";
            $stmt = $this->pdo->prepare($query);
            $stmt->bindParam(':blog_id', $blog_id);
            $stmt->execute();
            $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $comments;
        } catch (Exception $e) {
            error_log("Error getting comments: " . $e->getMessage());
            throw new Exception("Error getting comments: " . $e->getMessage());
        }
    }

    // DELETE 
    public function deleteComment($comment_id) {
        try {
            $query="DELETE FROM comments WHERE comment_id = :comment_id";
            $stmt = $this->pdo->prepare($query);
            $stmt->bindParam(':comment_id', $comment_id);
            $deleteComment = $stmt->execute();

            if($deleteComment){
                return $deleteComment;

            } else {
                throw new Exception("Error deleting comment");
            }


        } catch (Exception $e) {
            http_response_code(400); // Bad request
            echo json_encode(['message' => $e->getMessage()]);
        }
    }
}