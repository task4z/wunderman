import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'apps/fe-wtc-tech-test-angularv2/src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Movie } from '../models/movie.model';
import { map } from 'rxjs/operators';
import { MovieToPatch } from '../models/movie-to-patch.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) { }

  public getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${environment.url}/movies`).pipe(
      map((res: Movie[]) => res.map(movie => this.transformMovie(movie))));
  }

  public updateWatchlist(movie: MovieToPatch): Observable<string> {
    const params = new HttpParams()
      .set('watched',movie.watched.toString())
      .set('saved', movie.saved.toString());
      const httpOptions = {responseType: 'text' as 'json' };

    return this.http.put<string>(`${environment.url}/movies/id/${movie.imdbID}`,params, httpOptions);
  }

  public getMovieDetail(id :string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${environment.url}/movies/id/${id}`).pipe(
      map((res: Movie[]) => res.map(movie => this.transformMovie(movie))));
  }

  private transformMovie(movie: Movie): Movie {
    this.calculateRatings(movie);
    this.getStars(movie);
    movie.Watched = movie.Watched === 'True' ? true : false;
    movie.Saved = movie.Saved === 'True' ? true : false;
    this.getBackground(movie);
    return movie;
  }

  private getBackground(movie: Movie): void {
    if(!movie.Watched && !movie.Saved){
      movie.background = '#FFF';
    }
    if(!movie.Watched && movie.Saved){
      movie.background = '#ED6606';
    }
    if(movie.Watched && movie.Saved){
      movie.background = '#049452';
    }
    if(movie.Watched && !movie.Saved){
      movie.background = '#EEC907';
    }
  }
  
  private getStars(movie): void{
    let res = [];
    let finalRating = parseFloat(movie.finalRating);
    while(parseInt(finalRating.toString()) > 0){
      res.push(1);
      finalRating = finalRating-1;
    }
    if(Math.abs(finalRating) >= 0.5){
      res.push(0.5);
    }
    while(res.length < 5){
      res.push(0);
    }
    movie.stars = res;
  }
  
  private calculateRatings(movie): void {
    let res = 0;
    let countProperties = 0;
    movie.Ratings.forEach(r =>{
      if(r.Source === 'Internet Movie Database'){
        res += parseFloat(r.Value.split('/')[0])*5/10;
        countProperties++;
      }
      if(r.Source === 'Rotten Tomatoes'){
        res += parseFloat(r.Value.split('%')[0])*5/100;
        countProperties++;
      }
      if(r.Source === 'Metacritic'){
        res += parseFloat(r.Value.split('/')[0])*5/100;
        countProperties++;
      }
    })
    movie.finalRating = (res/countProperties).toFixed(2);
  }
}
