import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface DialogData {
  type: 'error' | 'info' | 'warning';
  title: string;
  body: string;
}

export interface DialogRef extends MatDialogRef<DialogComponent, boolean> {}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
})
export class DialogComponent {
  protected readonly color: string = 'accent';

  constructor(
    @Inject(MatDialogRef)
    protected readonly ref: DialogRef,
    @Inject(MAT_DIALOG_DATA)
    protected readonly data: DialogData
  ) {}
}
