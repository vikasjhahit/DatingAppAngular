import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'src/app/constant/CommonConstant';
import { trigger, animate, state, transition, style } from '@angular/animations';
import { Pagination } from 'src/app/_models/pagination';
import { Message } from 'src/app/_models/message';
import { TabsetComponent } from 'ngx-bootstrap/tabs/tabset.component';
import { CustomAlertModalComponent } from 'src/app/shared/CustomModals/custom-alert-modal/custom.alert.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/_services/auth.service';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', [animate('0.5s ease-in-out')]),
    ]),
  ],
})
export class MemberDetailComponent implements OnInit {
  @Input() user: User;
  allImages: any = [];
  defaultPhotoUrl: string;
  counter = 0;
  countImages = 0;
  messages: Message[];
  pagination: Pagination;
  @ViewChild('memberTabs') memberTabs: TabsetComponent;
  res: any;
  message = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private modal: NgbModal
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data['user'].user;
    });

    // this.route.queryParams.subscribe((params) => {
    //   const selectedTabs = params['tab'];
    //   this.selectTabs(+selectedTabs);
    // });

    this.setDefaultPhoto();
    this.allImages = this.getImages();
  }

  selectTabs(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

  getImages() {
    const imageUrls = [];
    for (const photo of this.user.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo?.description,
      });
    }
    this.countImages = imageUrls.length;
    return imageUrls;
  }

  showNextImage() {
    if (this.counter < this.allImages.length - 1) {
      this.counter += 1;
    } else {
      this.counter = 0;
    }
  }

  showPreviousImage() {
    if (this.counter >= 1) {
      this.counter = this.counter - 1;
    } else {
      this.counter = this.allImages.length - 1;
    }
  }

  loadUser() {
    this.userService.getUser(+this.route.snapshot.params['id']).subscribe(
      (user: User) => {
        this.user = user;
      },
      (error) => {
        console.log('error in member detail');
      }
    );
  }

  setDefaultPhoto() {
    this.defaultPhotoUrl = CommonConstant.DefaultPhotoPath;
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

  ngAfterViewInit() {
    this.route.queryParams.subscribe((params) => {
      const selectedTabs = params['tab'];
      if (selectedTabs !== undefined) {
        this.selectTabs(+selectedTabs);
      }
    });
  }
}
