import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For *ngFor, *ngIf
import { Course } from '../../services/course.model';
import { CourseService } from '../../services/course.service';
import { CourseCardComponent } from '../../components/course-card/course-card.component'; // Import the standalone component

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
  allCourses: Course[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe(courses => {
      this.allCourses = courses;
    });
  }
}
