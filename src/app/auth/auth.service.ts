import { AuthData } from './auth-data.model'

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({providedIn:'root'})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>(); // to push status change

  constructor(private HttpClient: HttpClient) {}

  getToken() {return this.token;}

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string){
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.HttpClient
    .post
    (
      'http://localhost:3000/api/user/signup', authData
    )
    .subscribe(response=>{
      console.log(response);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.HttpClient.post<{token: string}>(
      'http://localhost:3000/api/user/login', authData
    ).subscribe(response=>{
      this.token = response.token;
      this.authStatusListener.next(true);
    });
  }

}
