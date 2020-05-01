import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAlertModalComponent } from 'src/app/shared/CustomModals/custom-alert-modal/custom.alert.component';
import { CommonConstant } from 'src/app/constant/CommonConstant';

@Component({
  selector: 'photo-editor-list',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMainPhotoChange = new EventEmitter<string>();
  defaultPhoto = environment.defaultPhoto;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;
  response: string;
  responseMessage = '';
  baseUrl = environment;
  uploadResponse: any;
  uploading = false;
  deleting = false;
  setMainRespnseMsg = '';
  res: any;
  deleteRespnseMsg = '';
  currentMain: Photo;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private modal: NgbModal
  ) {
    this.initializerUploaded();

    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;

    this.response = '';

    this.uploader.response.subscribe((res) => {
      this.uploading = false;
      this.deleting = false;
      this.uploadResponse = res !== '' ? JSON.parse(res) : '';
      this.responseMessage =
        this.uploadResponse !== '' ? this.uploadResponse.message : '';
    });
  }

  ngOnInit() {}

  initializerUploaded() {
    this.uploader = new FileUploader({
      url:
        this.baseUrl.apiUrl +
        'users/' +
        this.authService.getDecodeToken().nameid +
        '/photos',
      authToken: 'Bearer' + ' ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res = response !== '' ? JSON.parse(response) : '';
        const photo = {
          id: res.photoToReturn.id,
          url: res.photoToReturn.url,
          dateAdded: res.photoToReturn.dateAdded,
          description: res.photoToReturn.description,
          isMain: res.photoToReturn.isMain,
        };
        this.photos.push(photo);
        if (this.photos.length === 1) {
          photo.isMain = true;
          this.getMainPhotoChange.emit(photo.url);
          this.authService.changeMemberPhoto(photo.url);
          //  this.setIsMain(photo);
        }
        this.setTimer('responseMessage');
      }
    };
  }

  public setTimer(status: string) {
    setTimeout(() => {
      if (status === 'responseMessage') {
        this.responseMessage = '';
      }
      if (status === 'deleteRespnseMsg') {
        this.deleteRespnseMsg = '';
      }
    }, 5000);
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  uploadImage() {
    this.uploading = true;
    this.uploader.uploadAll();
  }

  clearQueue() {
    this.uploader.clearQueue();
  }

  cancelAll() {
    this.uploader.cancelAll();
  }

  setIsMain(photo: Photo) {
    this.userService
      .setMainPhoto(this.authService.getDecodeToken().nameid, photo.id)
      .subscribe((data) => {
        this.res = data;
        this.setMainRespnseMsg = this.res.message;
        this.currentMain = this.photos.filter((m) => m.isMain === true)[0];
        if (this.currentMain !== undefined) {
             this.currentMain.isMain = false;
        }
        photo.isMain = true;
        this.getMainPhotoChange.emit(photo.url);
      });
  }

  // deletePhoto(photo: Photo) {
  //   this.deleting = true;
  // }

  deletePhoto(photo: Photo) {
    this.responseMessage = '';
    if (photo.isMain) {
      this.deleteRespnseMsg = '';
      const modalRef = this.modal.open(CustomAlertModalComponent, {
        backdrop: 'static',
      });
      modalRef.componentInstance.data =
        CommonConstant.mainPhotoDeleteNotAllowed;
      modalRef.componentInstance.type = 'DeleteMainPhotoNOtAllowed';
      modalRef.componentInstance.title = 'Delete Photo Status';
      modalRef.componentInstance.buttonOK = 'OK';

      modalRef.result.then((response) => {});
    } else {
      const modalRef = this.modal.open(CustomAlertModalComponent, {
        backdrop: 'static',
      });
      modalRef.componentInstance.data = CommonConstant.deletePhotoMsg;
      modalRef.componentInstance.type = 'Delete Photo';
      modalRef.componentInstance.title = 'Delete Photo';
      modalRef.componentInstance.buttonOK = 'OK';
      modalRef.componentInstance.buttonCancle = 'Cancle';
      modalRef.result.then((response) => {
        if (response === 'ok') {
          this.deleting = true;
          this.userService
            .deletePhoto(this.authService.getDecodeToken().nameid, photo.id)
            .subscribe((data) => {
              this.res = data;
              this.deleteRespnseMsg = this.res.message;
              this.deleting = false;
              // if (this.res.status === 'Success') {
              const index = this.photos.indexOf(photo);
              this.photos.splice(index, 1);
              this.deleteRespnseMsg = '';
              //   this.setTimer('deleteRespnseMsg');
              this.deleteRespnseMsg = '';
              const modalRef = this.modal.open(CustomAlertModalComponent, {
                backdrop: 'static',
              });
              modalRef.componentInstance.data = this.res.message;
              modalRef.componentInstance.type = 'DeleteStatus';
              modalRef.componentInstance.title = 'Delete Photo Status';
              modalRef.componentInstance.buttonOK = 'OK';

              modalRef.result.then((response) => {});
            });
        }
      });
    }
  }
}