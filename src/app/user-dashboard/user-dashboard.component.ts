import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultService, UserDashboard } from 'src/openapi';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent {
  userDashboard?: UserDashboard;

  constructor(
    public activatedRoute: ActivatedRoute,
    public defaultService: DefaultService,
    public router: Router
  ) {
    this.getUserDashboard();
  }

  getUserDashboard(): void {
    this.defaultService.getUserDashboard().subscribe({
      next: (userDashboard) => (this.userDashboard = userDashboard),
      error: (error) => {
        switch (error.status) {
          case HttpStatusCode.Forbidden:
          case HttpStatusCode.NotFound:
            this.router.navigate(['../login'], {
              relativeTo: this.activatedRoute,
            });
        }
      },
    });
  }

  setUserPassword(password: string): void {
    this.defaultService.setUserPassword({ password }).subscribe({
      complete: () => alert('Password changed'),
    });
  }
}
