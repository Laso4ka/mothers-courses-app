import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Course } from './course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private mockCourses: Course[] = [
    {
      id: '1',
      title: 'Усвідомлене материнство: зниження стресу',
      tagline: 'Знайдіть спокій у хаосі материнства.',
      description: 'Вивчіть техніки усвідомленості для управління стресом, покращення терпіння та повнішого насолодження батьківським шляхом. Підходить для всіх матерів.',
      instructor: 'Др. Яна Спокійна',
      price: 49.99,
      imageUrl: 'https://placehold.co/600x400/a0d2eb/003366?text=Mindful+Motherhood',
      duration: '4 тижні',
      category: 'Благополуччя',
      rating: 4.8,
      studentCount: 1200
    },
    {
      id: '2',
      title: 'Післяпологова фізична підготовка та харчування',
      tagline: 'Відновіть силу та енергію після пологів.',
      description: 'Керована програма для безпечного та ефективного післяпологового відновлення, що зосереджується на силі корпусу, м\'яких вправах та поживних планах харчування.',
      instructor: 'Сара Сильна',
      price: 79.00,
      imageUrl: 'https://placehold.co/600x400/ffaa00/ffffff?text=Postpartum+Fitness',
      duration: '8 тижнів',
      category: 'Фітнес',
    },
    {
      id: '3',
      title: 'Виховання малюків з впевненістю',
      tagline: 'Пройдіть роки малюків з радістю та вмінням.',
      description: 'Зрозумійте розвиток малюків, ефективно керуйте істериками та побудуйте міцні, позитивні стосунки з вашою дитиною.',
      instructor: 'Тарас Батьківський',
      price: 59.50,
      imageUrl: 'https://placehold.co/600x400/a0d2eb/003366?text=Toddler+Parenting',
      duration: '6 тижнів',
      category: 'Виховання',
    },
    {
      id: '4',
      title: 'Мама-підприємець: основи бізнесу',
      tagline: 'Перетворіть свою пристрасть на гнучкий дохід.',
      description: 'Вивчіть основи започаткування та ведення малого бізнесу з дому, адаптовані для зайнятих мам.',
      instructor: 'Аліса Бізнесова',
      price: 99.00,
      imageUrl: 'https://placehold.co/600x400/ffaa00/ffffff?text=Mompreneur',
      duration: 'Самостійне навчання',
      category: 'Кар\'єра',
    }
  ];

  constructor() { }

  getAllCourses(): Observable<Course[]> {
    // In a real app, this would be an HTTP call:
    // return this.http.get<Course[]>('/api/courses');
    return of(this.mockCourses);
  }

  getFeaturedCourses(count: number = 2): Observable<Course[]> {
    // Simple featured logic for now
    return of(this.mockCourses.slice(0, count));
  }

  getCourseById(id: string): Observable<Course | undefined> {
    return of(this.mockCourses.find(course => course.id === id));
  }
}
