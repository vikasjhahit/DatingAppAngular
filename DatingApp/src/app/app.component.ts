import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TitleService } from './_services/title.service';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  appTitle = '';
  photoUrl: string;

  constructor(
    private titleService: TitleService,
    private cdRef: ChangeDetectorRef,
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  // ngOnInit() {
  //   this.titleService.getTitle().subscribe((title) => {
  //     this.title = title;
  //   });
  // }

  ngOnInit() {
    this.appTitle = this.title.getTitle();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child.firstChild) {
            child = child.firstChild;
          }
          if (child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          }
          return this.appTitle;
        })
      )
      .subscribe((ttl: string) => {
        this.appTitle = ttl;
        this.title.setTitle(ttl);
      });
  }

  hideHeaderText(data) {
    this.title = data;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
}
