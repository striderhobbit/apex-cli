import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DefaultService, UserCredentials } from 'src/openapi';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent {
  protected readonly userCredentials: UserCredentials = {
    id: 'fa5055fb-ef74-47f8-bb4d-37ed821edc7c',
    password: 'foobar',
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private defaultService: DefaultService,
    private router: Router
  ) {}

  protected loginUser(): Subscription {
    return this.defaultService.loginUser(this.userCredentials).subscribe({
      complete: () =>
        this.router.navigate(['../dashboard'], {
          relativeTo: this.activatedRoute,
        }),
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          return alert(error.error);
        }

        throw error;
      },
    });
  }
}
