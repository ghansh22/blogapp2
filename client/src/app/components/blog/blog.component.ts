import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  newPost = false;
  loadingBlogs = false;
  form;
  username;
  blogPosts;

  constructor(
    private authService: AuthService,
    private blogService: BlogService,
    private router: Router,
    private flashMessagesService: FlashMessagesService,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
   }

  createForm(){
    this.form = this.formBuilder.group({
      title: ['',Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
        this.alphaNumericValidation
      ])],
      body: ['',Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(500)
      ])]
    });
  }

  onBack(){
    this.newPost = false;
  }

  onNewBlogSubmit(){
    this.disableNewBlogForm();
    const blog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: this.username
    }
    this.blogService.newBlog(blog).subscribe(data => {
      console.log('Data: '+data);
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.enableNewBlogForm();
      }else{
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(()=>{
          this.getAllBLogs();
          this.newPost = false;
          this.message = false;
          this.form.reset();
          this.enableNewBlogForm();
        },1000);
      }
    });
  }

  // Enable new blog form
  enableNewBlogForm() {
    this.form.get('title').enable(); // Enable title field
    this.form.get('body').enable(); // Enable body field
  }

  // Disable new blog form
  disableNewBlogForm() {
    this.form.get('title').disable(); // Disable title field
    this.form.get('body').disable(); // Disable body field
  }

  // Validation for title
  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { 'alphaNumericValidation': true } // Return error in validation
    }
  }

  newBlogForm(){
    this.newPost = true;
  }

  reloadBlogs(){
    this.loadingBlogs = true;
    // get all blogs
    this.getAllBLogs();
    setTimeout(()=>{
      this.loadingBlogs = false;
    },5000)
  }

  ngOnInit() {
    this.authService.sandBox();
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
    });
    this.getAllBLogs();
  }

  getAllBLogs(){
    this.blogService.getAllBlogs().subscribe(data=>{
      this.blogPosts = data.blogs;
      // console.log(this.blogPosts);
    })
  }

  likeBlog(id){
    this.blogService.likeBlog(id).subscribe(data=>{
      console.log(data);
      this.getAllBLogs();
    });
  }

  dislikeBlog(id){
    this.blogService.dislikeBlog(id).subscribe(data=>{
      console.log(data);
      this.getAllBLogs();
    })
  }
}
