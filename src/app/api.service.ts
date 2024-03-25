import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, concat, lastValueFrom, map } from 'rxjs';
import { DefaultService, UserCredentials, UserDashboard } from 'src/openapi';
import { DialogService } from './dialog.service';
import { WebSocketService } from './web-socket.service';

interface CustomErrorHandler<U> {
  (response: HttpErrorResponse): Promise<U>;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private readonly defaultService: DefaultService,
    private readonly dialogService: DialogService,
    private readonly router: Router,
    private readonly webSocketService: WebSocketService
  ) {}

  public async getUserDashboard(): Promise<UserDashboard | void> {
    return this.pipe(
      this.defaultService.getUserDashboard(),
      this.handleAuthorizationError
    );
  }

  private get handleAuthorizationError(): CustomErrorHandler<void> {
    return async (response) => {
      if (response.status === HttpStatusCode.Unauthorized) {
        await this.router.navigate(['user/login']);

        return;
      }

      throw response;
    };
  }

  public async loginUser(credentials: UserCredentials): Promise<void> {
    return this.pipe(
      this.defaultService.loginUser(credentials).pipe(
        map(async () => {
          await this.router.navigate(['user/dashboard']);
        })
      )
    );
  }

  public async logoutUser(): Promise<void> {
    return this.pipe(
      this.defaultService.logoutUser().pipe(
        map(async () => {
          await this.router.navigate(['user/login']);
        })
      )
    );
  }

  public async refreshUserSession(credentials: UserCredentials): Promise<void> {
    return this.pipe(
      concat(
        this.defaultService.logoutUser(),
        this.defaultService.loginUser(credentials)
      )
    );
  }

  private async pipe<T, U>(
    observable: Observable<T>,
    customErrorHandler?: CustomErrorHandler<U>
  ): Promise<T | U | void> {
    return new Promise((next) =>
      lastValueFrom(
        observable.pipe(
          catchError((response: HttpErrorResponse) => {
            if (customErrorHandler != null) {
              return customErrorHandler(response);
            }

            throw response;
          }),
          catchError(async (response) => {
            if (response instanceof HttpErrorResponse) {
              await this.dialogService.open({
                type: 'error',
                title: response.message,
                body: response.error,
              });

              return;
            }

            throw response;
          }),
          map(next)
        )
      )
    );
  }

  public async setUserPassword(password: string): Promise<void> {
    return this.pipe(
      this.defaultService.setUserPassword({ password }).pipe(
        map(async () => {
          await this.dialogService.open({
            type: 'info',
            title: 'Password changed',
            body: '',
          });
        })
      ),
      this.handleAuthorizationError
    );
  }
}
