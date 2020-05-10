import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
      .subscribe(() => this.router.navigate(['']));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
