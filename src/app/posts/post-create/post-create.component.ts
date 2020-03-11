import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { ActivatedRoute, ParamMap, Router } from '@angular/router'

import { PostsService } from '../posts.service';
import { Post } from '../post.model';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls:
  ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading = false;

  constructor(public postsService: PostsService,
    public route: ActivatedRoute,
    public router: Router) { }

  onAddPost(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create'){
      this.postsService.addPost(form.value.title, form.value.content);
    }
    else
    {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }
    form.resetForm();
    // go back to posts page
    this.router.navigate(["/"]);
  }

  ngOnInit(){
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // display spinner
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData=>{
          // hide spinner as we got the result from the service
          this.isLoading = false;
          this.post = {id: postData._id, title:postData.title, content:postData.content};
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
}
