import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder} from '@angular/forms';
import { AuthFService } from '../services/auth-f.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup({});

  constructor(private router: Router, private formBuilder: FormBuilder, private authFService: AuthFService) {
    this.registerForm = this.formBuilder.group({
      username: ['',[ Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(1)]],
      password: ['', Validators.required]
    });

  }

  onRegister() {
    if (this.registerForm.valid) {
      /* const { username, email, password } = this.registerForm.value; */
      this.authFService.register(this.registerForm.value).subscribe(
        (response) => {
          console.log(response);
          this.router.navigate(['/login']);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
