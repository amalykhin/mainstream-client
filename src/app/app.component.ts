import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { StreamService } from './services/stream.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';

  constructor(
    private userService: UserService,
    private streamService: StreamService
  ) { }

  ngOnInit() {
    this.userService.init()
      .subscribe((user) => this.streamService.init(user.username));
  }
}
