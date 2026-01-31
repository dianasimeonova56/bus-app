import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { RoutesService } from '../../../core/services';
import { Observable, of } from 'rxjs';
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

  @Input() routes: RoutePopulated[] | null = null;
  departures$: Observable<RoutePopulated[]>;

  constructor() {
    this.departures$ = this.routesService.getRoutes();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['routes'] && this.routes && this.routes.length > 0) {
      this.departures$ = of(this.routes);
    }
  }
}
