import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private movieChangedSubject = new Subject<void>();
  
  movieChanged$ = this.movieChangedSubject.asObservable();
  
  notifyMovieChanged() {
    this.movieChangedSubject.next();
  }
}