import { Post } from './post.model'
import { Subject } from 'rxjs'
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn:'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private HttpClient: HttpClient) {

  }

  getPosts() {
    this.HttpClient
    .get<{message:string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData)=>{
      return postData.posts.map(post=>{
        return {
          title: post.title,
          content: post.content,
          id: post._id
        }
      })
    }))
    .subscribe((transformedPosts)=>{
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostsUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string){
    const post : Post = {id: null, title: title, content: content};
    this.HttpClient
    .post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
    .subscribe((responseData)=>{
      // updated created post with id returned from POST call
      const postId = responseData.postId;
      post.id = postId;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }

  deletePost(id: string){
    this.HttpClient
    .delete("http://localhost:3000/api/posts/"+id)
    .subscribe(()=>{
      this.posts = this.posts.filter(post=>post.id !== id);
      this.postsUpdated.next([...this.posts]);
    })
  }
}
