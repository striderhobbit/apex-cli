import { Component } from '@angular/core';
import { UserDashboard } from 'src/openapi';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent {
  protected dashboard?: UserDashboard;

  constructor(private readonly apiService: ApiService) {
    this.getUserDashboard();
  }

  private async getUserDashboard(): Promise<void> {
    const dashboard = await this.apiService.getUserDashboard();

    if (dashboard != null) {
      this.dashboard = dashboard;
    }
  }

  protected async setUserPassword(password: string): Promise<void> {
    return this.apiService.setUserPassword(password);
  }
}
