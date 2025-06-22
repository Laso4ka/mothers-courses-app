import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';

export interface Order {
  id?: string; // Буде додано Firestore
  telegramUsername: string;
  phoneNumber: string;
  courseId: string;
  courseTitle: string;
  pricePaid: number;
  paymentStatus: string; // 'success', 'failure', 'sandbox', etc.
  liqpayOrderId: string;
  paymentTimestamp: Date | any; // Використовуємо any для serverTimestamp
  userId?: string; // Опціонально, якщо є аутентифікація користувачів
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
        paymentTimestamp: serverTimestamp() // Додаємо мітку часу сервера
      };
      const ordersCollection = collection(this.firestore, this.ordersCollectionPath);
      const docRef = await addDoc(ordersCollection, orderPayload);
      return docRef.id;
    } catch (e) {
      console.error("Error creating order: ", e);
      throw e;
    }
  }
}
