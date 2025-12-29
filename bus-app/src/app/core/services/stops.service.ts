import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
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

    // getStops(): Observable<Stop[]> {
    //     return this.httpClient.get<Stop[]>(this.apiUrl)
    //         .pipe(
    //             tap(stops => this.selectedStopBehaviourSubject.next(stops))
    //         );
    // }

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