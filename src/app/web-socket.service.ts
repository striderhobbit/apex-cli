import { Injectable } from '@angular/core';
import { WebSocket } from '@shared/ws';
import { concatMap, retry } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  constructor(private readonly dialogService: DialogService) {
    webSocket<WebSocket.Message>({
      url: 'ws://localhost:3001',
      openObserver: {
        next: () => console.info('[web-socket-server] Connected.'),
      },
    })
      .pipe(
        retry({ delay: 1e3 }),
        concatMap(async (message) => {
          switch (message.type) {
            case 'text':
              if (message.body) {
                await this.dialogService.open({
                  type: 'info',
                  title: 'WebSocket',
                  body: message.body,
                });
              }
          }
        })
      )
      .subscribe({
        error: (error) => {
          switch (error.type) {
            case 'close':
              console.info('[web-socket-server] Connection closed.');
          }
        },
      });
  }
}
