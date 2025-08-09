import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  current_date: Date = new Date();

  setDate($event: Date) {
    this.current_date = $event;
  }
}
