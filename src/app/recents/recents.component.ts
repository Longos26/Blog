import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-recents',
  standalone: true,
  imports: [MatCardModule,],
  templateUrl: './recents.component.html',
  styleUrl: './recents.component.css'
})
export class RecentsComponent {

}
