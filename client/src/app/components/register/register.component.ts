import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  messageClass;
  message;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm();
   }

  createForm(){
    this.form = this.formBuilder.group({
      username: ['',Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateUser
      ])],
      email: ['',Validators.compose([
        Validators.required,
        this.validateEmail
      ])],
      password: ['',Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(35),
        this.validatePassword
      ])],
      confirmPassword: ['',Validators.required]
    },
    {
      validator: this.matchingPassword('password','confirmPassword')
    });
  }

  validateEmail(controls){
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(regExp.test(controls.value)){
      return null;
    }else{ 
      return { 'validateEmail': true }
    }
  }

  validateUser(controls){
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'validateUser': true }
    }
  }

  validatePassword(controls){
    const regExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,35})/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'validatePassword': true }
    }
  }

  matchingPassword(password, confirmPassword){
    return (group: FormGroup) => {
      if(group.controls[password].value === group.controls[confirmPassword].value){
        return null;
      }else{
        return {'matchingPassword': true}
      }
    }
  }

  disableForm(){
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirmPassword'].disable();
  }

  enableForm(){
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirmPassword'].enable();
  }


  onRegisterSubmit(){
    console.log('done');
    const user = {
      username: this.form.get('username').value,
      email: this.form.get('email').value,
      password: this.form.get('password').value
    }

    this.authService.registerUser(user).subscribe(data=>{
      console.log(data);
      this.processing = true;
      this.disableForm();
      if(!data.success){
        this.messageClass = 'alert alert-warning';
        this.message = data.message;
        this.processing = false;
        this.enableForm();
      }else{
        this.authService.storeUserData(data.token,data.user);
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(()=>{
          this.router.navigate(['/activate-user']);
        });
      }
    });
  }

  checkEmail(){
    this.authService.checkEmail(this.form.get('email').value).subscribe(data=>{
      console.log(data);
      if(!data.success){
        this.emailValid = false;
        this.emailMessage = data.message;
      }else{
        this.emailValid = true;
        this.emailMessage = data.message;
      }
    });
  }

  checkUsername(){
    this.authService.checkUsername(this.form.get('username').value).subscribe(data=>{
      console.log(data);
      if(!data.success){
        this.usernameValid = false;
        this.usernameMessage = data.message;
      }else{
        this.usernameValid = true;
        this.usernameMessage = data.message;
      }      
    });
  }

  ngOnInit() {
  }

}
