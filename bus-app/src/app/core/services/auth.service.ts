import { Injectable, signal } from "@angular/core";
import { User } from "../../models";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root' // we can inject it in the project] we can create instance of it 
    //we provide it in the root of the project to be available everywhere?
})

export class AuthService {
    //encapsulation for the service
    private apiUrl = 'http://localhost:3000/users'
    private _isLoggedIn = signal<boolean>(false); //only the service can access the signals
    private _currentUser = signal<User | null>(null);

    public isLoggedIn = this._isLoggedIn.asReadonly(); // componnets can only READ it cant modify it 
    public currentUser = this._currentUser.asReadonly();

    constructor(private httpClient: HttpClient) {
        const savedUser = localStorage.getItem('currentUser') // check if user exists
        if (savedUser) {
            const user: User = JSON.parse(savedUser);
            this._currentUser.set(user);
            this._isLoggedIn.set(true);
        }
    }

    login(email: string, password: string): Observable<User> {
        return this.httpClient.post<User>(`${this.apiUrl}/login`, { email, password }, {
            withCredentials: true
        }).pipe(
            tap(user => {
                this._currentUser.set(user);
                this._isLoggedIn.set(true);
                localStorage.setItem('currentUser', JSON.stringify(user))
            })
        );
    }

    register(email: string, first_name:string, last_name:string, phone_number:string, password: string, rePassword: string): Observable<User> {
        return this.httpClient.post<User>(`${this.apiUrl}/register`, {
            email,
            first_name,
            last_name, 
            phone_number,
            password,
            rePassword,
            user_role: 'user'
        }, {
            withCredentials: true
        }).pipe(
            tap(user => {
                this._currentUser.set(user);
                this._isLoggedIn.set(true);
                localStorage.setItem('currentUser', JSON.stringify(user))
            })
        );
    }

    logout(): Observable<void> {
        return this.httpClient.post<void>(`${this.apiUrl}/logout`, {}, {
            withCredentials: true
        }).pipe(
            tap(() => {
                this._currentUser.set(null);
                this._isLoggedIn.set(false);
                localStorage.removeItem('currentUser')
            })
        );
    }

    getCurrentUserId(): String | null {
        return this._currentUser()?._id || null
    }

    updateUser(user: Partial<User>): Observable<User> {
        return this.httpClient.put<User>(`${this.apiUrl}/users/${user._id}/edit`, {
            _id: user._id,
            email: user.email,
        }, {
            withCredentials: true
        }).pipe(
            tap(user => {
                this._currentUser.set(user);
                this._isLoggedIn.set(true);
                localStorage.setItem('currentUser', JSON.stringify(user))
            })
        );
    }

    getCurrentUserRole(): String | null {
        return this._currentUser()?.user_role || null;
    }
}