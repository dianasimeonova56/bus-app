import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Trip } from "../../models/trip.model";

@Injectable({ providedIn: 'root' })
export class TripsService {
    private httpClient = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/trips';

    getTripById(id: string): Observable<Trip> {
        return this.httpClient.get<Trip>(`${this.apiUrl}/${id}`);
    }

    cancelTrip(id: string): Observable<Trip> {
        return this.httpClient.patch<Trip>(`${this.apiUrl}/${id}/cancel`, {});
    }

    createBooking(bookingData: any): Observable<any> {
        return this.httpClient.post(`http://localhost:3000/booking/create`, bookingData);
    }
}