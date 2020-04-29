import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../_models/user';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { CommonConstant } from 'src/app/constant/CommonConstant';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  defaultPhotoUrl: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.setDefaultPhoto();
  }

  sendLike(id: number) {
    this.userService
      .sendLike(this.authService.decodedToken.nameid, id)
      .subscribe(
        (data) => {
          this.alertify.success('You have liked: ' + this.user.knownAs);
        },
        (error) => {
          //   this.alertify.error(error);
        }
      );
  }

  setDefaultPhoto() {
    this.defaultPhotoUrl = CommonConstant.DefaultPhotoPath;
  }
}
