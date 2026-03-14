import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, map, Observable, of, pipe, tap } from "rxjs";
import { Booking, PaginatedResponse, PopulatedBooking } from "../../models/index";

@Injectable({ providedIn: 'root' })
export class BookingsService {
    private httpClient = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/booking';

    private userBookings$ = new BehaviorSubject<PopulatedBooking[]>([]);

    public userBookingsPopulated$ = this.userBookings$.asObservable();

    cancelBooking(id: string): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/${id}/cancel`).pipe(
            tap((response) => {
                const updatedBooking = response.booking;

                const currentBookings = this.userBookings$.value;

                const updatedList = currentBookings.map(b =>
                    b._id === updatedBooking._id ? updatedBooking : b
                );

                this.userBookings$.next(updatedList);
            })
        );
    }

    createBooking(bookingData: any): Observable<any> {
        return this.httpClient.post(`${this.apiUrl}/create`, bookingData);
    }

    getBookingsForUser(userId: String | undefined): Observable<PopulatedBooking[]> {
        return this.httpClient.get<{ bookings: PopulatedBooking[] }>(`${this.apiUrl}/${userId}/`)
            .pipe(
                map(response => response.bookings),
                tap(bookings => this.userBookings$.next(bookings))
            );
    }

    getAllBookings(): Observable<PaginatedResponse<PopulatedBooking>> {
        return this.httpClient.get<PaginatedResponse<PopulatedBooking>>(`${this.apiUrl}`).pipe(
            tap(booking => this.userBookings$.next(booking.docs))
        );
    }
}