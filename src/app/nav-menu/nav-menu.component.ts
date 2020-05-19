import { Component } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User, UserState, UserService } from '../services/user.service';
import { StreamService } from '../services/stream.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  private userSubscription: Subscription;

  isExpanded = false;
  currentUser: User;
  user$;

  UserState = UserState;

  constructor(
    private userService: UserService,
    private streamService: StreamService,
    private router: Router
  ) { }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  ngOnInit() {
    // this.userSubscription = this.userService.currentUser$
    //   .subscribe((user) => {
    //     this.currentUser = user;
    //     console.debug(`Current user:`);
    //     console.debug(this.currentUser);
    //   });
    this.user$ = this.userService.currentUser$;
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  endStream() {
    console.debug('Ending current stream...');
    this.streamService.endStream()
      .subscribe(() => {});
  }
}
