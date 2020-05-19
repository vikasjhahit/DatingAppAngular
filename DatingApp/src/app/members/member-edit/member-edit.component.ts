import { Component, OnInit, ViewChild, HostListener, Output, Input } from '@angular/core';
import { User } from '../../_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../../_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { AuthService } from '../../_services/auth.service';
import { EditUser } from 'src/app/_models/editUser';
import { EventEmitter } from 'protractor';
import { CustomAlertModalComponent } from 'src/app/shared/CustomModals/custom-alert-modal/custom.alert.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { CommonConstant } from 'src/app/constant/CommonConstant';
import { TitleService } from 'src/app/_services/title.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  user: User;
  photoUrl: string;
  defaultPhoto = environment.defaultPhoto;
  editUser: EditUser = {} as any;
  res: any;
  updateReturnMsg = '';
  updatestatus: '';
  countryList: Array<any>;
  cities: Array<any>;
  @Input() removeMainPhoto: any;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService,
    private authService: AuthService,
    private modal: NgbModal,
    private titleService: TitleService,
    private title: Title
  ) {}

  ngOnInit() {
  //  this.titleService.setTitle('My Profile');
    this.title.getTitle();
    this.route.data.subscribe((data) => {
      this.user = data['user'].user;
    });
    this.authService.currentPhotoUrl.subscribe(
      (photoUrl) => (this.photoUrl = photoUrl)
    );

    this.GetCountryList();
  }

  public setTimer(status: string) {
    setTimeout(() => {
      if (status === 'updateReturnMsg') {
        this.updateReturnMsg = '';
      }
    }, 5000);
  }

  GetCountryList() {
    // this.countryList = [
    //   { name: 'India', cities: ['Mumbai'] },
    //   {
    //     name: 'Germany',
    //     cities: ['Duesseldorf', 'Leinfelden-Echterdingen', 'Eschborn'],
    //   },
    //   { name: 'Spain', cities: ['Barcelona'] },
    //   { name: 'USA', cities: ['Downers Grove'] },
    //   { name: 'Mexico', cities: ['Puebla'] },
    //   { name: 'China', cities: ['Beijing'] },
    // ];

    this.authService.getCountryList().subscribe(
      (next) => {
        this.countryList = next;
      },
      (error) => {}
    );
  }

  changeCountry(selectedCountryName) {
    this.cities = this.countryList.find(
      (con) => con.name === selectedCountryName
    ).cities;
  }

  updateUser() {
    this.editUser.City = this.user.city;
    this.editUser.Country = this.user.country;
    this.editUser.Interests = this.user.interests;
    this.editUser.Introduction = this.user.introduction;
    this.editUser.LookingFor = this.user.lookingFor;

    this.userService
      .updateUser(this.authService.decodedToken.nameid, this.editUser)
      .subscribe((next) => {
        this.res = next;
        this.updateReturnMsg = this.res.message;
        this.editForm.reset(this.user);
        // this.updatestatus = this.res.Success;
        // this.setTimer('updateReturnMsg');

        this.openModel(
          'updateuserinfo',
          this.updateReturnMsg,
          'UpdateUserInfo',
          'Update User Info Status',
          'OK',
          ''
        );
      });
  }

  removeProfilePhoto() {
    this.res = this.openModel(
      'removeprofilephoto',
      CommonConstant.removeProfilePhotoMsg,
      'UpdateUserInfo',
      'Update User Info Status',
      'OK',
      'Cancle'
    );
  }

  openModel(from, data, type, title, button1text, button2txt?) {
    const modalRef = this.modal.open(CustomAlertModalComponent, {
      backdrop: 'static',
    });
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.type = 'UpdateUserInfo';
    modalRef.componentInstance.title = 'Update User Info Status';
    modalRef.componentInstance.buttonOK = 'OK';
    if (button2txt !== '') {
      modalRef.componentInstance.buttonCancle = button2txt;
    }

    modalRef.result.then((response) => {
      if (response === 'ok') {
        if (from === 'removeprofilephoto') {
          this.updateMainPhoto(this.defaultPhoto);
          this.userService
            .setMainPhoto(this.authService.getDecodeToken().nameid, 0)
            .subscribe((data) => {
              // this.res = data;
              this.user.photos.filter((photo) => {
                photo.isMain = false;
              });
            });
        }
      }
    });
  }

  updateMainPhoto(photoUrl) {
    this.user.photoUrl = photoUrl;
    this.authService.changeMemberPhoto(photoUrl);
  }
}
