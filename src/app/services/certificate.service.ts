import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData, query, orderBy } from '@angular/fire/firestore';
import { Certificate } from '../models/certificate.model'; // Імпорти для Firestore

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private certificatesCollectionPath = 'certificates'; // Назва вашої колекції в Firestore

  constructor(private firestore: Firestore) { }

  getCertificates(): Observable<Certificate[]> {
    const certificatesCollection = collection(this.firestore, this.certificatesCollectionPath);

    return collectionData(query(certificatesCollection), { idField: 'id' }) as Observable<Certificate[]>;
  }
}
