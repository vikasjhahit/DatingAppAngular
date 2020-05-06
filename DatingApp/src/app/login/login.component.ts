import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { User } from '../_models/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonConstant } from '../constant/CommonConstant';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @Output() cancelLogin = new EventEmitter();
  model: any = {};
  userName: any;
  @Output() userloggedIn = new EventEmitter();
  token: string;
  decodedToken: any;
  currentUser: User;
  private ngUnsubscribe = new Subject();
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();
  jwtHelper = new JwtHelperService();
  invalidNamePasswordMsg = '';
  response: any;

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  ngOnInit() {
    this.token =
      localStorage.getItem('token') !== null
        ? localStorage.getItem('token')
        : '';
  }
  login() {
    this.authService.login(this.model).subscribe((res) => {
      if (res) {
        this.response = res;
        if (this.response.status !== 'Failure' && this.response.token !== '') {
          this.userName =
            JSON.parse(localStorage.getItem('user')) !== null
              ? JSON.parse(localStorage.getItem('user')).username
              : '';
          this.authService.checkLogin.next(true);
          this.router.navigate(['/lists']);
        } else {
          this.invalidNamePasswordMsg = this.response.message; // CommonConstant.InvalidNamePassMsg;
        }
      } else {
        this.invalidNamePasswordMsg = this.response.message; // CommonConstant.InvalidNamePassMsg;
      }
    });
  }

  // loggedIn() {
  //  this.userloggedIn.emit(true);
  // }

  cancel() {
    this.cancelLogin.emit(false);
  }

  forgotPassword() {}

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
