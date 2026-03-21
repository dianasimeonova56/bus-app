import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, map, filter } from 'rxjs';
import { TripsService, BookingsService, StopsService, AuthService } from '../../core/services';
import { Trip, User } from '../../models';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../../shared/components/map/map';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MapComponent],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking implements OnInit {
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tripsService = inject(TripsService);
  private bookingsService = inject(BookingsService);
  private stopsService = inject(StopsService);
  private authService = inject(AuthService);

  bookingForm: FormGroup = this.formBuilder.group({
    mainStation: [''],
    trip: ['', [Validators.required]],
    departure: ['', [Validators.required]],
    destination: ['', [Validators.required]],
    ticket_num: [1, [Validators.required, Validators.min(1)]],
    ticketType: ['oneWayTicket'],
    departureTime: ['', [Validators.required]],
    date: [new Date().toISOString().split('T')[0], [Validators.required]],
  });

  currentTrip = signal<Trip | null>(null);
  basePrice = signal<number>(0);
  availableTrips = signal<Trip[]>([]);
  isManualSelection = signal<boolean>(false);
  
  currentUser: User | null = this.authService.currentUser();
  minDate: string = new Date().toISOString().split('T')[0];
  allAvailableStops = toSignal(this.stopsService.stops$, { initialValue: [] });
  formValues = toSignal(this.bookingForm.valueChanges.pipe(startWith(this.bookingForm.value)));

  constructor() {
    this.setupFormListeners();
  }

  ngOnInit(): void {
    const tripId = this.route.snapshot.paramMap.get('tripId');
    const navigation = this.router.getCurrentNavigation()?.extras;
    const ticketInfo = navigation?.state?.['stopData'];

    if (tripId) {
      this.isManualSelection.set(false);
      this.tripsService.getTripById(tripId).subscribe(trip => {
        this.currentTrip.set(trip);
        this.availableTrips.set([trip]);
        
        const destName = ticketInfo ? ticketInfo.stopId.name : trip.route.endStop.stopId.name;
        this.bookingForm.patchValue({
          trip: trip._id,
          departure: trip.route.startStop.stopId.name,
          destination: destName,
          date: new Date(trip.date).toISOString().split('T')[0],
          departureTime: trip._id
        });
        
        this.basePrice.set(ticketInfo ? ticketInfo.price : trip.route.oneWayTicketPrice);
      });
    } else {
      this.isManualSelection.set(true);
      this.stopsService.getStops().subscribe();
    }
  }

  private setupFormListeners(): void {
    this.bookingForm.get('mainStation')?.valueChanges.subscribe(stationId => {
      if (stationId && this.isManualSelection()) {
        const hub = this.allAvailableStops().find(s => s._id === stationId);
        if (hub) {
          this.bookingForm.patchValue({ departure: hub.name, destination: '' });
          const type = hub.south ? 'south' : 'west';
          this.tripsService.getDepartures(type).subscribe(res => this.availableTrips.set(res.docs));
        }
      }
    });

    this.bookingForm.get('departureTime')?.valueChanges.subscribe(tripId => {
      if (this.isManualSelection()) {
        const selected = this.availableTimesForRoute().find(t => t._id === tripId);
        if (selected) {
          this.currentTrip.set(selected);
          this.bookingForm.patchValue({ trip: selected._id }, { emitEvent: false });
          
          const dest = this.bookingForm.get('destination')?.value;
          const stopInfo = selected.route.stops.find(s => s.stopId.name === dest);
          this.basePrice.set(stopInfo ? stopInfo.price : selected.route.oneWayTicketPrice);
        }
      }
    });
  }

  allStopsInOrder = computed(() => {
    const trip = this.currentTrip();
    if (!trip) return [];
    return [trip.route.startStop.stopId, ...trip.route.stops.map(s => s.stopId), trip.route.endStop.stopId];
  });

  currentPath = computed(() => {
    const stops = this.allStopsInOrder();
    const val = this.formValues();
    if (!stops.length || !val?.departure || !val?.destination) return [];
    const start = stops.findIndex(s => s.name === val.departure);
    const end = stops.findIndex(s => s.name === val.destination);
    return (start === -1 || end === -1 || start >= end) ? [] : stops.slice(start, end + 1);
  });

  totalPrice = computed(() => {
    const values = this.formValues();
    if (!values || !this.currentTrip()) return 0;
    let price = this.basePrice();
    if (values.ticketType === 'twoWayTicket' && this.currentTrip()?.route.twoWayTicketPrice) {
      price = this.currentTrip()!.route.twoWayTicketPrice;
    }
    return Math.round(price * (values.ticket_num || 0) * 100) / 100;
  });

  availableTimesForRoute = computed(() => {
    const val = this.formValues();
    const trips = this.availableTrips();
    if (!val?.destination || !val?.date || !trips.length) return [];
    return trips.filter(t => {
      const d = new Date(t.date).toISOString().split('T')[0];
      const match = t.route.endStop.stopId.name === val.destination || t.route.stops.some(s => s.stopId.name === val.destination);
      return d === val.date && match && t.availableSeats > 0;
    });
  });

  mainHubs = computed(() => this.allAvailableStops().filter(s => s.south || s.west));
  destinationOptions = computed(() => {
    const trips = this.availableTrips();
    const all = trips.flatMap(t => [t.route.endStop.stopId, ...t.route.stops.map(s => s.stopId)]);
    return all.filter((s, i, self) => i === self.findIndex(x => x.name === s.name));
  });
  intermediateStops = computed(() => this.currentPath().length > 2 ? this.currentPath().slice(1, -1) : []);
  showTicketType = computed(() => {
    const p = this.currentPath();
    return p.length >= 2 && p[0].type === 'Bus Station' && p[p.length - 1].type === 'Bus Station';
  });

  routeOrderValidator(): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      const s = this.allStopsInOrder();
      const start = s.findIndex(x => x.name === c.get('departure')?.value);
      const end = s.findIndex(x => x.name === c.get('destination')?.value);
      return (start !== -1 && end !== -1 && start < end) ? null : { invalidOrder: true };
    };
  }

  getArrivalTimeForStop(trip: Trip): string {
    const dest = this.formValues()?.destination;
    if (trip.route.endStop.stopId.name === dest) return trip.route.arrivalHour;
    return trip.route.stops.find(s => s.stopId.name === dest)?.arrivalTime || '';
  }

  onSubmit(): void {
    const path = this.currentPath();
    if (this.bookingForm.valid && path.length >= 2) {
      const data = {
        user: this.currentUser?._id,
        trip: this.currentTrip()?._id,
        departureStopId: path[0]._id,
        destinationStopId: path[path.length - 1]._id,
        totalPrice: this.totalPrice(),
        ticketType: this.bookingForm.value.ticketType,
        seats: this.bookingForm.value.ticket_num
      };
      this.bookingsService.createBooking(data).subscribe(res => {
        if (res.checkoutUrl) window.location.href = res.checkoutUrl;
      });
    }
  }
}