import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { TripsService } from '../../core/services/trips.service';
import { Trip, User } from '../../models';
import { AuthService } from '../../core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking {
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tripsService = inject(TripsService);
  private authService = inject(AuthService);

  bookingForm: FormGroup = this.formBuilder.group({
    trip: ['', [Validators.required]],
    departure: ['', [Validators.required]],
    destination: ['', [Validators.required]],
    ticket_num: [1, [Validators.required, Validators.min(1)]],
    ticketType: ['oneWayTicket']
  });

  formValues = toSignal(
    this.bookingForm.valueChanges.pipe(
      startWith(this.bookingForm.value)
    )
  );

  currentTrip = signal<Trip | null>(null);
  basePrice = signal<number>(0);
  tripId: string | null = null;
  ticketInfo: any;
  currentUser: User | null = this.authService.currentUser();

  showTicketType = computed(() => {
    const trip = this.currentTrip();
    const values = this.formValues();
    if (!trip || !values) return false;

    const currentDep = values.departure;
    const currentDest = values.destination;

    const isDepBusStation = trip.route.startStop.stopId.type === 'Bus Station' &&
      trip.route.startStop.stopId.name === currentDep;

    let isDestBusStation = false;
    if (trip.route.endStop.stopId.name === currentDest) {
      isDestBusStation = trip.route.endStop.stopId.type === 'Bus Station';
    } else {
      const intermediate = trip.route.stops.find(s => s.stopId.name === currentDest);
      isDestBusStation = intermediate?.stopId.type === 'Bus Station';
    }

    return isDepBusStation && isDestBusStation;
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

  constructor() {
    const navigation = this.router.currentNavigation()?.extras;
    if (navigation?.state) {
      this.ticketInfo = navigation.state['stopData'];
    }

    this.tripId = this.route.snapshot.paramMap.get('tripId');

    if (this.tripId) {
      this.tripsService.getTripById(this.tripId).subscribe({
        next: (trip) => {
          this.currentTrip.set(trip);
          this.bookingForm.patchValue({
            trip: trip._id,
            departure: trip.route.startStop.stopId.name,
            destination: this.ticketInfo ? this.ticketInfo.stopId.name : trip.route.endStop.stopId.name
          });

          const initialPrice = this.ticketInfo ? this.ticketInfo.price : trip.route.oneWayTicketPrice;
          this.basePrice.set(initialPrice);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      console.log('Final price:', this.totalPrice());
    }
  }
}