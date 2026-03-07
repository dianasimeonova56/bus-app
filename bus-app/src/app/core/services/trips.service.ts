import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Trip } from "../../models/trip.model";
import { PaginatedResponse } from "../../models";

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

    searchTrips(
        stop?: string,
        transportOperator?: string,
        date?: string,
        time?: string,
        page: number = 1,
        limit: number = 10
    ): Observable<PaginatedResponse<Trip>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        if (stop) params = params.set('stop', stop);
        if (transportOperator) params = params.set('transportOperator', transportOperator);
        if (date) params = params.set('date', date);
        if (time) params = params.set('time', time);

        return this.httpClient.get<PaginatedResponse<Trip>>(`${this.apiUrl}/search`, { params });
    }

    getDepartures(station: string, page: number = 1, limit: number = 10): Observable<PaginatedResponse<Trip>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        return this.httpClient.get<PaginatedResponse<Trip>>(`${this.apiUrl}/departures/${station}`, { params });
    }

    getArrivals(station: string, page: number = 1, limit: number = 10): Observable<PaginatedResponse<Trip>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        return this.httpClient.get<PaginatedResponse<Trip>>(`${this.apiUrl}/arrivals/${station}`, { params });
    }
}