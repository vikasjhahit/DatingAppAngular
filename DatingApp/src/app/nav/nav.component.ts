import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;
  userName: any;
  isUserloggedIn: boolean = false;
  private ngUnsubscribe = new Subject();

  constructor(private authService: AuthService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
    this.userName = (localStorage.getItem('user') !== null ) ? JSON.parse(localStorage.getItem('user')).username : '';

    this.authService.checkLogin$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
        this.isUserloggedIn = data;
        if ( this.userName !== ''){
          this.isUserloggedIn = true;
        }
      });
  }

  // login() {
  //   this.authService.login(this.model).subscribe(next => {
  //     this.userName = JSON.parse(localStorage.getItem('user')) !== null ? JSON.parse(localStorage.getItem('user')).username : '';
  //     this.alertify.success('Logged in successfully');
  //   }, error => {
  //     this.alertify.error(error);
  //   }, () => {
  //     alert('success');
  //     this.router.navigate(['/members']);
  //   });
  // }

  // loggedIn() {
  //   const token = localStorage.getItem('token');
  //   return !!token;
  // }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    localStorage.clear();
    this.isUserloggedIn = false;
    this.userName = '';
  //  this.alertify.message('logged out');
    this.router.navigate(['/home']);
  }

  userLoggedInMode(isUserloggedIn: boolean) {
    this.isUserloggedIn = isUserloggedIn;
  }

  RedirectEdit(){
      // if (this.router.url === '/members') {
      //       this.router.navigate['/edit'];
      // }
      // else{
      //   this.router.navigate['/member/edit'];
      // }
      this.router.navigate['/member/edit'];
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
