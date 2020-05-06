import { Component, OnInit, Input, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-custom-model',
  templateUrl: './custom.alert.component.html',
  styleUrls: ['./custom.alert.component.css'],
})
export class CustomAlertModalComponent implements OnInit {
  constructor(private modal: NgbActiveModal) {}
  @Input() data;
  @Input() type;
  @Input() title;
  @Input() buttonOK;
  @Input() buttonCancle;

  ngOnInit() {}

  close(status: string) {
    this.modal.close(status);
  }
}
