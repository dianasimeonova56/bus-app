import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, tap } from "rxjs";
import { Stop } from "../../models/index";

@Injectable({
    providedIn: 'root'
})

export class StopsService {
    private apiUrl = 'http://localhost:3000/stops';
    private stopsBehaviourSubject = new BehaviorSubject<Stop[]>([]);
    private selectedStopBehaviourSubject = new BehaviorSubject<Stop | null>(null);

    public stops$ = this.stopsBehaviourSubject.asObservable();
    public stop$ = this.selectedStopBehaviourSubject.asObservable();

    constructor(private httpClient: HttpClient) { }

    getStops(): Observable<Stop[]> {
        const currentStops = this.stopsBehaviourSubject.value;

        if (currentStops.length > 0) {
            return of(currentStops);
        }

        return this.httpClient.get<Stop[]>(this.apiUrl).pipe(
            tap(stops => this.stopsBehaviourSubject.next(stops))
        );
    }

    getBusStations(): Observable<Stop[]> {
        return this.httpClient.get<Stop[]>(`${this.apiUrl}/bus-stations`)
            .pipe(
                tap(stops => this.stopsBehaviourSubject.next(stops))
            );
    }

    getNormalStops(): Observable<Stop[]> {
        return this.httpClient.get<Stop[]>(`${this.apiUrl}/normal-stops`)
            .pipe(
                tap(stops => this.stopsBehaviourSubject.next(stops))
            );
    }

    getStop(stopId: string | null): Observable<Stop> {
        return this.httpClient.get<Stop>(`${this.apiUrl}/${stopId}`).pipe(
            tap(stop => this.selectedStopBehaviourSubject.next(stop))
        );
    }

    createStop(body: Stop): Observable<Stop> {
        return this.httpClient.post<Stop>(this.apiUrl + '/create-stop', { stopData: body })
    }

    editStop(stopId: string, stopData: Partial<Stop>): Observable<Stop> {
        //Partial -> makes all propertied of the Play optional; ideal for patching data for request
        return this.httpClient.put<Stop>(`${this.apiUrl}/${stopId}/edit`, { stopData }).pipe(
            tap(updatedStop => this.selectedStopBehaviourSubject.next(updatedStop))
        );
    }
}