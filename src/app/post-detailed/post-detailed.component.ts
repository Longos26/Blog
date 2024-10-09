import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { BlogFService } from '../services/blog-f.service';
import { CommonModule } from '@angular/common';
import { response } from 'express';
import { error } from 'console';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { CommentsDisplayComponent } from '../comments-display/comments-display.component';
import { CommentsFormComponent } from '../comments-form/comments-form.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-post-detailed',
  standalone: true,
  imports: [RouterModule, CommonModule, MatCardModule, MatButton, CommentsDisplayComponent, CommentsFormComponent],
  templateUrl: './post-detailed.component.html',
  styleUrl: './post-detailed.component.css'
})
export class PostDetailedComponent implements OnInit {
  @ViewChild(CommentsDisplayComponent) commentsDisplay!: CommentsDisplayComponent;
  blog: any; // single blog
  currentUserId: number | null = null; // current user id
  windows: any;
  blog_id: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private blogFService: BlogFService,
    private cookieService: CookieService,
  ) { };

  ngOnInit(): void {
    this.currentUserId = this.blogFService.getCurrentUserId();
    this.blog_id = this.activatedRoute.snapshot.params['id'];
    this.fetchBlogById();
    const cookieExpire = 1 / 24; // 1 hour

    // if(!this.cookieService.check(`viewed_blog_${blog_id}`)){
    //   this.cookieService.set(`viewed_blog_${blog_id}`, 'true', cookieExpire, '/', '', true, 'None');
    // }
  }

  onCommentAdded(): void {
    this.commentsDisplay.fetchComments();
  }

  fetchBlogById(): void {
    console.log('Blog ID: ', this.blog_id);
    this.blogFService.displayBlogById(this.blog_id).subscribe(
      (response) => {
        console.log('Blog: ', response);
        this.blog = response.blog;
      },
      (error) => {
        console.log('Error fetching blog: ', error);
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/blogs']);
  }

  editBlog(blog_id: number): void {
    this.router.navigate(['/edit-blog', blog_id]);
  }

  deleteBlog(blog_id: number): void {
    const confirmation = confirm('Are you sure you want to delete this blog?');

    if (confirmation) {
      this.blogFService.deleteBlog(blog_id).subscribe(
        (response) => {
          console.log('Blog deleted: ', response);
          // this.fetchBlogs();
          window.location.reload()
          this.router.navigate(['/blogs']);
        },
        (error) => {
          console.log('Error deleting blog: ', error);
        }
      );

    }
  }
}
