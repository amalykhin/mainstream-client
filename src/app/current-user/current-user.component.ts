import { Component, OnInit, Input } from '@angular/core';
import { UserService, User, UserState} from '../user.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-current-user',
  templateUrl: './current-user.component.html',
  styleUrls: ['./current-user.component.css']
})
export class CurrentUserComponent implements OnInit {
  @Input() user: User;
  UserState = UserState;
  
  constructor() { 
  }

  ngOnInit() {
  }

}
