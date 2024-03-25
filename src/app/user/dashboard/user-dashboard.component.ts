import { Component } from '@angular/core';
import { WebSocketService } from 'src/app/web-socket.service';
import { UserDashboard } from 'src/openapi';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent {
  protected dashboard?: UserDashboard;

  constructor(
    private readonly apiService: ApiService,
    private readonly webSocketService: WebSocketService
  ) {
    this.getUserDashboard();
  }

  private async getUserDashboard(): Promise<void> {
    const dashboard = await this.apiService.getUserDashboard();

    if (dashboard != null) {
      this.dashboard = dashboard;
    }
  }

  protected async logoutUser(): Promise<void> {
    return this.apiService.logoutUser();
  }

  protected async refreshUserSession(): Promise<void> {
    return this.apiService.refreshUserSession({
      id: 'fa5055fb-ef74-47f8-bb4d-37ed821edc7c',
      password: 'foobar',
    });
  }

  protected sendMessage(): void {
    this.webSocketService.sendMessage({
      type: 'text',
      subType: 'info',
      body: 'Hello, world!',
    });
  }

  protected async setUserPassword(password: string): Promise<void> {
    return this.apiService.setUserPassword(password);
  }
}
