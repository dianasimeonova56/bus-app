import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { News, NewsResponse } from "../../models/index";

@Injectable({
    providedIn: 'root'
})

export class NewsService {
    private apiUrl = 'http://localhost:3000/news';
    private newsBehaviourSubject = new BehaviorSubject<News[]>([]);
    private selectedNewsBehaviourSubject = new BehaviorSubject<News | null>(null);

    public operators$ = this.newsBehaviourSubject.asObservable();
    public operator$ = this.selectedNewsBehaviourSubject.asObservable();

    constructor(private httpClient: HttpClient) { }

    getAllNews(limit: number = 6, page: number = 1): Observable<NewsResponse> {
        let params = new HttpParams()
            .set('limit', limit.toString())
            .set('page', page.toString());

        return this.httpClient.get<NewsResponse>(this.apiUrl, { params })
            .pipe(
                tap(res => {
                    this.newsBehaviourSubject.next(res.docs);
                })
            );
    }

    getNews(id: string | null): Observable<News> {
        return this.httpClient.get<News>(`${this.apiUrl}/${id}`).pipe(
            tap(news => this.selectedNewsBehaviourSubject.next(news))
        );
    }

    createNews(body: News): Observable<News> {
        return this.httpClient.post<News>(this.apiUrl + '/create', { newsData: body }, { withCredentials: true })
    }

    editNews(id: string, newsData: Partial<News>): Observable<News> {
        //Partial -> makes all propertied of the Play optional; ideal for patching data for request
        return this.httpClient.put<News>(`${this.apiUrl}/${id}/edit`, { newsData }).pipe(
            tap(news => this.selectedNewsBehaviourSubject.next(news))
        );
    }
}