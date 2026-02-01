import { Component, inject } from '@angular/core';
import { LoadDepartures } from '../load-departures/load-departures';
import { OperatorsService, RoutesService, StopsService } from '../../../core/services';
import { Stop, TransportOperator, RoutePopulated } from '../../../models';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-route-data',
  imports: [LoadDepartures, AsyncPipe, ReactiveFormsModule],
  templateUrl: './route-data.html',
  styleUrl: './route-data.css',
})
export class RouteData {
  private stopsService = inject(StopsService);
  private routesService = inject(RoutesService);
  private fb = inject(FormBuilder);
  private operatorsService = inject(OperatorsService);

  allStops$: Observable<Stop[]>;
  operators$: Observable<TransportOperator[]>;
  routeFilter: FormGroup;
  routes: RoutePopulated[] = [];
  stopId: string = '';

  constructor() {
    this.allStops$ = this.stopsService.getStops();
    this.operators$ = this.operatorsService.getOperators();

    this.routeFilter = this.fb.group({
      stop: '',
      transportOperator: '',
      date: '',
      time: ''
    })
  }

  onSubmit() {
    debugger
    const form = this.routeFilter.value;
    const stopId = form.stop;
    const transportOperatorId = form.transportOperator;
    const day = form.date;
    const time = form.time;

    this.routesService.searchRoutes(stopId, transportOperatorId, day, time).subscribe(routes => {
      this.routes = routes;
      this.stopId = stopId;
    });
  }
}
