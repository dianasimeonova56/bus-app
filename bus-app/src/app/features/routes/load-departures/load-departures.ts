import { Component, inject } from '@angular/core';
import { RoutesService } from '../../../core/services';
import { Observable } from 'rxjs';
import { RoutePopulated } from '../../../models';
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'app-load-departures',
  imports: [AsyncPipe],
  templateUrl: './load-departures.html',
  styleUrl: './load-departures.css',
})
export class LoadDepartures {
  private routesService = inject(RoutesService);
  departures$: Observable<RoutePopulated[]>;

  constructor() {
    this.departures$ = this.routesService.getRoutes();
  }
}
