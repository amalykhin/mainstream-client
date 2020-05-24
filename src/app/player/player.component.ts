import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import videojs from 'video.js';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  private readonly streamServerUrl = 'http://167.172.107.135:8080/livestreams';
  
  @ViewChild('video') videoElement: ElementRef;
  player;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const stream = history.state.data;
    console.debug(stream);

    const streamKey = stream.broadcaster.streamerKey;

    let streamUrl = stream.broadcastUri;
    if (!streamUrl) {
      streamUrl = `${this.streamServerUrl}/${streamKey}.m3u8`;
    }
    console.debug(streamUrl);
    this.player = videojs(this.videoElement.nativeElement);
    this.player.src({type: "application/vnd.apple.mpegurl", src: streamUrl}) 
    this.player.ready(() => this.player.play());
    // console.log(this.player.tech().hls);
  }

  ngOnDestroy() {
    this.player.dispose();
  }
}
