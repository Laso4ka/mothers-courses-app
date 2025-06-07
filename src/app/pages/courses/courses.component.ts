import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { CourseCardComponent } from '../../components/course-card/course-card.component';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    CourseCardComponent // Import the child component
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  allCourses$: Observable<Course[]>;

  constructor(private courseService: CourseService) { // Використовуємо оновлений CourseService
    this.allCourses$ = this.courseService.getAllCourses();
  }

  ngOnInit(): void {}
}
