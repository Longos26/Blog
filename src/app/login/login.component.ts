import { AuthFService } from '../services/auth-f.service';
import { CookieService } from 'ngx-cookie-service';
import { Component, NgModule, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule,
    MatIconModule, ReactiveFormsModule, CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  isLoggedIn: boolean;

  constructor
    (private formBuilder: FormBuilder,
      private authFService: AuthFService,
      private cookieService: CookieService,
      private router: Router
    ) {
    this.isLoggedIn = false;
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(1)]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.authFService.isLoggedIn$.subscribe((value) => {
      this.isLoggedIn = value;
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authFService.login(email, password).subscribe(
        (response) => {
          console.log(response);
          this.cookieService.set('token', response.token);
          // console.log(this.cookieService.get('token'));
          this.authFService.setLoggedIn(true);
          this.router.navigate(['/']);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  onLogout() {
    this.authFService.logout();
    this.authFService.setLoggedIn(false);
  }
}
