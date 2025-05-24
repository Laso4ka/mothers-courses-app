import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // CommonModule для *ngFor
import { RouterLink } from '@angular/router'; // Якщо є посилання
import { CourseCardComponent } from '../../components/course-card/course-card.component'; // Якщо використовується
import { Course } from '../../services/course.model'; // Якщо використовується
import { CourseService } from '../../services/course.service'; // Якщо використовується
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o'; // Імпортуємо модуль та опції

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CourseCardComponent,
    CarouselModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Template reference variable для контейнера Swiper
  @ViewChild('certificatesSwiperContainer') certificatesSwiperContainer!: ElementRef;

  featuredCourses: Course[] = []; // Залиште, якщо потрібно

  // Дані для слайдів (замініть на ваші реальні дані)
  certificates: { imageUrl: string, caption: string }[] = [
    { imageUrl: 'https://placehold.co/600x400/003366/FFFFFF?text=Сертифікат+1+New', caption: 'Сертифікат "Ранній розвиток"' },
    { imageUrl: 'https://placehold.co/600x400/a0d2eb/000000?text=Сертифікат+2+New', caption: 'Диплом "Дитяча психологія"' },
    { imageUrl: 'https://placehold.co/600x400/ffaa00/FFFFFF?text=Сертифікат+3+New', caption: 'Посвідчення "Консультант ГВ"' },
    { imageUrl: 'https://placehold.co/600x400/003366/FFFFFF?text=Сертифікат+4+New', caption: 'Курс "Позитивне батьківство"' },
    { imageUrl: 'https://placehold.co/600x400/cccccc/000000?text=Сертифікат+5+New', caption: 'Інший важливий сертифікат' },
  ];

  certificateOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true, // Показувати крапки пагінації
    navSpeed: 700,
    margin: 20, // ВІДСТУП МІЖ ЕЛЕМЕНТАМИ
    responsive: {
      0: { // Для екранів від 0px
        items: 1 // Один елемент
      },
      768: { // Для екранів від 768px
        items: 2 // Два елементи
      },
      1024: { // Для екранів від 1024px
        items: 3 // Три елементи
      }
    },
  };

  constructor(
    private courseService: CourseService, // Залиште, якщо потрібно
  ) {
  }

  ngOnInit(): void {
    // Завантаження інших даних, якщо потрібно
    this.courseService.getFeaturedCourses(2).subscribe(courses => {
      this.featuredCourses = courses;
    });
  }
}
