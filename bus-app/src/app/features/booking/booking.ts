import { Component, computed, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, map, switchMap, filter, tap, of } from 'rxjs';
import { TripsService } from '../../core/services/trips.service';
import { Trip, User } from '../../models';
import { AuthService, BookingsService, StopsService } from '../../core/services';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../../shared/components/map/map';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MapComponent],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking {
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tripsService = inject(TripsService);
  private bookingsService = inject(BookingsService);
  private stopsService = inject(StopsService);
  private authService = inject(AuthService);

  // 1. Дефиниция на формата
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

  // 2. Сигнали за състоянието
  basePrice = signal<number>(0);
  isManualSelection = signal<boolean>(false);
  availableTrips = signal<Trip[]>([]);
  minDate: string = new Date().toISOString().split('T')[0];
  currentUser: User | null = this.authService.currentUser();

  // 3. Асинхронни данни чрез toSignal
  allAvailableStops = toSignal(this.stopsService.stops$, { initialValue: [] });
  
  // Вземаме Trip директно от URL и автоматично обновяваме сигнала
  currentTrip = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('tripId')),
      tap(id => !id ? this.isManualSelection.set(true) : null),
      filter(id => !!id),
      switchMap(id => this.tripsService.getTripById(id!)),
      tap(trip => this.initializeFormWithTrip(trip))
    ),
    { initialValue: null }
  );

  formValues = toSignal(
    this.bookingForm.valueChanges.pipe(startWith(this.bookingForm.value))
  );

  constructor() {
    this.stopsService.getStops().subscribe();
    // Слушаме за ръчна промяна на началната автогара (само при ръчен избор)
    this.bookingForm.get('mainStation')?.valueChanges.subscribe(stationId => {
      if (stationId && this.isManualSelection()) {
        const selectedHub = this.allAvailableStops().find(s => s._id === stationId);
        if (selectedHub) {
          this.bookingForm.patchValue({ departure: selectedHub.name, destination: '' });
          const type = selectedHub.south ? 'south' : 'west';
          this.tripsService.getDepartures(type).subscribe(res => this.availableTrips.set(res.docs));
        }
      }
    });

    // Изчистване при смяна на дестинация
    this.bookingForm.get('destination')?.valueChanges.subscribe(() => {
      if (this.isManualSelection()) {
        this.bookingForm.patchValue({ departureTime: '', trip: '' }, { emitEvent: false });
      }
    });
  }

  private initializeFormWithTrip(trip: Trip) {
    if (!trip) return;

    const navigation = this.router.getCurrentNavigation()?.extras;
    const ticketInfo = navigation?.state?.['stopData'];
    const destName = ticketInfo ? ticketInfo.stopId.name : trip.route.endStop.stopId.name;

    // Пълним availableTrips, за да може computed сигналите да "виждат" този трип
    this.availableTrips.set([trip]);

    this.bookingForm.patchValue({
      trip: trip._id,
      departure: trip.route.startStop.stopId.name,
      destination: destName,
      date: new Date(trip.date).toISOString().split('T')[0],
      departureTime: trip._id
    });

    this.basePrice.set(ticketInfo ? ticketInfo.price : trip.route.oneWayTicketPrice);
    this.bookingForm.setValidators(this.routeOrderValidator());
    this.bookingForm.updateValueAndValidity();
  }

  // --- Computed Сигнали (Реактивни) ---

  allStopsInOrder = computed(() => {
    const trip = this.currentTrip();
    if (!trip || !trip.route) return [];
    return [
      trip.route.startStop.stopId,
      ...trip.route.stops.map(s => s.stopId),
      trip.route.endStop.stopId
    ];
  });

  currentPath = computed(() => {
    const stops = this.allStopsInOrder();
    const values = this.formValues();
    if (stops.length === 0 || !values?.departure || !values?.destination) return [];

    const startIndex = stops.findIndex(s => s.name === values.departure);
    const endIndex = stops.findIndex(s => s.name === values.destination);

    return (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) 
      ? [] 
      : stops.slice(startIndex, endIndex + 1);
  });

  totalPrice = computed(() => {
    const trip = this.currentTrip();
    const values = this.formValues();
    if (!values || !trip) return 0;

    const count = Number(values.ticket_num) || 0;
    let pricePerTicket = this.basePrice();

    if (values.ticketType === 'twoWayTicket' && trip.route.twoWayTicketPrice) {
      pricePerTicket = trip.route.twoWayTicketPrice;
    }

    return Math.round(pricePerTicket * count * 100) / 100;
  });

  // Останалите помощни методи за филтрация
  availableTimesForRoute = computed(() => {
    const values = this.formValues();
    const trips = this.availableTrips();
    if (!values?.destination || !values?.date || trips.length === 0) return [];

    return trips.filter(t => {
      const tripDate = new Date(t.date).toISOString().split('T')[0];
      const matchesRoute = t.route.endStop.stopId.name === values.destination || 
                           t.route.stops.some(s => s.stopId.name === values.destination);
      return tripDate === values.date && matchesRoute && t.availableSeats > 0;
    });
  });

  mainHubs = computed(() => this.allAvailableStops().filter(s => s.south || s.west));

  destinationOptions = computed(() => {
    const trips = this.availableTrips();
    const dests = trips.flatMap(t => [t.route.endStop.stopId, ...t.route.stops.map(s => s.stopId)]);
    return dests.filter((stop, i, self) => i === self.findIndex(s => s.name === stop.name));
  });

  intermediateStops = computed(() => {
    const path = this.currentPath();
    return path.length > 2 ? path.slice(1, -1) : [];
  });

  showTicketType = computed(() => {
    const path = this.currentPath();
    if (path.length < 2) return false;
    return path[0].type === 'Bus Station' && path[path.length - 1].type === 'Bus Station';
  });

  // --- Валидатори и Помощни методи ---

  routeOrderValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const stops = this.allStopsInOrder();
      const dep = control.get('departure')?.value;
      const dest = control.get('destination')?.value;
      if (!dep || !dest || stops.length === 0) return null;
      const start = stops.findIndex(s => s.name === dep);
      const end = stops.findIndex(s => s.name === dest);
      return (start !== -1 && end !== -1 && start < end) ? null : { invalidOrder: true };
    };
  }

  getArrivalTimeForStop(trip: Trip): string {
    const destName = this.formValues()?.destination;
    if (trip.route.endStop.stopId.name === destName) return trip.route.arrivalHour;
    return trip.route.stops.find(s => s.stopId.name === destName)?.arrivalTime || trip.route.arrivalHour;
  }

  onSubmit(): void {
    const path = this.currentPath();
    if (this.bookingForm.valid && path.length >= 2) {
      const bookingData = {
        user: this.currentUser?._id,
        trip: this.currentTrip()?._id,
        departureStopId: path[0]._id,
        destinationStopId: path[path.length - 1]._id,
        totalPrice: this.totalPrice(),
        ticketType: this.bookingForm.value.ticketType,
        seats: this.bookingForm.value.ticket_num
      };

      this.bookingsService.createBooking(bookingData).subscribe({
        next: (res) => res.checkoutUrl ? window.location.href = res.checkoutUrl : null,
        error: (err) => console.error('Booking failed', err)
      });
    }
  }
}