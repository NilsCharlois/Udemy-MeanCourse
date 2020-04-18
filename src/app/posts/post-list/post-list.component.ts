import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model'
import { PostsService } from '../posts.service'
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
  private postsUpdateSub : Subscription;
  private statusSub: Subscription;

  posts: Post[] = [];
  isLoading = false; // for the spinner
  totalPosts = 0; // for the paginator module
  postsPerPage = 5; // for the paginator module
  pageSizeOptions = [1, 2, 5, 10, 25, 50]; // for the paginator module
  currentPage = 1;

  public userIsAuthenticated: Boolean;

  constructor(public postsService: PostsService,
    private authService: AuthService) { }

  ngOnInit(){
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, 1);
    this.isLoading = true;
    this.postsUpdateSub = this.postsService
    .getPostsUpdateListener()
      .subscribe(
        (postData: {posts: Post[], postCount: number})=>
        {
          this.posts = postData.posts;
          this.totalPosts = postData.postCount;
          this.isLoading = false;
        }
      )
    ;
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.statusSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated=>{
      this.userIsAuthenticated = isAuthenticated;
    });
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
    this.statusSub.unsubscribe();
  }

  ngOnDestroy(){
    this.postsUpdateSub.unsubscribe();
  }
}
