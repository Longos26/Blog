import { Component, Injectable, OnInit, Sanitizer } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Observable, filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BlogFService } from '../services/blog-f.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
// import { error } from 'console';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// import { json } from 'stream/consumers';
import { FormsModule } from '@angular/forms';
import {SafeHtml, DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [MatButtonModule, MatFormField, MatInputModule, MatCardModule, RouterModule, CommonModule, FormsModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit {
  safeHtml: SafeHtml =''; // safe html
  blogs: any = []; // array to hold blogs
  search: string = ''; // search string
  currentUserId: number | null = null; // current user id
   pageViews: number = 0;
  constructor(private blogFService: BlogFService, private router: Router, private sanitizer: DomSanitizer) { }

  setHTML(blog_body: string): void {
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(blog_body);
  }

  ngOnInit(): void {
    this.currentUserId = this.blogFService.getCurrentUserId();
    this.fetchBlogs();    
  }

  onSearch(): void{
    if (this.search.trim()) {
      this.blogFService.searchBlogs(this.search).subscribe(
        (response) => {
          console.log('Search results: ', response);
          this.blogs = response.blogs;
        },
        (error) => {
          console.log('Error searching blogs: ', error);
        }
      );
    } else {
      console.log ('Search string is empty');
      this.fetchBlogs();
    }
  }

  fetchBlogs(): void {
    // display blogs
    this.blogFService.displayBlogs().subscribe(
      (response) => {
        console.log('Blogs: ', response);
        this.blogs = response.blogs;
      },
      (error) => {
        console.log('Error fetching blogs: ', error);
      }
    );
  }

  // fetchBlogs(): void {
  //   // Fetch and sanitize blogs
  //   this.blogFService.displayBlogs().subscribe(
  //     (response) => {
  //       console.log('Blogs: ', response);
  //       this.blogs = response.blogs.map((blog: any) => ({
  //         ...blog,
  //         safeHtml: this.setHTML(blog.blog_body),
  //       }));
  //     },
  //     (error) => {
  //       console.log('Error fetching blogs: ', error);
  //     }
  //   );
  // }

  getSummary(blog_body: string): string {
    const maxLength = 140;
    return blog_body.length > maxLength ? blog_body.substring(0, maxLength) + '...' : blog_body;
  }

  shortenTitle(blog_title: string): string {
    const maxLength = 45; //maximum length of string detail
    if (blog_title.length > maxLength) {
      return blog_title.substring(0, maxLength) + '...';
    }

    return blog_title;
  }

  readMore(blog_id: number): void {
    this.incrementViewCount(blog_id);
    this.router.navigate(['/blogs', blog_id]);     
  }

  incrementViewCount(blog_id: number) {
    const storedViews = localStorage.getItem(`views_${blog_id}`);
    const views = storedViews ? +storedViews : 0;
    const newViews = views + 1; // Increment the view count
    localStorage.setItem(`views_${blog_id}`, newViews.toString()); // Save back to localStorage
    console.log(`Blog ${blog_id} Views:`, newViews); // Log updated views
  }

  getViewCount(blog_id: number): number {
    const storedViews = localStorage.getItem(`views_${blog_id}`);
    return storedViews ? +storedViews : 0; // Return 0 if no views are found
  }

  createPost(){
    this.router.navigate(['/create-blog']); 
  }
}
