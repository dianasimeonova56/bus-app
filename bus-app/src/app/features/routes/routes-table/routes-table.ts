import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { RoutesService } from '../../../core/services';
import { Observable, of } from 'rxjs';
import { RoutePopulated } from '../../../models';
import { AsyncPipe } from '@angular/common'
import { HighlightStopDirective } from '../../../shared/directive';

@Component({
  selector: 'app-routes-table',
  imports: [AsyncPipe, HighlightStopDirective],
  templateUrl: './routes-table.html',
  styleUrl: './routes-table.css',
})
export class RoutesTable {
  private routesService = inject(RoutesService);

  @Input() routes: RoutePopulated[] | null = null;
  @Input() searchedStopId: string | null = null;

  departures$: Observable<RoutePopulated[]>;

  constructor() {
    this.departures$ = this.routesService.getRoutes();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['routes'] && this.routes && this.routes.length > 0) {
      this.departures$ = of(this.routes);
    }
  }

  isSearchedStop(stopId: string): boolean {
    return this.searchedStopId === stopId;
  }

  expandedRouteId: String | undefined;

  toggle(routeId: String | undefined) {
    this.expandedRouteId =
      this.expandedRouteId === routeId ? undefined : routeId;
  }
}
