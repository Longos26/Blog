import { Component, OnInit } from '@angular/core';
import { CommentsFService } from '../services/comments-f.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BlogFService } from '../services/blog-f.service';

@Component({
  selector: 'app-comments-display',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterModule],
  templateUrl: './comments-display.component.html',
  styleUrls: ['./comments-display.component.css'] // fixed styleUrl to styleUrls
})
export class CommentsDisplayComponent implements OnInit {
  comments: any[] = [];
  currentUserId: number | null = null;
  quillBlogConfig = {
    modules: {
      // blotFormatter: {}, // commented out as it's not being used
    }
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private commentsFService: CommentsFService,
    private blogFService: BlogFService,
    private router: Router // added Router to the constructor
  ) {}

  ngOnInit(): void {
    this.fetchComments();
    this.currentUserId = this.getCurrentUserId();
  }

  fetchComments(): void {
    const blog_id = this.activatedRoute.snapshot.params['id'];
    this.commentsFService.getBlogComments(blog_id).subscribe(
      (response) => {
        this.comments = response.comments;
        console.log('Comments: ', response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onCommentAdded() {
    this.fetchComments();
  }

  getCurrentUserId(): number | null {
    return this.blogFService.getCurrentUserId();
  }

  editComment(comment_id: number): void {
    this.commentsFService.updateComment(comment_id).subscribe(
      (response) => {
        console.log(response);
        this.fetchComments(); // added to refresh comments after update
      }, 
      (error) => {
        console.log(error);
      }
    );
  }

  deleteComment(comment_id: number): void { // fixed typo in method name
    const confirmation = confirm('Are you sure you want to delete this comment?'); // fixed typo in message

    if (confirmation) {
      this.commentsFService.deleteBlogComment(comment_id).subscribe(
        (response) => {
          console.log(response);
          this.fetchComments(); // added to refresh comments after delete
        },
        (error) => {
          console.log(error)
        }
      )
    }    
  } 
}