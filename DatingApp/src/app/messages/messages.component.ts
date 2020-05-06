import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { TitleService } from '../_services/title.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAlertModalComponent } from '../shared/CustomModals/custom-alert-modal/custom.alert.component';
import { CommonConstant } from '../constant/CommonConstant';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';
  messageJson: any;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private titleService: TitleService,
    private modal: NgbModal
  ) {}

  ngOnInit() {
    //  this.titleService.setTitle('chats');
    this.route.data.subscribe((data) => {
      this.messages = data['messages'].result.message;
      this.pagination = data['messages'].pagination;
    });
  }

  loadMessages(msgtype: string) {
    this.messageContainer = msgtype;
    this.userService
      .getMessages(
        this.authService.decodedToken.nameid,
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.messageContainer
      )
      .subscribe(
        (res: PaginatedResult<Message[]>) => {
          this.messageJson = res.result;
          this.messages = this.messageJson.message;
          this.pagination = res.pagination;
        },
        (error) => {
          //   this.alertify.error(error);
        }
      );
  }

  deleteMessage(id: number) {
    const modalRef = this.modal.open(CustomAlertModalComponent, {
      backdrop: 'static',
    });
    modalRef.componentInstance.data = CommonConstant.deleteMessage;
    modalRef.componentInstance.type = 'DeleteMessage';
    modalRef.componentInstance.title = 'Delete Message';
    modalRef.componentInstance.buttonOK = 'OK';
    modalRef.componentInstance.buttonCancle = 'CANCLE';
    modalRef.result.then((response) => {
      if (response === 'ok'){
        let message = '';
        this.userService
              .deleteMessage(id, this.authService.decodedToken.nameid)
              .subscribe((res: any) => {
                message = res.message;
                if (res.success === 'Success'){
                    this.messages.splice( this.messages.findIndex((m) => m.id === id), 1 );
                }
                const modalRef = this.modal.open(
                    CustomAlertModalComponent,
                    {
                      backdrop: 'static',
                    }
                  );
                modalRef.componentInstance.data = message;
                modalRef.componentInstance.type = 'DeleteMessageStatus';
                modalRef.componentInstance.title = 'Delete Message Status';
                modalRef.componentInstance.buttonOK = 'OK';
                modalRef.result.then((response) => {});
              });
      }
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages('');
  }
}
