import { Component, OnInit } from '@angular/core';
import { IdentityService } from './services/identity.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private identityService: IdentityService) { }

  ngOnInit() {
  }

  onLogout() {
    this.identityService.logout();
    // this.loginForm.reset();
    // this.loggedIn = false;

  }

}
