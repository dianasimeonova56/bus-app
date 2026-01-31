import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Route, RoutePopulated } from "../../models/index";

@Injectable({
    providedIn: 'root'
})

export class RoutesService {
    private apiUrl = 'http://localhost:3000/routes';
    private routesBehaviourSubject = new BehaviorSubject<Route[]>([]);
    private routesPopulatedBehaviourSubject = new BehaviorSubject<RoutePopulated[]>([]);
    private selectedRouteBehaviourSubject = new BehaviorSubject<Route | null>(null);

    public routes$ = this.routesBehaviourSubject.asObservable();
    public route$ = this.selectedRouteBehaviourSubject.asObservable();

    constructor(private httpClient: HttpClient) { }

    getRoutes(): Observable<RoutePopulated[]> {
        return this.httpClient.get<RoutePopulated[]>(this.apiUrl)
            .pipe(
                tap(stops => {
                    this.routesPopulatedBehaviourSubject.next(stops)
                })
            );
    }

    getBusStations(): Observable<Route[]> {
        return this.httpClient.get<Route[]>(`${this.apiUrl}/bus-stations`)
            .pipe(
                tap(stops => this.routesBehaviourSubject.next(stops))
            );
    }

    getNormalStops(): Observable<Route[]> {
        return this.httpClient.get<Route[]>(`${this.apiUrl}/normal-stops`)
            .pipe(
                tap(stops => this.routesBehaviourSubject.next(stops))
            );
    }

    getRoute(stopId: string | null): Observable<Route> {
        return this.httpClient.get<Route>(`${this.apiUrl}/${stopId}`).pipe(
            tap(stop => this.selectedRouteBehaviourSubject.next(stop))
        );
    }

    createRoute(body: Route): Observable<Route> {
        return this.httpClient.post<Route>(this.apiUrl + '/create-route', { routeData: body })
    }

    editRoute(stopId: string, routeData: Partial<Route>): Observable<Route> {
        //Partial -> makes all propertied of the Play optional; ideal for patching data for request
        return this.httpClient.put<Route>(`${this.apiUrl}/${stopId}/edit`, { routeData }).pipe(
            tap(updatedStop => this.selectedRouteBehaviourSubject.next(updatedStop))
        );
    }

    // deleteStop(stopId: string): Observable<void> {
    //     return this.httpClient.delete<void>(`${this.apiUrl}/${stopId}/delete`).pipe(
    //         tap(() => {
    //             const current = this.stopsBehaviourSubject.value;
    //             this.stopsBehaviourSubject.next(current.filter(s => s._id !== stopId));//get the ones that are still available
    //         })
    //     );
    // }

    // searchPlays(playName?: string, director?: string, playDate?: Date): Observable<Play[]> {
    //     let query = new HttpParams();

    //     if (playName) query = query.set('playName', playName);
    //     if (director) query = query.set('director', director);
    //     if (playDate) query = query.set('playDate', playDate.toString());
    //     console.log(playDate?.toString());


    //     return this.httpClient.get<Play[]>(`${this.apiUrl}/search`, { params: query });
    // }
}