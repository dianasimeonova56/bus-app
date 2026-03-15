import { Component, inject } from '@angular/core';
import { StopsService } from '../../../core/services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Stop } from '../../../models';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-add-subscription',
  imports: [AsyncPipe],
  templateUrl: './buy-subscription.html',
  styleUrl: './buy-subscription.css',
})
export class BuySubscription {
  private stopsService = inject(StopsService);
  private fb = inject(FormBuilder);

  buySubscription: FormGroup;
  stops$: Observable<Stop[]>;

  constructor() {
    this.stops$ = this.stopsService.getBurgasBusStops();
    this.buySubscription = this.fb.group({

    })
  }

}
