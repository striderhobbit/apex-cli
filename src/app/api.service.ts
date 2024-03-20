import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, lastValueFrom, map, tap } from 'rxjs';
import { DefaultService, UserCredentials, UserDashboard } from 'src/openapi';

interface CustomErrorHandler<U> {
  (response: HttpErrorResponse): Promise<U>;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private readonly defaultService: DefaultService,
    private readonly router: Router
  ) {}

  public async getUserDashboard(): Promise<UserDashboard | void> {
    return this.pipe(
      this.defaultService.getUserDashboard(),
      this.handleAuthorizationError
    );
  }

  private get handleAuthorizationError(): CustomErrorHandler<void> {
    return async (response) => {
      switch (response.status) {
        case HttpStatusCode.Forbidden:
        case HttpStatusCode.NotFound:
          await this.router.navigate(['user/login']);

          return;
      }

      throw response;
    };
  }

  public async loginUser(userCredentials: UserCredentials): Promise<void> {
    return this.pipe(
      this.defaultService.loginUser(userCredentials).pipe(
        map(async () => {
          await this.router.navigate(['user/dashboard']);
        })
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
              return alert(response.message + '\n\n' + response.error);
            }

            throw response;
          }),
          tap(next)
        )
      )
    );
  }

  public async setUserPassword(password: string): Promise<void> {
    return this.pipe(
      this.defaultService
        .setUserPassword({ password })
        .pipe(tap(() => alert('Password changed'))),
      this.handleAuthorizationError
    );
  }
}
