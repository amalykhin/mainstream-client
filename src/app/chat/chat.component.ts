import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor() { }

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
}
