import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RoutePopulated } from "../../models/index";

@Injectable({ providedIn: 'root' })
export class RoutesService {
    private apiUrl = 'http://localhost:3000/routes';

    constructor(private httpClient: HttpClient) { }

    getRoutes(): Observable<RoutePopulated[]> {
        return this.httpClient.get<RoutePopulated[]>(this.apiUrl);
    }

    createRoute(body: any): Observable<any> {
        return this.httpClient.post(`${this.apiUrl}/create-route`, { routeData: body });
    }

    getDepartures(station: string): Observable<any[]> {
        return this.httpClient.get<any[]>(`${this.apiUrl}/departures/${station}`);
    }

    getArrivals(station: string): Observable<any[]> {
        return this.httpClient.get<any[]>(`${this.apiUrl}/arrivals/${station}`);
    }

    searchRoutes(stop?: string, transportOperator?: string, date?: string, time?: string): Observable<any[]> {
        let params = new HttpParams();
        if (stop) params = params.set('stop', stop);
        if (transportOperator) params = params.set('transportOperator', transportOperator);
        if (date) params = params.set('date', date);
        if (time) params = params.set('time', time);

        return this.httpClient.get<any[]>(`${this.apiUrl}/search`, { params });
    }
}