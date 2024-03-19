import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DefaultService, UserDashboard } from 'src/openapi';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent {
  protected userDashboard?: UserDashboard;

  constructor(
    private activatedRoute: ActivatedRoute,
    private defaultService: DefaultService,
    private router: Router
  ) {
    this.getUserDashboard();
  }

  private getUserDashboard(): Subscription {
    return this.defaultService.getUserDashboard().subscribe({
      next: (userDashboard) => (this.userDashboard = userDashboard),
      error: (error) => {
        switch (error.status) {
          case HttpStatusCode.Forbidden:
          case HttpStatusCode.NotFound:
            return this.router.navigate(['../login'], {
              relativeTo: this.activatedRoute,
            });
        }

        throw error;
      },
    });
  }

  protected setUserPassword(password: string): Subscription {
    return this.defaultService.setUserPassword({ password }).subscribe({
      complete: () => alert('Password changed'),
    });
  }
}
