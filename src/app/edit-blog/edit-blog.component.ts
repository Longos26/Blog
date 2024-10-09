import { Component } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BlogFService } from '../services/blog-f.service';
import { OnInit } from '@angular/core';
import { json } from 'stream/consumers';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { error } from 'node:console';

Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-edit-blog',
  standalone: true,
  imports: [ 
    QuillModule, RouterModule, MatButton, MatFormField, MatInputModule, FormsModule, 
    CommonModule, ReactiveFormsModule, RouterModule
  ],
  templateUrl: './edit-blog.component.html',
  styleUrl: './edit-blog.component.css'
})
export class EditBlogComponent implements OnInit {

  blogForm: FormGroup = new FormGroup({});
  blogId!: number;
  placeholderText = "Edit your blog...";
  content: any;
  quillConfig = {
    blotFormatter: {
      overlay: {
        styles: {
          border: '2px solid red',
          boxSizing: 'border-box',
        }
      }
    }
  };

  constructor
  (
    private formBuilder: FormBuilder,
    private blogFService: BlogFService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute
  ) 
    {
      this.blogForm = this.formBuilder.group({
        blogTitle: ['', [Validators.required, Validators.minLength(1)]],
        blogBody: ['', [Validators.required, Validators.minLength(1)]],
      })
    }

  ngOnInit() {
    this.showCurrentBlogContent();
  }

  onSaveEdit() {
    // Save the blog content
    if (this.blogForm.valid) {
      const { blogTitle, blogBody } = this.blogForm.value;
      const blog_id = this.ActivatedRoute.snapshot.params['id'];
      this.blogFService.updateBlog(blogTitle, blogBody, blog_id).subscribe(
        (response) => {
          console.log(response);
          this.router.navigate(['/blogs/' + blog_id]);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  showCurrentBlogContent() {
    // Get the current blog content
    this.blogId = this.ActivatedRoute.snapshot.params['id'];
    this.blogFService.displayBlogById(this.blogId).subscribe(
      (response) => {
        console.log(response);
        this.blogForm.patchValue({
          blogTitle: response.blog.blog_title,
          blogBody: response.blog.blog_body,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  goBack():void {
    this.router.navigate(['/blogs/' + this.blogId]);
  }
}
