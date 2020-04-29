import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from '../constant/CommonConstant';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  registerMode = false;
  loginMode = false;
  registerSuccessMsg = '';
  token = '';
  loginRegisterClicked: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
      this.token =
        localStorage.getItem('token') === null
          ? ''
          : localStorage.getItem('token');
  }

  registerToggle() {
    this.registerMode = true;
    this.loginMode = false;
    this.loginRegisterClicked = true;
  }

  loginToggle() {
    // let url = 'login';
    this.loginMode = true;
    this.registerMode = false;
    this.loginRegisterClicked = true;
    // this.router.navigate([`../${url}`]);
  }

  cancelRegisterMode(registerMode: any) {
    this.registerMode = typeof registerMode === 'boolean' ? registerMode : false;
    this.registerSuccessMsg = typeof registerMode !== 'boolean' ? registerMode : '';
    this.loginRegisterClicked = false;
  }

  cancelLoginMode(loginMode: boolean) {
    this.loginMode = loginMode;
     this.loginRegisterClicked = false;
  }

  registerSuccessMode(registerSuccess: any) {
    this.registerSuccessMsg =
      typeof registerSuccess === 'boolean'
        ? registerSuccess
          ? CommonConstant.registerSuccessMsg
          : CommonConstant.registerFailMsg
        : registerSuccess;

     this.loginRegisterClicked = false;
    //   this.registerSuccessMsg = registerSuccess ? CommonConstant.registerSuccessMsg : CommonConstant.registerFailMsg;
  }

  styleObject(): Object{
      if (this.loginMode) {
        return {
          top: '0',
          bottom: '0',
        };
      }
        else if (this.registerMode) {
               return {
                 top: '0',
                 bottom: 'unset',
               };
             } else {
               return {
                 top: 'unset',
                 bottom: '0',
               };
             }
  }
}
