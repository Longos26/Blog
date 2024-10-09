<?php

require_once __DIR__ . '/../../config/dbconnection.php';

class Blog extends Connection
{

    private $pdo;
    public function __construct()
    {
        $connection = new Connection();
        $this->pdo = $connection->connect();
    }

    // POST
    public function addBlog($data, $user_id)
    {
        try {

            $this->pdo->beginTransaction();

            $blog_title = isset($data['blog_title']) ? $data['blog_title'] : null;
            $blog_body = isset($data['blog_body']) ? $data['blog_body'] : null;
            $data['user_id'] = $user_id; //kkinuha from jwt token

            if (!$blog_title || !$blog_body) {
                throw new Exception("Please provide blog title and body");
            }

            // insert new blog first
            $query = "INSERT INTO blogs (blog_title, blog_body) VALUES (:blog_title, :blog_body)";
            $stmt = $this->pdo->prepare($query);
            $stmt->bindParam(':blog_title', $blog_title);
            $stmt->bindParam(':blog_body', $blog_body);
            $stmt->execute();

            $blog_id = $this->pdo->lastInsertId(); // get the blog_id of the recently added blog
            if (!$blog_id) {
                throw new Exception("Error adding blog");
            }

            // insert into author_posts
            $query2 = "INSERT INTO author_posts (author_posts_user_id, author_posts_blog_id) VALUES (:user_id, :blog_id)";
            $stmt2 = $this->pdo->prepare($query2);
            $stmt2->bindParam(':user_id', $user_id);
            $stmt2->bindParam(':blog_id', $blog_id);
            $stmt2->execute();

            $query3 = "SELECT user_username FROM users WHERE user_id = :user_id";
            $stmt = $this->pdo->prepare($query3);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();
            $author_username = $stmt->fetchColumn();

            if ($this->pdo->commit()) {
                // echo json_encode(['message' => 'Blog added successfully', 'blog_id' => $blog_id, 'blog_title' => $blog_title, 'author_user_id' => $user_id]); 
            } else {
                throw new Exception("PDO commit() failed when adding blog");
            }

            return array('blog_title' => $blog_title, 'author_posts_user_username' => $author_username);

        } catch (PDOException $e) {
            $this->pdo->rollBack();
            echo json_encode(['message' => "Error adding blog: " . $e->getMessage()]);
        } catch (Exception $e) {
            $this->pdo->rollBack();
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    public function searchBlogs($search)
    {
        try {
            $query = '%' . $search . '%';
            $sql = "
            SELECT 
                blogs.blog_id AS blog_id,
                blogs.blog_title AS blog_title,
                blogs.blog_body AS blog_body,
                blogs.blog_created_at AS author_posts_created_at,
                users.user_id AS author_user_id,
                users.user_username AS author_user_username
            FROM 
                blogs
            INNER JOIN
                author_posts ON blogs.blog_id = author_posts.author_posts_blog_id
            INNER JOIN
                users ON users.user_id = author_posts.author_posts_user_id
            WHERE
                blogs.blog_title LIKE :query OR blogs.blog_body LIKE :query1
            ORDER BY
                blogs.blog_created_at DESC
            ";

            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':query', $query);
            $stmt->bindParam(':query1', $query);
            $stmt->execute();
            $blogs = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            return $blogs;

        } catch (PDOException $e) {
            echo json_encode(['message' => "Error searching blogs: " . $e->getMessage()]);
        }
    }

    // GET
    public function getBlogsWithAuthors()
    { // for displaying all blogs with author info
        /* CONSIDERATIONS FOR THIS FUNCTION
            - get all blogs with author info
            - display blog_title, blog_body, blog_created_at, author_username
            - ** might want to add pagination later
        */
        try {
            $query = "
            SELECT 
                blogs.blog_id AS blog_id,
                blogs.blog_title AS blog_title,
                blogs.blog_body AS blog_body,
                blogs.blog_created_at AS author_posts_created_at,
                users.user_id AS author_user_id,
                users.user_username AS author_user_username
            FROM 
                blogs
            INNER JOIN
                author_posts ON blogs.blog_id = author_posts.author_posts_blog_id
            INNER JOIN
                users ON users.user_id = author_posts.author_posts_user_id
            ORDER BY
                blogs.blog_created_at DESC
            ";

            $stmt = $this->pdo->prepare($query);
            $stmt->execute();

            $blogs = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            return $blogs;

        } catch (PDOException $e) {
            echo json_encode(['message' => "Error fetching blogs w/ authors: " . $e->getMessage()]);
        }
    }

    public function getBlogById($blog_id)
    {
        try {
            $query = "
            SELECT 
                blogs.blog_id AS blog_id,
                blogs.blog_title AS blog_title,
                blogs.blog_body AS blog_body,
                blogs.blog_created_at AS author_posts_created_at,
                users.user_id AS author_user_id,
                users.user_username AS author_user_username
            FROM 
                blogs
            INNER JOIN
                author_posts ON blogs.blog_id = author_posts.author_posts_blog_id
            INNER JOIN
                users ON users.user_id = author_posts.author_posts_user_id
            WHERE
                blogs.blog_id = :blog_id
            ";
            $stmt = $this->pdo->prepare($query);
            $stmt->bindParam(':blog_id', $blog_id);
            $stmt->execute();
            $blog = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$blog) {
                throw new Exception("Blog not found");
            }

            return $blog;

        } catch (PDOException $e) {
            echo json_encode(['PDO Error: ' => $e->getMessage()]);
        } catch (Exception $e) {
            echo json_encode(['Error: ' => $e->getMessage()]);
            // return null;
        }
    }

    public function getBlogsByAuthor()
    {

    }

    public function addViews($blog_id){
        try {
            $query = "UPDATE blogs SET blog_views = blog_views + 1 WHERE blog_id = :blog_id";
            $stmt = $this->pdo->prepare($query);
            $stmt->bindParam(':blog_id', $blog_id);
            $incrementedView = $stmt->execute();

            if ($incrementedView) {
                return $incrementedView;
            } else {
                throw new Exception("Error adding views");
            }

        } catch (PDOException $e) {
            echo json_encode(['message' => "Error adding views: " . $e->getMessage()]);
        }
    }

    // PUT
    public function updateBlog($data, $blog_id)
    {
        try {
            $query = "UPDATE blogs SET blog_title = :blog_title, blog_body = :blog_body WHERE blog_id = :blog_id";
            $stmt = $this->pdo->prepare($query);
            $stmt->bindParam(':blog_title', $data['blog_title']);
            $stmt->bindParam(':blog_body', $data['blog_body']);
            $stmt->bindParam(':blog_id', $blog_id);
            $updateResult = $stmt->execute();

            if ($updateResult) {
                return $updateResult;

            } else {
                throw new Exception("Error updating blog");
            }
        } catch (Exception $e) {
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    // DELETE
    public function deleteBlog($blog_id, $user_id)
    {
        try {
            $query = "DELETE FROM blogs WHERE blog_id = :blog_id
            AND blog_id IN (SELECT author_posts_blog_id FROM author_posts WHERE author_posts_user_id = :user_id)";
            $stmt = $this->pdo->prepare($query);
            $stmt->bindParam(':blog_id', $blog_id);
            $stmt->bindParam(':user_id', $user_id);
            $deleteResult = $stmt->execute();

            return $deleteResult;

        } catch (PDOException $e) {
            $this->pdo->rollBack();
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    
}