import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {

  message;
  messageClass;
  blog;
  processing = false;
  currentUrl;
  loading = true;

  constructor(
    private location: Location,
// import this to get the current url and parse the parameter from it
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    private router: Router
  ) { }

  ngOnInit() {
  // for getting params from url
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data=>{
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        data.message = 'Blog not found';
        this.message = 'Blog not found';
      }else{
        this.blog = data.blog; 
        this.loading = false;
      }
    });
  }

  updateBlogSubmit(){
    this.processing = true;
    // function to update the blog
    this.blogService.editBlog(this.blog).subscribe(data => {
      console.log(data);
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      }else{
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.processing = true;
        setTimeout(()=>{
          this.router.navigate(['/blog']);
        },1000);
      }
    });    
  }

  goBack(){
    this.location.back();
  }
}
