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

  constructor(private userService: UserService) {  
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  ngOnInit() {
    this.userSubscription = this.userService.currentUser$
      .subscribe((user) => {
        this.currentUser = user;
        console.debug(`Current user: ${this.currentUser?.username}`);
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
