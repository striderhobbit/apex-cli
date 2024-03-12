import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultService } from 'src/openapi';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent {
  constructor(
    public activatedRoute: ActivatedRoute,
    public defaultService: DefaultService,
    public router: Router
  ) {
    this.defaultService
      .loginUser({
        id: 'fa5055fb-ef74-47f8-bb4d-37ed821edc7c',
        password: 'password123',
      })
      .subscribe({
        complete: () =>
          this.router.navigate(['../dashboard'], {
            relativeTo: this.activatedRoute,
          }),
      });
  }
}
