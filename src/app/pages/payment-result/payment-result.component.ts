import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {catchError, combineLatest, EMPTY, filter, of, Subscription, take, tap} from 'rxjs';
import { OrderService, Order } from '../../services/order.service'; // Імпортуємо OrderService та Order
import { SiteSettingsService } from '../../services/site-settings.service';
import {switchMap} from 'rxjs/operators'; // Для отримання посилання на Telegram бота

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.scss']
})
export class PaymentResultComponent implements OnInit, OnDestroy {
  paymentStatus: 'success' | 'failure' | 'pending' | 'sandbox' | 'error' | 'unknown' = 'unknown';
  orderIdFromLiqpay: string | null = null;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  orderDetails: Order | null = null;

  telegramBotLink: string | undefined;
  showTelegramFallback: boolean = false;
  isBrowser: boolean;

  private mainProcessingSub: Subscription | undefined;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private siteSettingsService: SiteSettingsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      this.isLoading = false;
      this.paymentStatus = 'unknown';
      return;
    }

    this.mainProcessingSub = this.route.queryParams.pipe(
      take(1), // Беремо параметри один раз
      tap(params => {
        this.isLoading = true;
        this.orderIdFromLiqpay = params['liqpay_order_id'];
        console.log('Query Params processed:', params);
      }),
      // Фільтруємо, щоб продовжувати тільки якщо є orderIdFromLiqpay
      filter(params => !!params['liqpay_order_id']),
      switchMap(params => {
        const orderId = params['liqpay_order_id'];
        // Об'єднуємо Observable для замовлення та посилання на бота
        return combineLatest([
          this.orderService.getOrderByLiqPayOrderId(orderId).pipe(
            catchError(err => {
              console.error('Error fetching order:', err);
              this.errorMessage = 'Помилка завантаження деталей замовлення.';
              this.paymentStatus = 'error';
              return of(null); // Повертаємо null у випадку помилки, щоб combineLatest продовжив
            })
          ),
          this.siteSettingsService.telegramBotLink$.pipe(take(1)) // Беремо перше значення і відписуємося
        ]);
      }),
      tap(([order, botLink]) => { // Деструктуризуємо результат combineLatest
        this.telegramBotLink = botLink; // Встановлюємо посилання на бота
        console.log('Received from combineLatest - Order:', order, 'BotLink:', botLink);

        if (order) {
          this.orderDetails = order;
          this.paymentStatus = order.paymentStatus as typeof this.paymentStatus;
          console.log('Order Status:', this.paymentStatus);

          if ((this.paymentStatus === 'success' || this.paymentStatus === 'sandbox') && this.telegramBotLink) {
            console.log('Attempting to open Telegram bot...');
            this.tryOpenTelegramBot();
          } else if (this.paymentStatus === 'success' || this.paymentStatus === 'sandbox') {
            console.log('Telegram bot link is not available, showing fallback trigger.');
            this.showTelegramFallback = true; // Показати кнопку, якщо посилання на бота немає, але оплата успішна
          }
        } else if (!this.errorMessage) { // Якщо order is null, але не було помилки в catchError
          console.warn(`Order with liqpayOrderId ${this.orderIdFromLiqpay} not found.`);
          this.paymentStatus = 'unknown';
          this.errorMessage = 'Замовлення не знайдено. Будь ласка, зв\'яжіться з підтримкою.';
        }
        this.isLoading = false;
      }),
      catchError(err => { // Загальний обробник помилок для всього ланцюжка
        console.error('Error in main processing pipe:', err);
        this.paymentStatus = 'error';
        this.errorMessage = 'Загальна помилка обробки результату.';
        this.isLoading = false;
        return EMPTY; // або of(null)
      })
    ).subscribe();

    // Обробка випадку, якщо liqpay_order_id взагалі немає в queryParams
    this.route.queryParams.pipe(take(1)).subscribe(params => {
      if (!params['liqpay_order_id']) {
        console.warn('No liqpay_order_id found in query params.');
        this.paymentStatus = 'unknown';
        this.isLoading = false;
      }
    });
  }



  tryOpenTelegramBot(): void {
    console.log(this.telegramBotLink)
    if (!this.isBrowser || !this.telegramBotLink) return;

    let finalTelegramLink = this.telegramBotLink;

    const newWindow = window.open(finalTelegramLink, '_blank');

    setTimeout(() => {
      if (newWindow === null || newWindow.closed || typeof newWindow.closed === 'undefined') {
        this.showTelegramFallback = true;
      }
    }, 2000);
  }


  navigateToCourses(): void {
    this.router.navigate(['/courses']);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if (this.mainProcessingSub) {
      this.mainProcessingSub.unsubscribe();
    }
  }
}
