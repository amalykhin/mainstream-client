import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Stream } from '../services/stream.service';

@Component({
  selector: 'app-stream-list-element',
  templateUrl: './stream-list-element.component.html',
  styleUrls: ['./stream-list-element.component.css']
})
export class StreamListElementComponent implements OnInit {
  @Input() stream: Stream;
  
  constructor(private router: Router) { }

  ngOnInit() {
  }

  onClick() {
    console.debug(`Stream key: ${this.stream.broadcaster.streamerKey}`);
    const broadcasterName = this.stream.broadcaster.username;
    this.router.navigate([`/stream/${broadcasterName}`], {state: {data: this.stream}});
    console.debug('After navigation');
  }
}
