import { Component, OnInit, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BlogFService } from '../services/blog-f.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
// import ImageResize from 'quill-image-resize-module';

Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [
    QuillModule, RouterModule, MatButton, MatFormField, MatInputModule, FormsModule,
    CommonModule, ReactiveFormsModule,
  ],
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css']
})
export class CreateBlogComponent {
  blogForm: FormGroup = new FormGroup({});
  placeholderText = "Create your blog...";
  content = '';
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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private blogFService: BlogFService,
    private router: Router,
  ) {
    this.blogForm = this.formBuilder.group({
      blog_title: ['', [Validators.required, Validators.minLength(1)]],
      blog_body: ['', [Validators.required, Validators.minLength(1)]],
    });
  }  

  onContentChanged(content: string) {
    // Handle content changes
  }

  onSave() {
    if (this.blogForm.valid) {
      /* const { blogTitle, blogBody } = this.blogForm.value; */
      this.blogFService.createBlog(this.blogForm.value).subscribe(
        (response) => {
          console.log(response);
          this.router.navigate(['/blogs']);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  goBack() {
    this.router.navigate(['/blogs']);
  }
}
