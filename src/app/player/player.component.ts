import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import videojs from 'video.js';
import { Stream, StreamService } from '../services/stream.service';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  private readonly streamServerUrl = 'http://167.172.107.135:8080/livestreams';
  private streamUriPromise: Promise<string>;
  
  @ViewChild('video') videoElement: ElementRef;
  player;
  stream: Stream;

  constructor(
    private activatedRoute: ActivatedRoute,
    private streamService: StreamService
  ) { 
  }

  ngOnInit() {
    const channel = this.activatedRoute.snapshot.paramMap.get('channel');
    this.streamUriPromise = this.streamService.getStream(channel)
      .toPromise()
      .then(stream => {
        this.stream = stream;
        let {streamUri, broadcaster: {streamerKey}} = this.stream;
        if (!streamUri) {
          streamUri = `${this.streamServerUrl}/${streamerKey}.m3u8`;
        }
        return streamUri
      });
  }

  ngAfterViewInit() {
    this.streamUriPromise
      .then((streamUri) => {
        console.debug(streamUri);
        this.initVideoPlayer(streamUri)
      });
  }

  ngOnDestroy() {
    this.player.dispose();
  }

  private initVideoPlayer(mediaUri: string) {
    this.player = videojs(this.videoElement.nativeElement);
    this.player.src({type: "application/vnd.apple.mpegurl", src: mediaUri}) 
    this.player.ready(() => this.player.play());
  }
}
