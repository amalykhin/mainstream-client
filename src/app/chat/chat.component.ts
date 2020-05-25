import { Component, OnInit, Input } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { UserService } from '../services/user.service';
import { Stream } from '../services/stream.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private hubConnection: HubConnection;
  private username: string;
  @Input() currentStream: Stream;
  chatEntries$ = new BehaviorSubject<any[]>([]);

  constructor(private userService: UserService) { 
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:5001/chat')
      .build();
    this.hubConnection.start();
    this.hubConnection.on('ReceiveMessage', chatEntry => {
      console.debug(chatEntry);
      const entries = this.chatEntries$.value;
      entries.push(chatEntry);
      this.chatEntries$
        .next(entries);
    });

    this.userService.currentUser$.subscribe(user => this.username = user.username);
  }

  ngOnInit(): void {
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
