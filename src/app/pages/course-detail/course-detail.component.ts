import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {Observable, of, tap} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {CourseService} from '../../services/course.service';
import {ReplaceLineBreaksPipe} from '../../shared/pipes/replace-line-breaks.pipe';
import {Course} from '../../models/course.model';
import {SiteSettingsService} from '../../services/site-settings.service';
import {PaymentModalComponent} from '../../components/payment-modal/payment-modal.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReplaceLineBreaksPipe, PaymentModalComponent],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements AfterViewInit, OnDestroy {
  course$: Observable<Course | undefined>;
  isBrowser: boolean;
  telegramLink$: Observable<string | undefined>;
  currentCourse: Course | undefined | null;
  actualTelegramLink = ""
  showPaymentModal = false;
  @ViewChild('priceActionBar') priceActionBarRef!: ElementRef<HTMLDivElement>; // Додаємо Ref на панель

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private siteSettingsService: SiteSettingsService,
  ) {
    this.telegramLink$ = this.siteSettingsService.globalTelegramLink$ || "";
    this.telegramLink$.subscribe(el => this.actualTelegramLink = el || "");
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.course$ = this.route.paramMap.pipe(
      switchMap(params => {
        const slug = params.get('courseSlug');
        if (slug) {
          return this.courseService.getCourseBySlug(slug);
        }
        if (this.isBrowser) {
          this.router.navigate(['/courses']);
        }
        return of(undefined);
      }),
      tap(courseData => {
        if (!courseData && this.isBrowser) {
          console.warn('Course not found by slug from observable, consider redirecting...');
        }
        this.currentCourse = courseData;
      })
    );
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.adjustBodyPadding();
      window.addEventListener('resize', this.adjustBodyPadding);
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.renderer.setStyle(document.body, 'paddingBottom', '0px');
      window.removeEventListener('resize', this.adjustBodyPadding);
    }
  }

  private adjustBodyPadding = (): void => {
    if (this.priceActionBarRef && this.priceActionBarRef.nativeElement) {
      const priceBarHeight = this.priceActionBarRef.nativeElement.offsetHeight;
      if (window.innerWidth < 992) {
        this.renderer.setStyle(document.body, 'paddingBottom', `${priceBarHeight}px`);
      } else {
        this.renderer.setStyle(document.body, 'paddingBottom', '0px');
      }
    }
  }

  openPaymentModal(): void {
    console.log(this.currentCourse)
    if (this.currentCourse) {
      this.showPaymentModal = true;
    } else {
      alert('Інформація про курс не завантажена.');
    }
  }

  handleCloseModal(): void {
    this.showPaymentModal = false;
  }

  handlePaymentSuccess(paymentData: any): void {
    console.log('Платіж успішний на сторінці деталей курсу!', paymentData);
    this.showPaymentModal = false; // Закриваємо модалку після успішної оплати
    alert(`Дякуємо за покупку курсу "${this.currentCourse?.title}"! Доступ буде надано незабаром.`);
  }
}
