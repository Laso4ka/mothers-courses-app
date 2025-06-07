import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // For *ngIf
import { Course } from '../../models/course.model';
import {RouterLink} from '@angular/router';
// Removed RouterLink as "View Details" button is not yet functional with routing in this basic card
// If you add routing: import { RouterLink } from '@angular/router'; and add to imports array

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterLink,  RouterLink],// Add RouterLink if you use it in the template
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent {
  @Input() course!: Course;
  protected readonly print = print;
  protected readonly console = console;
}
