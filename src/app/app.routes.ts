import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CoursesComponent } from './pages/courses/courses.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'courses', component: CoursesComponent },
  // Example for a course detail page (add component later)
  // { path: 'course/:id', loadComponent: () => import('./pages/course-detail/course-detail.component').then(m => m.CourseDetailComponent) },
  { path: '**', redirectTo: '' } // Redirect unknown paths to home
];
