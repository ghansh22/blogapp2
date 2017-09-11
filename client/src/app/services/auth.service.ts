import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { FlashMessagesService } from 'angular2-flash-messages';

@Injectable()
export class AuthService {

  domain = "http://localhost:8080/"
  authToken;
  user;
  options;
  constructor(
    private router: Router,
    private http: Http,
    private flashMessagesService: FlashMessagesService
  ) { }

  registerUser(user){
    return this.http.post(this.domain+'authentication/register',user).map(res => res.json());
  }

  checkEmail(email){
    return this.http.get(this.domain+'authentication/checkEmail/'+email).map(res=>res.json());
  }

  checkUsername(username){
    return this.http.get(this.domain+'authentication/checkUsername/'+username).map(res=>res.json());
  }

  newBlog(blog){
    this.createAuthenticationHeader();
    return this.http.post(this.domain+'blogs/newBlog', blog, this.options).map(res => res.json());
  }

  activateUserFunction(activationCode){
    this.createAuthenticationHeader();
    return this.http.post(this.domain+'authentication/activateUser', activationCode, this.options).map(res => res.json());
  }

  activateUser(activationCode){
    this.createAuthenticationHeader();
    console.log(this.options);
    console.log(activationCode);

    return this.http.post(this.domain+'authentication/activateUser', activationCode, this.options).map(res=>res.json());
  }

  login(user){
    return this.http.post(this.domain+'authentication/login',user).map(res=>res.json());
  }

  storeUserData(token, user){
    // setItem(key,data)
    localStorage.setItem('token',token);
    localStorage.setItem('user',JSON.stringify(user));
    this.authToken = token;
    this.user = token;
  }

  loadToken(){
    this.authToken = localStorage.getItem('token');
  }

  createAuthenticationHeader(){
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-type': 'application/json',
        'authorization': this.authToken
      })
    });
  }

  sandBox(){
    this.checkUserActivated().subscribe(data=>{
      if(data.success === false){
        this.flashMessagesService.show('You need to verify your email address to view this page!', { timeout: 2000, cssClass: 'alert-warning' });
        this.router.navigate(['/activate-user']);
        return false;
      }else{  
        return true;
      }
    });
  }

  checkUserActivated(){
    this.createAuthenticationHeader();
    return this.http.get(this.domain+'authentication/checkUserActivated/',this.options).map(res=>res.json());
  }
  
  getProfile(){
    this.createAuthenticationHeader();
    console.log(this.options);
    return this.http.get(this.domain+'authentication/profile', this.options).map(res=>res.json());
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  loggedIn() {
    return tokenNotExpired();
  }  

  
}