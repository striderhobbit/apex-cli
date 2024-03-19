import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultService, UserCredentials } from 'src/openapi';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent {
  userCredentials: UserCredentials = {
    id: 'fa5055fb-ef74-47f8-bb4d-37ed821edc7c',
    password: 'password123',
  };

  constructor(
    public activatedRoute: ActivatedRoute,
    public defaultService: DefaultService,
    public router: Router
  ) {}

  loginUser(): void {
    this.defaultService.loginUser(this.userCredentials).subscribe({
      complete: () =>
        this.router.navigate(['../dashboard'], {
          relativeTo: this.activatedRoute,
        }),
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          alert(error.error);
        }
      },
    });
  }
}
