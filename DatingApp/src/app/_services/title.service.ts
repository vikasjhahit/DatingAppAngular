import { Injectable, ChangeDetectorRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private title = new BehaviorSubject<string>('');
  private title$ = this.title.asObservable();

  constructor() {
  }

  setTitle(title: string) {
    this.title.next(title);
  }

  getTitle(): Observable<string> {
    return this.title$;
  }
}
