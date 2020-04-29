import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'src/app/constant/CommonConstant';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  @Input() user: User;
  allImages: any = [];
  defaultPhotoUrl: string;

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
    return imageUrls;
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
