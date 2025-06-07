import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Renderer2
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {Observable, of, tap} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CourseService } from '../../services/course.service';
import { ReplaceLineBreaksPipe } from '../../shared/pipes/replace-line-breaks.pipe';
import {Course} from '../../models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReplaceLineBreaksPipe],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements AfterViewInit, OnDestroy {
  course$: Observable<Course | undefined>;
  isBrowser: boolean;
  @ViewChild('priceActionBar') priceActionBarRef!: ElementRef<HTMLDivElement>; // Додаємо Ref на панель

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2
  ) {
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

  buyCourse(courseId: string | undefined) {
    this.course$.subscribe(course => { // Потрібно буде відписатися, або зробити це одноразово
      if (course && courseId) {
        console.log('Купити курс:', courseId, course.title);
        alert(`Ви обрали курс "${course.title}". Функція купівлі в розробці!`);
      }
    }).unsubscribe();
  }

}
