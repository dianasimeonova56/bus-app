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

    getSubscription(id: string | null): Observable<SubscriptionCard> {
        return this.httpClient.get<SubscriptionCard>(`${this.apiUrl}/${id}`).pipe(
            tap(sub => this.selectedSubscriptionBehaviourSubject.next(sub))
        );
    }

    createSubscription(body: SubscriptionCard): Observable<SubscriptionCard> {
        return this.httpClient.post<SubscriptionCard>(this.apiUrl + '/create', { data: body })
    }

    createUserSubscription(body: UserSubscription): Observable<UserSubscription> {
        return this.httpClient.post<UserSubscription>(this.apiUrl + '/buy-subscription', { data: body })
    }
}