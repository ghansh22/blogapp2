import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-activate-user',
  templateUrl: './activate-user.component.html',
  styleUrls: ['./activate-user.component.css']
})
export class ActivateUserComponent implements OnInit {

  form: FormGroup;
  activationCode;
  message;
  messageClass;
  processing = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private flashMessagesService: FlashMessagesService
  ) {
    this.createForm();
   }

  ngOnInit() { }


  createForm(){
    this.form = this.formBuilder.group({
      activationCode: ['',Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])]
    });
  }

  
  onactivateUserSubmit(){
    this.processing = true;
    const activationCode = {
      activationCode: this.form.get('activationCode').value,
    }
    this.authService.activateUserFunction(activationCode).subscribe(data=>{
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      }else{
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.flashMessagesService.show('Your email is verified!', { cssClass: 'alert-info' });
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
