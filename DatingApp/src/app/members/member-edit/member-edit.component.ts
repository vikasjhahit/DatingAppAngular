import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from '../../_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../../_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { AuthService } from '../../_services/auth.service';
import { EditUser } from 'src/app/_models/editUser';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  user: User;
  photoUrl: string;
  editUser: EditUser = {} as any;
  res: any;
  updateReturnMsg = '';
  updatestatus: '';
  countryList: Array<any>;
  cities: Array<any>;

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
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data['user'].user;
    });
    this.authService.currentPhotoUrl.subscribe(
      (photoUrl) => (this.photoUrl = photoUrl)
    );

    this.GetCountryList();
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

    this.authService
      .getCountryList()
      .subscribe(
        (next) => {
         this.countryList = next;
        },
        (error) => {
          // this.alertify.error(error);
        }
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
      .subscribe(
        (next) => {
          this.res = next;
          this.updatestatus = this.res.Success;
          this.updateReturnMsg = this.res.message;
          this.editForm.reset(this.user);
        },
        (error) => {
          // this.alertify.error(error);
        }
      );
  }

  updateMainPhoto(photoUrl) {
    this.user.photoUrl = photoUrl;
  }
}
