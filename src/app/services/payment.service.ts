import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private functionUrl = environment.paymentFunctionUrl; // URL Cloud Function

  constructor(private http: HttpClient) {}

  createLiqpayData(course: { id: string; title: string; price: number }) {
    return this.http.post<{ data: string; signature: string,  generated_order_id: string}>(
      this.functionUrl,
      { course }
    );
  }
}
