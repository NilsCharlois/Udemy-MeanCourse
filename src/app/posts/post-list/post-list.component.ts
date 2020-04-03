import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model'
import { PostsService } from '../posts.service'
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
  private postsUpdateSub : Subscription;
  posts: Post[] = [];
  isLoading = false; // for the spinner
  totalPosts = 0; // for the paginator module
  postsPerPage = 5; // for the paginator module
  pageSizeOptions = [1, 2, 5, 10, 25, 50]; // for the paginator module
  currentPage = 1;

  constructor(public postsService: PostsService) { }

  ngOnInit(){
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, 1);
    this.isLoading = true;
    this.postsUpdateSub = this.postsService
    .getPostsUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number})=>{
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
        this.isLoading = false;
      });
    ;
  }

  onPageChanged(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1; // +1 because starts at 0
    this.postsPerPage = pageData.pageSize;
    console.log('current page ' + this.currentPage + ' ' + this.postsPerPage);
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(id: string){
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe(()=>{
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy(){
    this.postsUpdateSub.unsubscribe();
  }
}
