import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserState, UserService } from '../services/user.service';

@Component({
  selector: 'app-current-user',
  templateUrl: './current-user.component.html',
  styleUrls: ['./current-user.component.css']
})
export class CurrentUserComponent implements OnInit {
  @Input() user: User;
  UserState = UserState;
  
  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  logOut() {
    this.userService.logout()
      .subscribe(() => {});
  }

}
