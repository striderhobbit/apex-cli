import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import {
  DialogComponent,
  DialogData,
  DialogRef,
} from './dialog/dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private readonly dialog: MatDialog) {}

  public async open(data: DialogData): Promise<boolean | undefined> {
    const dialogRef: DialogRef = this.dialog.open<DialogComponent, DialogData>(
      DialogComponent,
      { data }
    );

    return lastValueFrom(dialogRef.afterClosed());
  }
}
