import { AuthData } from './auth-data.model'

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn:'root'})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: NodeJS.Timer;
  private authStatusListener = new Subject<boolean>(); // to push status change

  constructor(private HttpClient: HttpClient,
    private router: Router) {}

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

  getIsAuthenticated( ) {
    return this.isAuthenticated;
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.HttpClient.post<{token: string, expiresIn: number}>(
      'http://localhost:3000/api/user/login', authData
    ).subscribe(response=>{
      if(response.token){
        // token expire timeout
        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, response.expiresIn * 1000);
        this.token = response.token;
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      }
    });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
  }

}
