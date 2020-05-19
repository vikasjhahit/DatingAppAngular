import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../_models/user';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { CommonConstant } from 'src/app/constant/CommonConstant';
import { CustomAlertModalComponent } from 'src/app/shared/CustomModals/custom-alert-modal/custom.alert.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  defaultPhotoUrl: string;
  res: any;
  message = '';
  users: User[];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService,
    private modal: NgbModal,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.setDefaultPhoto();
    this.route.data.subscribe((data) => {
      this.users = data['users'].result;
    });
  }

  sendLike(id: number) {
    this.userService
      .sendLike(this.authService.getDecodeToken().nameid, id)
      .subscribe(
        (data) => {
          this.res = data;
          if (this.res.status === 'Failure') {
            this.message = 'Liked Failure';
          }
          if (this.res.message === 'You already liked this user.') {
            this.message = 'You already liked ' + ' ' + this.user.knownAs;
          } else {
            this.message = 'You have liked ' + ' ' + this.user.knownAs;
          }
          const modalRef = this.modal.open(CustomAlertModalComponent, {
            backdrop: 'static',
          });

          modalRef.componentInstance.data = this.message;
          modalRef.componentInstance.type = 'Like';
          modalRef.componentInstance.title = 'Like Status';
          modalRef.componentInstance.buttonOK = 'OK';

          modalRef.result.then((response) => {});
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
