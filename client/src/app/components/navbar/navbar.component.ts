import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private authServce: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService
  ) { }

  ngOnInit() {
    // console.log(this.authServce.loggedIn());
  }

  onLogoutClick(){
    this.authServce.logout();
    this.flashMessagesService.show('You are logged out', { timeout: 3000, cssClass: 'alert-info' });
    this.router.navigate(['/']);
  }
}
