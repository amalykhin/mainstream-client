import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, share, multicast } from 'rxjs/operators';
import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _currentUser$ = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    @Inject("API_URL") private apiUrl
  ) { }

  get currentUser$() {
    return this._currentUser$.asObservable();
  }

  init() {
    return this.http.get<User>(`${this.apiUrl}/user`, {withCredentials: true})
      .pipe(
        tap(user => this._currentUser$.next(user))
      );
  }

  tryChangeCurrentUserState(state: UserState) {
    let currentUser = this._currentUser$.value;
    currentUser.state = state;
    this._currentUser$.next(currentUser);

    console.debug('New user state:');
    console.debug(this._currentUser$.value);
  }

  login(username, password) {
    const url = `${this.apiUrl}/auth`;
    //console.log('Inside UserService.login()');
    return this.http.post<User>(url, { username, password }, {withCredentials: true})
      .pipe(
        tap(() => console.debug("Inside login()")),
        tap((user) => this._currentUser$.next(user)),
        catchError(this.handleError<User>('login')),
      );
  }

  logout() {
    return this.http.get(`${this.apiUrl}/logout`, {withCredentials: true})
      .pipe(
        tap(() => this._currentUser$.next(null))
      );
  }

  register(newUserInfo) {
    const url = `${this.apiUrl}/register`;
    const user$ = this.http.post<User>(url, newUserInfo)
      .pipe(
        tap(() => console.debug("Inside register()")),
        catchError(this.handleError<User>('register')),
      )
      return user$;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
}

export enum UserState { Offline, Active, Watching, Streaming };

export interface User {
  id: number,
  username: string,
  email: string,
  state: UserState,
  streamerKey: string,
}
