import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StopsService, SubscriptionService } from '../../../core/services';
import { Observable } from 'rxjs';
import { Stop, SubscriptionCard } from '../../../models';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-bus-subscription-information',
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink],
  templateUrl: './bus-subscription-information.html',
  styleUrl: './bus-subscription-information.css',
})
export class BusSubscriptionInformation {
  private fb = inject(FormBuilder);
  private stopsService = inject(StopsService);
  private subsService = inject(SubscriptionService);

  cardSearch: FormGroup;
  allStops$: Observable<Stop[]>;
  subscriptionCards: SubscriptionCard[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    this.allStops$ = this.stopsService.getStops();
    this.cardSearch = this.fb.group({
      stop: ['', Validators.required]
    })
  }

  onSubmit() {
    const { stop } = this.cardSearch.value;

    this.subsService.searchSubscriptions(stop).subscribe({
      next: (response) => {
        this.subscriptionCards = response.subscriptions;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error searching routes:', err)
    });
  }
}
