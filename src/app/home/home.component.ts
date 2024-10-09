import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RecentsComponent } from '../recents/recents.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecentsComponent, MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
