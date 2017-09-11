import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; 
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username;
  email;
  status;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService
  ) { }

  ngOnInit(){
    this.authService.getProfile().subscribe(data => {
      // console.log(data);
      this.username = data.user.username;
      this.email = data.user.email;
      // this.status = data.user.activation;
      if(data.user.activation){
        this.status = 'Email verified!'
      }else{
        this.status = 'You need to verify your email address.'
      }
    });
  }
}
