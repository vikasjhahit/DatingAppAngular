import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import { map } from 'rxjs/operators';
 import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();
  user: any;

  public checkLogin = new BehaviorSubject<boolean>(false);
  checkLogin$ = this.checkLogin.asObservable();

  constructor(private http: HttpClient) {}

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response) => {
        localStorage.setItem('token', this.user.token);
        localStorage.setItem('user', JSON.stringify(this.user.user));
        this.decodedToken = this.jwtHelper.decodeToken(this.user.token);
        this.currentUser = this.user.user;
        this.changeMemberPhoto(this.currentUser.photoUrl);
        return response;
      })
    );
  }

  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  getDecodeToken(): any{
   return (this.decodedToken = this.jwtHelper.decodeToken(
     localStorage.getItem('token')
   ));
  }
}
