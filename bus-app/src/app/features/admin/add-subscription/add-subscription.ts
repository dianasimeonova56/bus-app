import { Component, inject } from '@angular/core';
import { StopsService, SubscriptionService } from '../../../core/services';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Stop } from '../../../models';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-add-subscription',
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './add-subscription.html',
  styleUrl: './add-subscription.css',
})
export class AddSubscription {
  private stopsService = inject(StopsService);
  private subscriptionService = inject(SubscriptionService);
  private fb = inject(FormBuilder);

  addSubscription: FormGroup;
  stops$: Observable<Stop[]>;

  constructor() {
    this.stops$ = this.stopsService.getBurgasBusStops();
    this.addSubscription = this.fb.group({
      stop: '',
      regularPrice: '',
      studentDiscountPrice: '',
      seniorDiscountPrice: '',
      disabilitesDiscountPrice: ''
    })
  }

  onSubmit(): void {
    this.subscriptionService.createSubscription(this.addSubscription.value)
      .subscribe({
        next: (created) => {
          console.log('Created subscription:', created);
          this.addSubscription.reset();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}
