import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // CommonModule для *ngFor
import { RouterLink } from '@angular/router'; // Якщо є посилання
import { CourseCardComponent } from '../../components/course-card/course-card.component'; // Якщо використовується
import { Course } from '../../models/course.model'; // Якщо використовується
import { CourseService } from '../../services/course.service'; // Якщо використовується
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Observable } from 'rxjs';
import {Certificate} from '../../models/certificate.model';
import {CertificateService} from '../../services/certificate.service';
import {HomePageService} from '../../services/home-page.service';
import {HomePageContent} from '../../models/home-page-content.model';
import {ReplaceLineBreaksPipe} from '../../shared/pipes/replace-line-breaks.pipe'; // Імпортуємо модуль та опції

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CourseCardComponent,
    CarouselModule,
    ReplaceLineBreaksPipe
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{
  homePageContent$: Observable<HomePageContent | undefined>;
  isBrowser: boolean;
  certificateOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    margin: 20,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      1024: {
        items: 3
      }
    },
  };
  featuredCourses$: Observable<Course[]>;
  certificates$: Observable<Certificate[]>;

  constructor(
    private courseService: CourseService,
    private certificateService: CertificateService,
    private homePageService: HomePageService, // Інжектуємо новий сервіс
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.homePageContent$ = this.homePageService.getHomePageContent();
    this.certificates$ = this.certificateService.getCertificates();
    this.featuredCourses$ = this.courseService.getFeaturedCourses(3); // Завантажуємо, наприклад, 3 рекомендованих

    this.homePageContent$.subscribe(obj => {console.log(obj)});
  }

  navigateTo(url: string): void {
    if (this.isBrowser) {
      window.open(url, '_blank');
    }
  }
}
