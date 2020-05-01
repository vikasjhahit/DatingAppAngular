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
  res: any;

  public checkLogin = new BehaviorSubject<boolean>(false);
  checkLogin$ = this.checkLogin.asObservable();

  constructor(private http: HttpClient) {}

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response) => {
        this.res = response;
        if (this.res.status !== 'Failure' && this.res.token !== '') {
          this.user = this.res.user;
          localStorage.setItem('token', this.res.token);
          localStorage.setItem('user', JSON.stringify(this.res.user));
          this.decodedToken = this.jwtHelper.decodeToken(this.res.token);
          this.currentUser = this.res.user;
          this.photoUrl.next(this.currentUser.photoUrl);
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
        return this.res;
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

  getDecodeToken(): any {
    return (this.decodedToken = this.jwtHelper.decodeToken(
      localStorage.getItem('token')
    ));
  }

  getCountryList(): any {
    return this.http.get<any>(this.baseUrl + 'getcountrylist');
  }
}
