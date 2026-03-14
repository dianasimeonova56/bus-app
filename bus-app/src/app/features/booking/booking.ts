import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { TripsService } from '../../core/services/trips.service';
import { Stop, Trip, User } from '../../models';
import { AuthService, BookingsService, StopsService } from '../../core/services';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../../shared/components/map/map';
import { Login } from '../auth/login/login';

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
  currentUser: User | null = this.authService.currentUser();
  isManualSelection = signal<boolean>(false);
  allAvailableStops = toSignal(this.stopsService.stops$, { initialValue: [] });
  availableTrips = signal<Trip[]>([]);
  minDate: string = new Date().toISOString().split('T')[0];

  formValues = toSignal(
    this.bookingForm.valueChanges.pipe(startWith(this.bookingForm.value))
  );

  constructor() {
    const navigation = this.router.currentNavigation()?.extras;
    const ticketInfo = navigation?.state?.['stopData'];

    const tripId = this.route.snapshot.paramMap.get('tripId');

    if (tripId) {
      this.tripsService.getTripById(tripId).subscribe({
        next: (trip) => {
          this.currentTrip.set(trip);

          const depName = trip.route.startStop.stopId.name
          const destName = ticketInfo ? ticketInfo.stopId.name : trip.route.endStop.stopId.name;

          this.bookingForm.patchValue({
            trip: trip._id,
            departure: depName,
            destination: destName
          });

          this.bookingForm.setValidators(this.routeOrderValidator());

          const initialPrice = ticketInfo ? ticketInfo.price : trip.route.oneWayTicketPrice;

          this.basePrice.set(initialPrice);
          this.totalPrice()
        }
      });
    } else {
      this.isManualSelection.set(true);
      this.stopsService.getStops().subscribe();
    }

    this.bookingForm.get('mainStation')?.valueChanges.subscribe(stationId => {
      if (stationId) {
        const selectedHub = this.allAvailableStops().find(s => s._id === stationId);

        if (selectedHub) {
          this.bookingForm.patchValue({ departure: selectedHub.name, destination: '' });

          const type = selectedHub.south ? 'south' : 'west';

          this.tripsService.getDepartures(type).subscribe(res => {
            this.availableTrips.set(res.docs);
          });
        }
      }
    });

    this.bookingForm.get('destination')?.valueChanges.subscribe(() => {
      this.bookingForm.patchValue({ departureTime: '', trip: '' }, { emitEvent: false });
      this.currentTrip.set(null);
    });

    this.bookingForm.get('departureTime')?.valueChanges.subscribe(tripId => {
      const foundTrip = this.availableTimesForRoute().find(t => t._id === tripId);

      if (foundTrip) {
        this.currentTrip.set(foundTrip);
        console.log(this.currentTrip, this.currentPath());
        
        this.bookingForm.patchValue({ trip: foundTrip._id }, { emitEvent: false });

        const destName = this.bookingForm.get('destination')?.value;
        const stopInfo = foundTrip.route.stops.find(s => s.stopId.name === destName);
        const price = stopInfo ? stopInfo.price : foundTrip.route.oneWayTicketPrice;

        this.basePrice.set(price);
      }
    });
  }

  allStopsInOrder = computed(() => {
    const trip = this.currentTrip();
    if (!trip) return [];
    return [
      trip.route.startStop.stopId,
      ...trip.route.stops.map(s => s.stopId),
      trip.route.endStop.stopId
    ];
  });

  currentPath = computed(() => {
    const stops = this.allStopsInOrder();
    const values = this.formValues();
    if (stops.length === 0 || !values) return [];

    const startIndex = stops.findIndex(s => s.name === values.departure);
    const endIndex = stops.findIndex(s => s.name === values.destination);

    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
      return [];
    }

    return stops.slice(startIndex, endIndex + 1);
  });

  intermediateStops = computed(() => {
    const path = this.currentPath();
    if (path.length > 2) {
      return path.slice(1, -1);
    }
    return [];
  });

  showTicketType = computed(() => {
    const path = this.currentPath();
    if (path.length < 2) return false;

    const depStop = path[0];
    const destStop = path[path.length - 1];

    return depStop.type === 'Bus Station' && destStop.type === 'Bus Station';
  });

  totalPrice = computed(() => {
    const trip = this.currentTrip();
    const values = this.formValues();
    if (!values) return 0;

    const type = values.ticketType;
    const count = Number(values.ticket_num) || 0;
    let pricePerTicket = this.basePrice();

    if (type === 'twoWayTicket' && trip?.route.twoWayTicketPrice) {
      pricePerTicket = trip.route.twoWayTicketPrice;
    }

    const total = pricePerTicket * count;
    return Math.round(total * 100) / 100;
  });

  destinationOptions = computed(() => {
    const trips = this.availableTrips();
    if (trips.length === 0) return [];

    const allPossibleDestinations = trips.flatMap(trip => {
      return [
        trip.route.endStop.stopId,
        ...trip.route.stops.map(s => s.stopId)
      ];
    });

    return allPossibleDestinations.filter((stop, index, self) =>
      index === self.findIndex((s) => s.name === stop.name)
    );
  });

  mainHubs = computed(() => {
    const stops = this.allAvailableStops();
    if (this.allAvailableStops().length === 0) {
      this.stopsService.getStops().subscribe();
    }
    return stops.filter(stop =>
      stop.south || stop.west
    );
  });

  availableTimesForRoute = computed(() => {
    const values = this.formValues();
    const destName = values?.destination;
    const selectedDate = values?.date; // Формат: "YYYY-MM-DD"
    const trips = this.availableTrips();

    if (!destName || !selectedDate || trips.length === 0) return [];

    return trips.filter(t => {
      const tripDateOnly = new Date(t.date).toISOString().split('T')[0];

      const matchesDate = tripDateOnly === selectedDate;

      const matchesRoute = t.route.endStop.stopId.name === destName ||
        t.route.stops.some(s => s.stopId.name === destName);

      const hasSeats = t.availableSeats > 0;

      const isPast = this.isTimePast(t.route.startHour);

      return matchesDate && matchesRoute && hasSeats && !isPast;
    });
  });

  routeOrderValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const stops = this.allStopsInOrder();
      const dep = control.get('departure')?.value;
      const dest = control.get('destination')?.value;

      if (!dep || !dest || stops.length === 0) return null;

      const startIndex = stops.findIndex(s => s.name === dep);
      const endIndex = stops.findIndex(s => s.name === dest);

      return (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex)
        ? null
        : { invalidOrder: true };
    };
  }

  getArrivalTimeForStop(trip: Trip): string {
    const destName = this.formValues()?.destination;
    if (!destName) return '';

    if (trip.route.endStop.stopId.name === destName) {
      return trip.route.arrivalHour;
    }

    const intermediateStop = trip.route.stops.find(s => s.stopId.name === destName);
    return intermediateStop ? intermediateStop.arrivalTime : trip.route.arrivalHour;
  }

  isTimePast(tripHour: string): boolean {
    const selectedDate = this.formValues()?.date;
    const today = new Date().toISOString().split('T')[0];

    if (selectedDate > today) return false;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    const [tripH, tripM] = tripHour.split(':').map(Number);

    if (tripH > currentHour) return false;
    if (tripH === currentHour && tripM > currentMinutes) return false;

    return true;
  }

  onSubmit(): void {
    const path = this.currentPath();

    if (this.bookingForm.valid && path.length >= 2) {
      const formValue = this.bookingForm.value;

      const bookingData = {
        user: this.currentUser?._id,
        trip: this.currentTrip()?._id,
        departureStopId: path[0]._id,
        destinationStopId: path[path.length - 1]._id,
        totalPrice: this.totalPrice(),
        ticketType: formValue.ticketType,
        seats: formValue.ticket_num
      };

      this.bookingsService.createBooking(bookingData).subscribe({
        next: (res) => {
          if (res.checkoutUrl) {
            window.location.href = res.checkoutUrl;
          }
        },
        error: (err) => console.error('Booking failed', err)
      });
    }
  }
}