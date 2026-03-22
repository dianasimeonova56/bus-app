import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { SubscriptionCard, UserSubscription } from "../../models/index";

@Injectable({
    providedIn: 'root'
})

export class SubscriptionService {
    private apiUrl = 'http://localhost:3000/subscription';
    private subscriptionsBehaviourSubject = new BehaviorSubject<SubscriptionCard[]>([]);
    private selectedSubscriptionBehaviourSubject = new BehaviorSubject<SubscriptionCard | null>(null);
    private userSubscriptionBehaviourSubject = new BehaviorSubject<SubscriptionCard[]>([]);
    private selectedUserSubscriptionBehaviourSubject = new BehaviorSubject<SubscriptionCard | null>(null);

    public subscriptions$ = this.subscriptionsBehaviourSubject.asObservable();
    public subscription$ = this.selectedSubscriptionBehaviourSubject.asObservable();
    public userSubscriptions$ = this.userSubscriptionBehaviourSubject.asObservable();
    public userSubscription$ = this.selectedUserSubscriptionBehaviourSubject.asObservable();

    constructor(private httpClient: HttpClient) { }

    getSubscriptions(): Observable<SubscriptionCard[]> {
        return this.httpClient.get<SubscriptionCard[]>(this.apiUrl)
            .pipe(
                tap(operators => this.subscriptionsBehaviourSubject.next(operators))
            );
    }

    getUserSubscriptions(userId: String): Observable<any[]> {
        return this.httpClient.get<any[]>(`${this.apiUrl}/user/${userId}`)
            .pipe(
                tap(operators => this.userSubscriptionBehaviourSubject.next(operators))
            );
    }

    getSubscription(id: string | null): Observable<any> {
        return this.httpClient.get<any>(`${this.apiUrl}/${id}`).pipe(
            tap(sub => this.selectedSubscriptionBehaviourSubject.next(sub))
        );
    }

    createSubscription(body: SubscriptionCard): Observable<SubscriptionCard> {
        return this.httpClient.post<SubscriptionCard>(this.apiUrl + '/create', { data: body })
    }

    createUserSubscription(body: any): Observable<{ checkoutUrl: string }> {
        return this.httpClient.post<{ checkoutUrl: string }>(`${this.apiUrl}/buy-subscription`, body);
    }

    searchSubscriptions(stopId: string): Observable<any> {
        let params = new HttpParams().set('stop', stopId);
        console.log(params);
        
        return this.httpClient.get<SubscriptionCard[]>(`${this.apiUrl}/search`, {params}).pipe(
            tap(search => this.subscriptionsBehaviourSubject.next(search))
        )
    }
}