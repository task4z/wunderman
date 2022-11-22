import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Movie } from '../shared/models/movie.model';
import { MovieService } from '../shared/services/movie.service';

@Component({
  selector: 'mono-nx-test-with-nextjs-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.css']
})
export class MoviesListComponent implements OnInit {

  public movies: Movie[] = [];
  private onDestroy$:Subject<void> = new Subject<void>();
  
  constructor(private movieService: MovieService) { }

  public ngOnInit(): void {
    this.getMovies();
  }
  
  public ngOnDestroy(): void{
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private getMovies(): void{
    this.movieService.getMovies().pipe(takeUntil(this.onDestroy$)).subscribe((res: Movie[])=>{
      if(res.length){
        this.movies = res;
      } else {
        this.movies = [];
      }
    }, () =>{
      this.movies = [];
    });
  }

}
