import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'src/app/constant/CommonConstant';
import { trigger, animate, state, transition, style } from '@angular/animations';


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

  constructor(
    private userService: UserService,
    private route: ActivatedRoute //  public gallery: Gallery
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data['user'].user;
    });

    this.setDefaultPhoto();
    this.allImages = this.getImages();
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
}
