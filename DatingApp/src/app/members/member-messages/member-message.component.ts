import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Message } from 'src/app/_models/message';
import { tap } from 'rxjs/operators';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-member-message',
  templateUrl: './member-message.component.html',
  styleUrls: ['./member-message.component.css'],
})

export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  res: any;
  newMessage: any = {};

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private modal: NgbModal
  ) {}

  ngOnInit() {
    this.loadMessage();
  }

  loadMessage() {
   // this.recipientId = 4;
   const currentUserId = +this.authService.getDecodeToken().nameid;
   this.userService
      .getMessageThread(
        this.authService.getDecodeToken().nameid,
        this.recipientId
      )
      .pipe(
        tap((message: any) => {
          for(let i = 0; i< message.messages.length ; i++){
            if (
              message.messages[i].isRead === false &&
              message.messages[i].recipientId === currentUserId
            ) {
              this.userService.markAsRead(
                currentUserId,
                message.messages[i].id
              );
            }
          }
        })
      )
      .subscribe((data) => {
        this.res = data;
        this.messages = this.res.messages;
        this.updateScroll();
      });
  }

  updateScroll(){
    const element = document.getElementById('cardmessage');
    element.scrollTop = element.scrollHeight;
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.getDecodeToken().nameid, this.newMessage).subscribe((message: any) => {
     // this.messages.unshift(message.message);
     this.messages.push(message.message);
     this.newMessage = '';
    });

  }
}
