import { Component } from '@angular/core';
import { DefaultService } from 'src/openapi';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private apiService: DefaultService) {}
}
