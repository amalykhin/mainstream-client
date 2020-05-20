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
  private userSubscription: Subscription;
  startStreamForm;
  currentUser: User;
  isSelfHosted: boolean = false;

  constructor(
    private streamService: StreamService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { 
    this.startStreamForm = this.formBuilder.group({
      title: '',
      description: '',
      streamUri: ''
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

  toggleSelfHosted() {
    this.isSelfHosted = !this.isSelfHosted;
  }
}
