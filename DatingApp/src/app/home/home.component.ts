import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from '../constant/CommonConstant';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { TitleService } from '../_services/title.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', [animate('0.5s ease-in-out')]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  registerMode = false;
  loginMode = false;
  registerSuccessMsg = '';
  token = '';
  loginRegisterClicked: boolean = false;
  imagesForSlide: Array<any>;
  counter = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private titleService: TitleService
  ) {}

  ngOnInit() {
    if (this.router.url === '/') {
      this.titleService.setTitle('');
    }
   // this.titleService.setTitle('Welcome To Dating Application');
    this.token =
      localStorage.getItem('token') === null
        ? ''
        : localStorage.getItem('token');

    this.setSlideImagesList();
    setInterval(() => {
      //  this.showNextImage();
    }, 7000);
  }

  setSlideImagesList() {
    this.imagesForSlide = [
      { src: '../../assets/datinghomeimg1.jpg' },
      { src: '../../assets/datinghomeimg2.jpg' },
      { src: '../../assets/datinghomeimg3.jpg' },
      { src: '../../assets/datinghomeimg4.jpg' },
    ];
  }

  showNextImage() {
    if (this.counter < this.imagesForSlide.length - 1) {
      this.counter += 1;
    } else {
      this.counter = 0;
    }
  }

  showPreviousImage() {
    if (this.counter >= 1) {
      this.counter = this.counter - 1;
    } else {
      this.counter = this.imagesForSlide.length - 1;
    }
  }

  registerToggle() {
    this.registerMode = true;
    this.loginMode = false;
    this.loginRegisterClicked = true;
  }

  loginToggle() {
    //  let url = 'home/login';
    this.loginMode = true;
    this.registerMode = false;
    this.loginRegisterClicked = true;
    // this.router.navigate([`../${url}`]);
    this.router.navigate(['/home/login']);
  }

  cancelRegisterMode(registerMode: any) {
    this.registerMode =
      typeof registerMode === 'boolean' ? registerMode : false;
    this.registerSuccessMsg =
      typeof registerMode !== 'boolean' ? registerMode : '';
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

  styleObject(): Object {
    if (this.loginMode) {
      return {
        top: '0',
        bottom: '0',
      };
    } else if (this.registerMode) {
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
