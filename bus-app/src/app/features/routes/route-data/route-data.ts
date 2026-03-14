import { Component, inject, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { RoutesTable } from '../routes-table/routes-table';
import { OperatorsService, RoutesService, StopsService, TripsService } from '../../../core/services';
import { Stop, TransportOperator } from '../../../models';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-route-data',
  standalone: true,
  imports: [RoutesTable, AsyncPipe, ReactiveFormsModule, RouterLink],
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
  paginationMeta: any = null;
  currentPage: number = 1;
  pageSize: number = 5;
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

  loadTrips(page: number = 1) {
    this.currentPage = page;
    this.pageSize = this.onHomePage ? 5 : 10;

    const action = this.routeType === 'departures'
      ? this.tripsService.getDepartures(this.stationPosition, page, this.pageSize)
      : this.tripsService.getArrivals(this.stationPosition, page, this.pageSize);

    action.subscribe({
      next: (response) => {
        console.log(response);

        this.results = response.docs;
        this.paginationMeta = response.meta;
        this.stopId = '';
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading routes:', err)
    });
  }

  onSubmit(page: number = 1) {
    this.currentPage = page;
    const { stop, transportOperator, date, time } = this.routeFilter.value;

    this.tripsService.searchTrips(stop, transportOperator, date, time, page, this.pageSize).subscribe({
      next: (response) => {
        this.results = response.docs;
        this.paginationMeta = response.meta;
        this.stopId = stop;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error searching routes:', err)
    });
  }

  onPageChange(newPage: number) {
    const hasFilters = Object.values(this.routeFilter.value).some(val => val !== '' && val !== null);

    if (hasFilters && !this.onHomePage) {
      this.onSubmit(newPage);
    } else {
      this.loadTrips(newPage);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}