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

    searchTrips(stop?: string, transportOperator?: string, date?: string, time?: string): Observable<any[]> {
        let params = new HttpParams();
        if (stop) params = params.set('stop', stop);
        if (transportOperator) params = params.set('transportOperator', transportOperator);
        if (date) params = params.set('date', date);
        if (time) params = params.set('time', time);

        return this.httpClient.get<any[]>(`${this.apiUrl}/search`, { params });
    }

    getDepartures(station: string, limit?: number): Observable<any[]> {
        let queryParams = new HttpParams();
        if (limit) {
            queryParams = queryParams.append('limit', limit.toString());
        }
        return this.httpClient.get<any[]>(`${this.apiUrl}/departures/${station}`, {
            params: queryParams
        });
    }

    getArrivals(station: string, limit?: number): Observable<any[]> {
       let queryParams = new HttpParams();
        if (limit) {
            queryParams = queryParams.append('limit', limit.toString());
        }
        return this.httpClient.get<any[]>(`${this.apiUrl}/arrivals/${station}`, {
            params: queryParams
        });
    }
}