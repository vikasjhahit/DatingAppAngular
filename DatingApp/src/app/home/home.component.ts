import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from '../constant/CommonConstant';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  registerMode = false;
  loginMode = false;
  registerSuccessMsg = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  registerToggle() {
    this.registerMode = true;
    this.loginMode = false;
  }

  loginToggle() {
    this.loginMode = true;
    this.registerMode = false;
  }

  cancelRegisterMode(registerMode: boolean) {
    this.registerMode = registerMode;
  }

  cancelLoginMode(loginMode: boolean) {
    this.loginMode = loginMode;
  }

  registerSuccessMode(registerSuccess: boolean) {
    this.registerSuccessMsg = registerSuccess
      ? CommonConstant.registerSuccessMsg
      : CommonConstant.registerFailMsg;
  }
}
