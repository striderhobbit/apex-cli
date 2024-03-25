import { Injectable } from '@angular/core';
import { WebSocket } from '@shared/ws';
import { Subject, concatMap, retry } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private webSocketSubject!: Subject<WebSocket.Message>;

  constructor(private readonly dialogService: DialogService) {
    this.connect();

    setInterval(
      () =>
        this.sendMessage({
          type: 'text',
          subType: 'info',
          body: 'pong',
        }),
      1e3
    );
  }

  private connect(): void {
    (this.webSocketSubject = webSocket<WebSocket.Message>({
      url: 'wss://localhost:3000',
      openObserver: {
        next: () => console.info('[web-socket-server] Connected.'),
      },
      closeObserver: {
        next: () => console.info('[web-socket-server] Connection closed.'),
      },
    }))
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

          return message;
        })
      )
      .subscribe({
        complete: () => this.connect(),
      });
  }

  public sendMessage(message: WebSocket.Message): void {
    this.webSocketSubject.next(message);
  }
}
