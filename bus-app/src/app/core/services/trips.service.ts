import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Trip } from "../../models/trip.model";

@Injectable({ providedIn: 'root' })
export class TripsService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/trips';

    getTripById(id: string): Observable<Trip> {
        return this.http.get<Trip>(`${this.apiUrl}/${id}`);
    }

    cancelTrip(id: string): Observable<Trip> {
        return this.http.patch<Trip>(`${this.apiUrl}/${id}/cancel`, {});
    }
}