import { Post } from './post.model'
import { Subject } from 'rxjs'
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn:'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private HttpClient: HttpClient,
    private router: Router) {

  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?PageSize=${postsPerPage}&CurrentPage=${currentPage}`;
    this.HttpClient
    .get<{message:string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
    .pipe(map(postData=>{
      return {
        posts: postData.posts.map(post=>{
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          }),
          maxPosts: postData.maxPosts
        };
      })
    )
    .subscribe((transformedPostData)=>{
      this.posts = transformedPostData.posts;
      this.postsUpdated.next(
        {
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        }
      );
    });
  }

  getPostsUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File){
    const postData = new FormData(); // to mix blob and string KVPs
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title); // title will be overwritten in the backend
    return this.HttpClient
    .post<{message: string, post: Post}>(
      'http://localhost:3000/api/posts', postData
    );
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if(typeof(image) === 'object'){
      postData = new FormData();
      postData.append("id", id)
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      }
    }
    return this.HttpClient
    .put('http://localhost:3000/api/posts/'+id, postData);
  }

  getPost(id: string) {
    return this.HttpClient
    .get<{_id:string, title:string, content:string, imagePath: string}>("http://localhost:3000/api/posts/"+id)
  }

  deletePost(id: string){
    return this.HttpClient
    .delete("http://localhost:3000/api/posts/"+id);
  }
}
