import { Component, OnInit } from '@angular/core';
import { StreamService } from '../services/stream.service';

@Component({
  selector: 'app-stream-list',
  templateUrl: './stream-list.component.html',
  styleUrls: ['./stream-list.component.css']
})
export class StreamListComponent implements OnInit {
  streams;


  constructor(private streamService: StreamService) { }

  ngOnInit() {
    this.streamService.getAllStreams()
      .subscribe(streams => this.streams = streams);
  }

}
