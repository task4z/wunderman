import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MovieToPatch } from '../shared/models/movie-to-patch.model';
import { Movie } from '../shared/models/movie.model';
import { MovieService } from '../shared/services/movie.service';

import { MovieCardComponent } from './movie-card.component';

describe('MovieCardComponent', () => {
  let component: MovieCardComponent;
  let fixture: ComponentFixture<MovieCardComponent>;

  const mockAPIService = {
    updateWatchlist: jest.fn(),
    getMovieDetail: jest.fn(),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ MovieCardComponent ],
      providers: [ 
        { provide: MovieService, useValue: mockAPIService }
      ],
    })
    .compileComponents();
    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;
    component.movie = movie;
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
    mockAPIService.updateWatchlist.mockReset();
  });

  it.only('should create', () => {
    expect(component).toBeTruthy();
  });

  it.only('should change watched value', () => {
    mockAPIService.getMovieDetail.mockImplementationOnce(() => of([]));
    expect(component).toBeTruthy();
  });

  it.only('should call changeSaved method', () => {
    movie.Watched = param.watched ? 'True':'False';
    movie.Saved = param.saved ? 'True':'False';
    mockAPIService.updateWatchlist.mockImplementationOnce(() => of('OK'));
    mockAPIService.getMovieDetail.mockImplementationOnce(() => of([movie]));
    component.changeSaved();
    expect(component.movie).toStrictEqual(movie);
  });

  it.only('should call changeSaved method and update canChange', () => {
    movie.Watched = param.watched ? 'True':'False';
    movie.Saved = param.saved ? 'True':'False';
    mockAPIService.updateWatchlist.mockImplementationOnce(() => of('OK'));
    mockAPIService.getMovieDetail.mockImplementationOnce(() => throwError(null));
    component.changeSaved();
    expect(component.canChange).toStrictEqual(true);
  });

  it.only('should call changeWatch method', () => {
    movie.Watched = param.watched ? 'True':'False';
    movie.Saved = param.saved ? 'True':'False';
    mockAPIService.updateWatchlist.mockImplementationOnce(() => of('OK'));
    mockAPIService.getMovieDetail.mockImplementationOnce(() => of([movie]));
    component.changeWatch();
    expect(component.movie).toStrictEqual(movie);
  });

  it.only('should call changeWatch method and update canChange', () => {
    movie.Watched = param.watched ? 'True':'False';
    movie.Saved = param.saved ? 'True':'False';
    mockAPIService.updateWatchlist.mockImplementationOnce(() => throwError(null));
    mockAPIService.getMovieDetail.mockImplementationOnce(() => of([movie]));
    component.changeWatch();
    expect(component.canChange).toStrictEqual(true);
  });
});

const param: MovieToPatch = {
  imdbID: 'tt0083658',
  saved: true,
  watched: true,
} as MovieToPatch;
const movie: Movie = 
  {
      Actors: 'Harrison Ford, Rutger Hauer, Sean Young, Edward James Olmos',
      Awards: 'Nominated for 2 Oscars. Another 12 wins & 16 nominations.',
      BoxOffice: 'N/A',
      Country: 'USA',
      DVD: '27 Aug 1997',
      Director: 'Ridley Scott',
      Genre: 'Action, Sci-Fi, Thriller',
      Language: 'English, German, Cantonese, Japanese, Hungarian, Arabic',
      Metascore: '84',
      Plot:
          'A blade runner must pursue and terminate four replicants who stole a ship in space, and have returned to Earth to find their creator.',
      Poster:
          'https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
      Production: 'Warner Bros. Pictures',
      Rated: 'R',
      Ratings: [
          {
              Source: 'Internet Movie Database',
              Value: '8.1/10',
          },
          {
              Source: 'Rotten Tomatoes',
              Value: '90%',
          },
          {
              Source: 'Metacritic',
              Value: '84/100',
          },
      ],
      Released: '25 Jun 1982',
      Runtime: '117 min',
      Saved: 'False',
      Title: 'Blade Runner',
      Type: 'movie',
      Watched: 'True',
      Website: 'N/A',
      Writer:
          'Hampton Fancher (screenplay), David Webb Peoples (screenplay), Philip K. Dick (novel)',
      Year: '1982',
      imdbID: 'tt0083658',
      imdbRating: '8.1',
      imdbVotes: '663,604',
  } as Movie;