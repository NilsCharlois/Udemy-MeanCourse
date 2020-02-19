import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms'

import { Post } from '../post.model'
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls:
  ['./post-create.component.css']
})

export class PostComponentComponent {
  constructor(public postsService: PostsService) { }

  onAddPost(form: NgForm){
    if(form.invalid){
      return;
    }
    this.postsService.addPosts(form.value.title, form.value.content);
  }
}
