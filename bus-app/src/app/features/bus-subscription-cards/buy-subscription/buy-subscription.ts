import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { AuthService, StopsService, SubscriptionService } from '../../../core/services';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Stop, SubscriptionCard, User } from '../../../models';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-add-subscription',
  standalone: true, // Увери се, че е standalone
  imports: [AsyncPipe, ReactiveFormsModule, CommonModule],
  templateUrl: './buy-subscription.html',
  styleUrl: './buy-subscription.css',
})
export class BuySubscription implements OnInit {
  private stopsService = inject(StopsService);
  private subscriptionService = inject(SubscriptionService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  buySubscription: FormGroup;
  stops$ = this.stopsService.getBurgasBusStops();
  chosenSubscription = signal<SubscriptionCard | null>(null);
  currentUser = this.authService.currentUser;
  formValues = signal<any>(null);

  constructor() {
    this.buySubscription = this.fb.group({
      destination: ['', Validators.required],
      userType: ['regular', Validators.required],
      period: ['30', Validators.required]
    });

    this.buySubscription.valueChanges.pipe(
      startWith(this.buySubscription.value)
    ).subscribe(val => this.formValues.set(val));
  }


  ngOnInit() {
    const cardId = this.route.snapshot.paramMap.get('id');
    if (cardId) {
      this.subscriptionService.getSubscription(cardId).subscribe(card => {
        debugger
        console.log(card.subscription);
        
        this.buySubscription.patchValue({ destination: card.subscription.stop._id });
        this.chosenSubscription.set(card.subscription)

        const status = this.currentUser()?.isVerifiedAs;
        if (status && status !== 'regular') {
          this.buySubscription.patchValue({ userType: status });
        }
      });
    }
  }

  displayPrice = computed(() => {
    const plan = this.chosenSubscription();
    const vals = this.formValues();
    if (!plan || !vals) return '0.00';

    const priceMap: any = {
      regular: plan.regularPrice,
      student: plan.studentDiscountPrice,
      senior: plan.seniorDiscountPrice,
      disability: plan.disabilitesDiscountPrice
    };

    const rates: any = { '30': 1.0, '15': 0.5, '10': 0.65 };
    const base = priceMap[vals.userType] || 0;
    const multiplier = rates[vals.period] || 1;

    return (base * multiplier).toFixed(2);
  });

  onSubmit() {
    if (this.buySubscription.valid && this.chosenSubscription()) {
      const data = {
        planId: this.chosenSubscription()?._id,
        selectedType: this.buySubscription.value.userType,
        periodDays: this.buySubscription.value.period,
        userId: this.currentUser()?._id
      };

      this.subscriptionService.createUserSubscription(data).subscribe(res => {
        if (res.checkoutUrl) {
          window.location.href = res.checkoutUrl;
        }
      });
    }
  }
}