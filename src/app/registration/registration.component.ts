import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm: any;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { 
    this.registrationForm = formBuilder.group({
      username: '',
      password: '',
      password2: '',
      email: ''
    })
  }

  ngOnInit() {
  }

  onSubmit(formInfo) {
    this.registrationForm.reset({
      username: formInfo.username,
      password: '',
      password2: '',
      email: formInfo.email
    });

    if (formInfo.password === formInfo.password2) {
      delete formInfo.password2;
      this.userService.register(formInfo)
      .toPromise()
      .then(() => this.router.navigate(['']));
    }
  }
}
