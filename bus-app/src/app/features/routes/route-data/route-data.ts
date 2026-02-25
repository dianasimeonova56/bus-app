import { Component, inject, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { RoutesTable } from '../routes-table/routes-table';
import { OperatorsService, RoutesService, StopsService } from '../../../core/services';
import { Stop, TransportOperator } from '../../../models';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-route-data',
  standalone: true,
  imports: [RoutesTable, AsyncPipe, ReactiveFormsModule],
  templateUrl: './route-data.html',
  styleUrl: './route-data.css',
})
export class RouteData implements OnChanges {
  private stopsService = inject(StopsService);
  private routesService = inject(RoutesService);
  private fb = inject(FormBuilder);
  private operatorsService = inject(OperatorsService);
  private cdr = inject(ChangeDetectorRef); // Добавено за форсиране на рендер

  @Input() stationPosition: 'south' | 'west' = 'south';
  @Input() routeType: 'departures' | 'arrivals' = 'departures';

  allStops$: Observable<Stop[]>;
  operators$: Observable<TransportOperator[]>;
  
  routeFilter: FormGroup;
  results: any[] = [];
  stopId: string = '';

  constructor() {
    this.allStops$ = this.stopsService.getStops();
    this.operators$ = this.operatorsService.getOperators();

    this.routeFilter = this.fb.group({
      stop: [''],
      transportOperator: [''],
      date: [''],
      time: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stationPosition'] || changes['routeType']) {
      this.loadRoutes();
      // Изчистваме филтъра при смяна на таба
      this.routeFilter.patchValue({ stop: '', transportOperator: '', date: '', time: '' }, { emitEvent: false });
    }
  }

  loadRoutes() {
    const action = this.routeType === 'departures' 
      ? this.routesService.getDepartures(this.stationPosition) 
      : this.routesService.getArrivals(this.stationPosition);

    action.subscribe({
      next: (routes) => {
        this.results = [...routes];
        this.stopId = '';
        this.cdr.detectChanges(); // СЪБУЖДАНЕ НА ИЗГЛЕДА
      },
      error: (err) => console.error('Error loading routes:', err)
    });
  }

  onSubmit() {
    const { stop, transportOperator, date, time } = this.routeFilter.value;

    this.routesService.searchRoutes(stop, transportOperator, date, time).subscribe({
      next: (trips) => {
        this.results = [...trips];
        this.stopId = stop;
        this.cdr.detectChanges(); // СЪБУЖДАНЕ НА ИЗГЛЕДА
      },
      error: (err) => console.error('Error searching routes:', err)
    });
  }
}