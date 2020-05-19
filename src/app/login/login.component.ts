import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { StreamService } from '../services/stream.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private sub: Subscription;
  signInForm: any;

  constructor(
    private userService: UserService,
    private streamService: StreamService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.signInForm = this.formBuilder.group({
      username: '',
      password: ''
    });
  }

  ngOnInit() {
  }

  onSubmit({username, password}) {
    this.signInForm.reset({username, password: ''});
    this.sub = this.userService.login(username, password)
      .subscribe((user) => {
        console.debug('Auth response:');
        console.debug(user);
        
        this.streamService.init(user.username);
        this.router.navigate(['']);
      });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
