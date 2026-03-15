import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StopsService } from '../../../core/services';
import { Observable } from 'rxjs';
import { Stop } from '../../../models';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-bus-subscription-information',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './bus-subscription-information.html',
  styleUrl: './bus-subscription-information.css',
})
export class BusSubscriptionInformation {
  private fb = inject(FormBuilder);
  private stopsService = inject(StopsService);

  cardSearch: FormGroup;
  allStops$: Observable<Stop[]>;

  constructor() {
    this.allStops$ = this.stopsService.getStops();
    this.cardSearch = this.fb.group({
      stop: ['', Validators.required]
    })
  }

    onSubmit(page: number = 1) {
    const { stop } = this.cardSearch.value;

    // this.tripsService.searchTrips(stop, transportOperator, date, time, page, this.pageSize).subscribe({
    //   next: (response) => {
    //     this.results = response.docs;
    //     this.paginationMeta = response.meta;
    //     this.stopId = stop;
    //     this.cdr.detectChanges();
    //   },
    //   error: (err) => console.error('Error searching routes:', err)
    // });
  }
}
