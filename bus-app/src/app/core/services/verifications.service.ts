import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { VerificationRequest } from "../../models/index";

@Injectable({
    providedIn: 'root'
})
export class VerificationsService {
    private apiUrl = 'http://localhost:3000/verification';
    
    private verificationsBehaviourSubject = new BehaviorSubject<VerificationRequest[]>([]);
    private selectedVerificationBehaviourSubject = new BehaviorSubject<VerificationRequest | null>(null);

    public verifications$ = this.verificationsBehaviourSubject.asObservable();
    public verification$ = this.selectedVerificationBehaviourSubject.asObservable();

    constructor(private httpClient: HttpClient) { }

    sendRequest(formData: FormData): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/send`, formData).pipe(
            tap(res => {
                console.log('Заявката е изпратена:', res);
            })
        );
    }

    verifyRequest(verificationId: string): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/verify`, { verificationId }).pipe(
            tap(() => this.refreshPendingRequests())
        );
    }

    denyRequest(verificationId: string, comment: string): Observable<any> {
        return this.httpClient.post<any>(`${this.apiUrl}/deny`, { verificationId, comment }).pipe(
            tap(() => this.refreshPendingRequests())
        );
    }

    getPendingRequests(): Observable<{ requests: VerificationRequest[] }> {
        return this.httpClient.get<{ requests: VerificationRequest[] }>(`${this.apiUrl}/pending`).pipe(
            tap(res => this.verificationsBehaviourSubject.next(res.requests))
        );
    }

    private refreshPendingRequests() {
        this.getPendingRequests().subscribe();
    }
}