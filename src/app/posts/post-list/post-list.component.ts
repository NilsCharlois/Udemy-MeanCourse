import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model'
import { PostsService } from '../posts.service'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
  private postsUpdateSub : Subscription;

  constructor(public postsService: PostsService) { }

  posts: Post[] = [];

  ngOnInit(){
    this.postsService.getPosts();
    this.postsUpdateSub = this.postsService
    .getPostsUpdateListener()
      .subscribe((posts: Post[])=>{
        this.posts = posts;
      });
    ;
  }

  ngOnDestroy(){
    this.postsUpdateSub.unsubscribe();
  }
}
