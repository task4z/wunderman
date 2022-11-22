import { Component, Input, OnDestroy } from '@angular/core';
import { Movie } from '../shared/models/movie.model';
import { MovieService } from '../shared/services/movie.service';
import { MovieToPatch } from '../shared/models/movie-to-patch.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'mono-nx-test-with-nextjs-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent implements OnDestroy{

  @Input() public movie: Movie;
  public canChange = false;
  private onDestroy$:Subject<void> = new Subject<void>();

  constructor(private movieService: MovieService) { }

  public ngOnDestroy(): void{
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public changeSaved(): void {
    this.canChange = false;
    this.patchMovie(!this.movie.Saved, this.movie.Watched as boolean);
  }

  public changeWatch(): void {
    this.canChange = false;
    this.patchMovie(this.movie.Saved as boolean, !this.movie.Watched);
  }

  private patchMovie(saved : boolean, watched: boolean): void {
    const param: MovieToPatch = {
      imdbID: this.movie.imdbID,
      saved: saved,
      watched: watched,
    } as MovieToPatch;
    this.movieService.updateWatchlist(param).pipe(takeUntil(this.onDestroy$)).subscribe(
      (res: string) => {
        if(res === 'OK'){
          this.getMovie();
        }
      }, 
      () => {
        this.canChange = true;
      }
      );
  }

  private getMovie(): void {
    this.movieService.getMovieDetail(this.movie.imdbID).pipe(takeUntil(this.onDestroy$)).subscribe(
      (res: Movie[]) => {
        if(res.length){
          this.copyMovieProperties(res[0]);
        }
      }, 
      () => {
        this.canChange = true;
      },  
      () => {
        this.canChange = true;
    });
  }
  
  private copyMovieProperties(newMovie: Movie): void {
    this.movie.Title = newMovie.Title;
    this.movie.Year = newMovie.Year;
    this.movie.Rated = newMovie.Rated;
    this.movie.Released = newMovie.Released;
    this.movie.Runtime = newMovie.Runtime;
    this.movie.Genre = newMovie.Genre;
    this.movie.Director = newMovie.Director;
    this.movie.Writer = newMovie.Writer;
    this.movie.Actors = newMovie.Actors;
    this.movie.Plot = newMovie.Plot;
    this.movie.Language = newMovie.Language;
    this.movie.Country = newMovie.Country;
    this.movie.Awards = newMovie.Awards;
    this.movie.Poster = newMovie.Poster;
    this.movie.Ratings = newMovie.Ratings;
    this.movie.Metascore = newMovie.Metascore;
    this.movie.imdbRating = newMovie.imdbRating;
    this.movie.imdbVotes = newMovie.imdbVotes;
    this.movie.imdbID = newMovie.imdbID;
    this.movie.Type = newMovie.Type;
    this.movie.DVD = newMovie.DVD;
    this.movie.BoxOffice = newMovie.BoxOffice;
    this.movie.Production = newMovie.Production;
    this.movie.Website = newMovie.Website;
    this.movie.Watched = newMovie.Watched;
    this.movie.Saved = newMovie.Saved;
    this.movie.finalRating = newMovie.finalRating;
    this.movie.stars = newMovie.stars;
    this.movie.background = newMovie.background;
  }
}
