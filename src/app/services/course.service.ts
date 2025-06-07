import { Injectable } from '@angular/core';
import {map, Observable, take} from 'rxjs';
import { Firestore, collection, collectionData, doc, docData, query, where, limit, orderBy } from '@angular/fire/firestore';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private coursesCollectionPath = 'courses';

  constructor(private firestore: Firestore) { }

  getAllCourses(): Observable<Course[]> {
    const coursesCollection = collection(this.firestore, this.coursesCollectionPath);
    return collectionData(coursesCollection, { idField: 'id' }) as Observable<Course[]>;
  }

  getFeaturedCourses(count: number = 2): Observable<Course[]> {
    const coursesCollection = collection(this.firestore, this.coursesCollectionPath);
    const q = query(
      coursesCollection,
      where('isFeatured', '==', true),
      limit(count)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Course[]>;
  }

  getCourseById(id: string): Observable<Course | undefined> {
    const courseDocRef = doc(this.firestore, `${this.coursesCollectionPath}/${id}`);
    return docData(courseDocRef, { idField: 'id' }) as Observable<Course | undefined>;
  }

  getCourseBySlug(slug: string): Observable<Course | undefined> {
    const coursesCollection = collection(this.firestore, this.coursesCollectionPath);
    const q = query(
      coursesCollection,
      where('slug', '==', slug), // Шукаємо точне співпадіння slug
      limit(1) // Очікуємо лише один результат, оскільки slug має бути унікальним
    );

    return collectionData(q, {idField: 'id'}).pipe(
      map(coursesArray => {
        return coursesArray.length > 0 ? coursesArray[0] as Course : undefined;
      }),
      take(1)
    );
  }
}
