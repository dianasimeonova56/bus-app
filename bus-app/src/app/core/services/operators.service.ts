import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { TransportOperator } from "../../models/index";

@Injectable({
    providedIn: 'root'
})

export class OperatorsService {
    private apiUrl = 'http://localhost:3000/operators';
    private operatorsBehaviourSubject = new BehaviorSubject<TransportOperator[]>([]);
    private selectedOperatorBehaviourSubject = new BehaviorSubject<TransportOperator | null>(null);

    public operators$ = this.operatorsBehaviourSubject.asObservable();
    public operator$ = this.selectedOperatorBehaviourSubject.asObservable();

    constructor(private httpClient: HttpClient) { }

    getOperators(): Observable<TransportOperator[]> {
        return this.httpClient.get<TransportOperator[]>(this.apiUrl)
            .pipe(
                tap(operators => this.operatorsBehaviourSubject.next(operators))
            );
    }

    getOperator(operatorId: string | null): Observable<TransportOperator> {
        return this.httpClient.get<TransportOperator>(`${this.apiUrl}/${operatorId}`).pipe(
            tap(operator => this.selectedOperatorBehaviourSubject.next(operator))
        );
    }

    createOperator(body: TransportOperator): Observable<TransportOperator> {
        return this.httpClient.post<TransportOperator>(this.apiUrl + '/create-operator', { operatorData: body })
    }

    editOperator(operatorId: string, operatorData: Partial<TransportOperator>): Observable<TransportOperator> {
        //Partial -> makes all propertied of the Play optional; ideal for patching data for request
        return this.httpClient.put<TransportOperator>(`${this.apiUrl}/${operatorId}/edit`, { operatorData }).pipe(
            tap(updatedoperator => this.selectedOperatorBehaviourSubject.next(updatedoperator))
        );
    }

    // deleteoperator(operatorId: string): Observable<void> {
    //     return this.httpClient.delete<void>(`${this.apiUrl}/${operatorId}/delete`).pipe(
    //         tap(() => {
    //             const current = this.operatorsBehaviourSubject.value;
    //             this.operatorsBehaviourSubject.next(current.filter(s => s._id !== operatorId));//get the ones that are still available
    //         })
    //     );
    // }
}