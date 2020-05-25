import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User, UserService, UserState } from './user.service';
import { ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StreamService {
  private _currentStream$ = new BehaviorSubject<Stream>(null);

  constructor(
    private http: HttpClient, 
    @Inject('API_URL') private apiUrl,
    private userService: UserService
  ) { }

  init(username) {
    this.getStream(username)
      .subscribe((stream) => this._currentStream$.next(stream));
  }

  get currentStream$() {
    return this._currentStream$.asObservable();
  }

  startStream(stream: Stream) {
    return this.http.post<Stream>(`${this.apiUrl}/streams`, stream)
      .pipe(
        tap(() => console.debug('Inside startStream()')),
        tap((stream) => this._currentStream$.next(stream)),
        tap(() => this.userService.tryChangeCurrentUserState(UserState.Streaming)),
        catchError(this.handleError<Stream>('startStream'))
      );
  }

  endStream(stream: Stream = this._currentStream$.value) {
    this._currentStream$.next(null);
    console.debug(stream);
    return this.http.delete(`${this.apiUrl}/streams/${stream.broadcaster.username}`)
      .pipe(
        tap(() => this.userService.tryChangeCurrentUserState(UserState.Active))
      );
  }

  getAllStreams(): Observable<Stream[]> {
    return this.http.get<Stream[]>(`${this.apiUrl}/streams`)
      .pipe(
        tap(() => console.debug('Inside getStreams()')),
        catchError(this.handleError<Stream[]>('getStreams'))
      );
  }

  getStream(name: string) {
    return this.http.get<Stream>(`${this.apiUrl}/streams/${name}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
}

export interface Stream {
  title: string,
  description: string,
  broadcaster: User,
  streamUri: string
}