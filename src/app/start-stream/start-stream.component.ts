import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User, UserService } from '../services/user.service';
import { StreamService } from '../services/stream.service';

@Component({
  selector: 'app-start-stream',
  templateUrl: './start-stream.component.html',
  styleUrls: ['./start-stream.component.css']
})
export class StartStreamComponent implements OnInit {
  currentUser: User;
  private userSubscription: Subscription;
  startStreamForm;

  constructor(
    private streamService: StreamService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { 
    this.startStreamForm = this.formBuilder.group({
      title: '',
      description: ''
    });
  }

  ngOnInit() {
    this.userSubscription = this.userService.currentUser$
      .subscribe(user => this.currentUser = user);
    // this.currentUser = this.userService.currentUser$.getValue();
    console.debug(`Streamer key: ${this.currentUser ? this.currentUser.streamerKey : null}`);
  }

  onSubmit(newStreamInfo) {
    newStreamInfo.broadcaster = this.currentUser.username;
    this.streamService.startStream(newStreamInfo)
      .subscribe(() => this.router.navigate(['']));
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
