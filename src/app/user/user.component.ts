import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs';
import { DefaultService, User } from 'src/openapi';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  user?: User;

  constructor(
    private activatedRoute: ActivatedRoute,
    private defaultService: DefaultService
  ) {
    this.activatedRoute.paramMap
      .pipe(
        map((paramMap) => paramMap.get('userId')!),
        mergeMap((userId) => this.defaultService.getUser(userId))
      )
      .subscribe({
        next: (user) => (this.user = user),
        error: ({ error }) => {
          alert(error.message);
        },
      });
  }
}
