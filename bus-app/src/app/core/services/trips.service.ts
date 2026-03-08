import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, Observable, of, pipe, tap } from "rxjs";
import { Trip } from "../../models/trip.model";
import { PaginatedResponse } from "../../models";

@Injectable({ providedIn: 'root' })
export class TripsService {
    private httpClient = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/trips';

    private tripsCache$ = new BehaviorSubject<Trip[]>([]);

    private updateCache(newTrips: Trip[]) {
        const currentCache = this.tripsCache$.value;
        const updatedCache = [...currentCache];

        newTrips.forEach(newTrip => {
            const exist = updatedCache.find(t => t._id === newTrip._id);

            if(!exist) {
                updatedCache.push(newTrip);
            }
        });

        this.tripsCache$.next(updatedCache);
    }

    getTripById(id: string): Observable<Trip> {
        const cachedTrip = this.tripsCache$.value.find(t => id === t._id);

        if(cachedTrip) {
            return of(cachedTrip);
        }

        return this.httpClient.get<Trip>(`${this.apiUrl}/${id}`).pipe(
            tap(trip => this.updateCache([trip]))
        );
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

        return this.httpClient.get<PaginatedResponse<Trip>>(`${this.apiUrl}/search`, { params }).pipe(
            tap(search => this.tripsCache$.next(search.docs))
        );
    }

    getDepartures(station: string, page: number = 1, limit: number = 10): Observable<PaginatedResponse<Trip>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        return this.httpClient.get<PaginatedResponse<Trip>>(`${this.apiUrl}/departures/${station}`, { params }).pipe(
            tap(dep => this.tripsCache$.next(dep.docs))
        );
    }

    getArrivals(station: string, page: number = 1, limit: number = 10): Observable<PaginatedResponse<Trip>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        return this.httpClient.get<PaginatedResponse<Trip>>(`${this.apiUrl}/arrivals/${station}`, { params }).pipe(
            tap(arr => this.tripsCache$.next(arr.docs))
        );
    }
}