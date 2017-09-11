import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthService } from './auth.service';

@Injectable()
export class BlogService {

  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

  createAuthenticationHeader(){
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-type': 'application/json',
        'authorization': this.authService.authToken
      })
    });
  }

  newBlog(blog){
    this.createAuthenticationHeader();
    return this.http.post(this.domain+'blogs/newBlog', blog, this.options).map(res=>res.json());
  }

  getAllBlogs(){
    this.createAuthenticationHeader();
    return this.http.get(this.domain+'blogs/allBlogs',this.options).map(res=>res.json());
  }

  getSingleBlog(id){
    this.createAuthenticationHeader();
    return this.http.get(this.domain+'blogs/singleBlog/'+id, this.options).map(res => res.json()); 
  }

  editBlog(blog){
    this.createAuthenticationHeader();
    return this.http.put(this.domain+'blogs/updateBlog/', blog, this.options).map(res => res.json());
  }

  deleteBlog(id){
    this.createAuthenticationHeader();
    return this.http.delete(this.domain+'blogs/deleteBlog/'+id,this.options).map(res=>res.json());
  }

  likeBlog(id){
    const blogData = { id: id};
    return this.http.put(this.domain+'blogs/likeBlog/', blogData, this.options).map(res=>res.json());
  }

  dislikeBlog(id){
    const blogData = { id: id};
    return this.http.put(this.domain+'blogs/dislikeBlog/', blogData, this.options).map(res=>res.json());
  }

}