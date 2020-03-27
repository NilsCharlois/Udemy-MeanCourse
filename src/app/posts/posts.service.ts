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
          id: post._id,
          imagePath: post.imagePath
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

  addPost(title: string, content: string, image: File){
    const postData = new FormData(); // to mix blob and string KVPs
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title); // title will be overwritten in the backend
    this.HttpClient
    .post<{message: string, post: Post}>(
      'http://localhost:3000/api/posts', postData
    )
    .subscribe(responseData=>{
      // updated created post with id returned from POST call
      const post: Post = {
        id: responseData.post.id,
        title: title,
        content: content,
        imagePath: responseData.post.imagePath
      }
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
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
    this.HttpClient
    .put('http://localhost:3000/api/posts/'+id, postData)
    .subscribe(response=>{
      const updatedPosts = [...this.posts];
      // find post by id
      const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      const post: Post = {
        id: id,
        title: title,
        content: content,
        imagePath: ""
      }
      // override the local post
      updatedPosts[oldPostIndex] = post;
      // update the post array
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPost(id: string) {
    return this.HttpClient
    .get<{_id:string, title:string, content:string, imagePath: string}>("http://localhost:3000/api/posts/"+id)
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
