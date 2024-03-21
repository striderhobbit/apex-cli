import { Component } from '@angular/core';
import { UserCredentials } from 'src/openapi';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent {
  protected readonly credentials: UserCredentials = {
    id: 'fa5055fb-ef74-47f8-bb4d-37ed821edc7c',
    password: 'foobar',
  };

  constructor(private readonly apiService: ApiService) {}

  protected async loginUser(): Promise<void> {
    return this.apiService.loginUser(this.credentials);
  }
}
