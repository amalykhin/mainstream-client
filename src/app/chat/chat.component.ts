import { Component, Input, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { fromEvent, Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { Stream } from '../services/stream.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private readonly CHAT_ENTRY_LIMIT = 100;

  private hubConnection: HubConnection;
  private username: string;

  @Input() currentStream: Stream;
  chatEntries$: Observable<any>;

  constructor(private userService: UserService) { 
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:5001/chat')
      .build();

    this.chatEntries$ = fromEvent(this.hubConnection, 'receivemessage')
      .pipe(
        scan((acc, curr) => {
          if (acc.push(curr) > this.CHAT_ENTRY_LIMIT) {
            acc.shift();
          }
          return acc;
        }, [])
      );

    this.userService.currentUser$.subscribe(user => this.username = user.username);
  }

  ngOnInit(): void {
    this.hubConnection.start();
  }

  delayedResize(event: KeyboardEvent, textarea: HTMLElement) {
    setTimeout(this.resize, 0, event, textarea);
  }

  private resize(event: KeyboardEvent, textarea: HTMLElement) {
    const key = event.key;
    if (!['Enter', 'Backspace', 'Delete'].includes(key)) {
      return;
    }

    textarea.style.height = 'auto';
    const newHeight = textarea.scrollHeight.toString();
    textarea.style.height = newHeight + 'px';
  }

  sendMessage(textarea: HTMLTextAreaElement, sendButton: HTMLButtonElement) {
    const message = textarea.value;
    sendButton.disabled = true;
    this.hubConnection.invoke("sendmessage", this.username, message)
      .then(() => {
        sendButton.disabled = false;
        textarea.value = '';
      });

  }
}
