import { Component, EventEmitter, Input, Output, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from '../../models/course.model';
import { PaymentService } from '../../services/payment.service';
import {Order, OrderService} from '../../services/order.service';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss']
})
export class PaymentModalComponent implements OnInit {
  @Input() courseToBuy: Course | undefined | null;
  @Input() isVisible: boolean = false;
  @Output() closeModalEvent = new EventEmitter<void>();

  paymentForm: FormGroup;
  isProcessingPayment: boolean = false;

  @ViewChild('liqpayForm') liqpayFormRef!: ElementRef<HTMLFormElement>;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private renderer: Renderer2
  ) {
    this.paymentForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?3?8?(0\d{9})$/)]]
    });
  }

  ngOnInit(): void {}

  get email() { return this.paymentForm.get('email'); }
  get phoneNumber() { return this.paymentForm.get('phoneNumber'); }

  closeModal(): void {
    if (this.isProcessingPayment) return;

    this.isVisible = false;
    this.paymentForm.reset();
    this.closeModalEvent.emit();
  }

  proceedToPayment(): void {
    if (this.paymentForm.invalid || !this.courseToBuy) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.isProcessingPayment = true;

    this.paymentService.createLiqpayData({
      id: this.courseToBuy.id!,
      title: this.courseToBuy.title,
      price: this.courseToBuy.price
    }).subscribe({
      next: response => {
        this.createPendingOrderAndRedirect(response.data, response.signature, response.generated_order_id);
      },
      error: error => {
        this.isProcessingPayment = false;
        console.error('Помилка при отриманні даних LiqPay:', error);
        alert('Не вдалося підготувати дані для оплати. Спробуйте пізніше.');
      }
    });
  }

  private async createPendingOrderAndRedirect(data: string, signature: string, generatedOrderId:string): Promise<void> {
    if (this.courseToBuy && this.courseToBuy.id && this.paymentForm.valid) {
      const orderDetails:Omit<Order, 'id' | 'paymentTimestamp'> = {
        email: this.paymentForm.value.email,
        phoneNumber: this.paymentForm.value.phoneNumber,
        courseId: this.courseToBuy.id,
        courseTitle: this.courseToBuy.title,
        pricePaid: this.courseToBuy.price,
        paymentStatus: 'pending_redirect',
        liqpayOrderId: generatedOrderId
      };

      try {
       await this.orderService.createOrder(orderDetails);
       this.redirectToLiqpay(data, signature);
      } catch (err) {
        console.error('Помилка створення попереднього замовлення або перенаправлення:', err);
        alert('Виникла помилка. Спробуйте ще раз.');
        this.isProcessingPayment = false;
      }
    } else {
      this.isProcessingPayment = false;
    }
  }

  private redirectToLiqpay(data: string, signature: string): void {
    const form = this.liqpayFormRef.nativeElement;
    form.action = 'https://www.liqpay.ua/api/3/checkout';

    while (form.firstChild) {
      form.removeChild(form.firstChild);
    }

    const dataInput = this.renderer.createElement('input');
    this.renderer.setAttribute(dataInput, 'type', 'hidden');
    this.renderer.setAttribute(dataInput, 'name', 'data');
    this.renderer.setAttribute(dataInput, 'value', data);
    this.renderer.appendChild(form, dataInput);

    const signatureInput = this.renderer.createElement('input');
    this.renderer.setAttribute(signatureInput, 'type', 'hidden');
    this.renderer.setAttribute(signatureInput, 'name', 'signature');
    this.renderer.setAttribute(signatureInput, 'value', signature);
    this.renderer.appendChild(form, signatureInput);

    form.submit();
  }
}
