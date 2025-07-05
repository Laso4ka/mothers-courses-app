import { Injectable } from '@angular/core';
import {Firestore, collection, addDoc, serverTimestamp, query, where, limit, collectionData} from '@angular/fire/firestore';
import {map, Observable} from 'rxjs';

export interface Order {
  id?: string;
  email: string;
  phoneNumber: string;
  courseId: string;
  courseTitle: string;
  pricePaid: number;
  paymentStatus: string;
  liqpayOrderId: string;
  paymentTimestamp: Date | any;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersCollectionPath = 'orders';

  constructor(private firestore: Firestore) { }

  async createOrder(orderData: Omit<Order, 'id' | 'paymentTimestamp'>): Promise<string> {
    try {
      const orderPayload = {
        ...orderData,
        paymentTimestamp: serverTimestamp()
      };
      const ordersCollection = collection(this.firestore, this.ordersCollectionPath);
      const docRef = await addDoc(ordersCollection, orderPayload);
      return docRef.id;
    } catch (e) {
      console.error("Error creating order: ", e);
      throw e;
    }
  }

  getOrderByLiqPayOrderId(liqpayOrderId: string | null): Observable<Order | null> {
    const ordersCollection = collection(this.firestore, this.ordersCollectionPath);
    const q = query(ordersCollection, where('liqpayOrderId', '==', liqpayOrderId), limit(1));

    return collectionData(q, {idField: 'id'}).pipe(
      map(orders => orders.length > 0 ? orders[0] as Order : null)
    );
  }
}
