import { Component, inject, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { RoutesTable } from '../routes-table/routes-table';
import { OperatorsService, RoutesService, StopsService, TripsService } from '../../../core/services';
import { Stop, TransportOperator } from '../../../models';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

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
  private tripsService = inject(TripsService);
  private fb = inject(FormBuilder);
  private operatorsService = inject(OperatorsService);
  private cdr = inject(ChangeDetectorRef);

  @Input() stationPosition: 'south' | 'west' = 'south';
  @Input() routeType: 'departures' | 'arrivals' = 'departures';
  onHomePage: boolean = false;

  allStops$: Observable<Stop[]>;
  operators$: Observable<TransportOperator[]>;
  
  routeFilter: FormGroup;
  results: any[] = [];
  stopId: string = '';

  constructor(location: Location) {
    this.allStops$ = this.stopsService.getStops();
    this.operators$ = this.operatorsService.getOperators();

    this.routeFilter = this.fb.group({
      stop: [''],
      transportOperator: [''],
      date: [''],
      time: ['']
    });

    this.onHomePage = location.isCurrentPathEqualTo('/home') || location.isCurrentPathEqualTo('/');
  }

  

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stationPosition'] || changes['routeType']) {
      this.loadTrips();
      this.routeFilter.patchValue({ stop: '', transportOperator: '', date: '', time: '' }, { emitEvent: false });
    }
  }

  loadTrips() {
    const action = this.routeType === 'departures' 
      ? this.tripsService.getDepartures(this.stationPosition, 5) 
      : this.tripsService.getArrivals(this.stationPosition, 5)
    action.subscribe({
      next: (routes) => {
        this.results = [...routes];
        this.stopId = '';
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading routes:', err)
    });
  }

  onSubmit() {
    const { stop, transportOperator, date, time } = this.routeFilter.value;
    console.log(this.routeFilter.value);
    

    this.tripsService.searchTrips(stop, transportOperator, date, time).subscribe({
      next: (trips) => {
        this.results = [...trips];
        this.stopId = stop;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error searching routes:', err)
    });
  }
}