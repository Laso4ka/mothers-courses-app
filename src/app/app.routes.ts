import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import {PaymentResultComponent} from './pages/payment-result/payment-result.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'courses', component: CoursesComponent },
  { path: 'course/:courseSlug', component: CourseDetailComponent },
  { path: 'payment-result', component: PaymentResultComponent },
  // Example for a course detail page (add component later)
  // { path: 'course/:id', loadComponent: () => import('./pages/course-detail/course-detail.component').then(m => m.CourseDetailComponent) },
  { path: '**', redirectTo: '' } // Redirect unknown paths to home
];
