import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { environment } from '../../../environments/environment';
import { MockMovieService } from './mock-movie.service';
import { MovieToPatch } from '../models/movie-to-patch.model';
const newMovie = [
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
  }];

describe('MovieService', () => {
  let service: MovieService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]});
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.inject(MovieService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it.only('should be created', () => {
    expect(service).toBeTruthy();
  });

  it.only('should have a getMovies method', () => {
    service.getMovies().subscribe();
    const req = httpTestingController.expectOne(`${environment.url}/movies`);
    expect(req.request.method).toEqual('GET');
  });

  it.only('should have 22 elements',fakeAsync(() => {
    const actualMovies = MockMovieService;
    service.getMovies().subscribe((actualMovies) => {
      expect(actualMovies.length).toBe(22);
    });
    const req = httpTestingController.expectOne(`${environment.url}/movies`);
    req.flush(actualMovies);
    flush();
  }));

  it.only('the result should have stars property equal to [ 1, 1, 1, 1, 0 ]',fakeAsync(() => {
    const actualMovies = MockMovieService;
    service.getMovies().subscribe((actualMovies) => {
      expect(actualMovies[0].stars).toStrictEqual([ 1, 1, 1, 1, 0 ]);
    });
    const req = httpTestingController.expectOne(`${environment.url}/movies`);
    req.flush(actualMovies);
    flush();
  }));

  it.only('the result in the first element should have finalRating property equal to \'4.25\'',fakeAsync(() => {
    const actualMovies = MockMovieService;
    service.getMovies().subscribe((actualMovies) => {
      expect(actualMovies[0].finalRating).toBe('4.25');
    });
    const req = httpTestingController.expectOne(`${environment.url}/movies`);
    req.flush(actualMovies);
    flush();
  }));
  
  it.only('the result in the second element should have stars property equal to [ 1, 1, 1, 0.5, 0 ]',fakeAsync(() => {
    const actualMovies = MockMovieService;
    service.getMovies().subscribe((actualMovies) => {
      expect(actualMovies[1].stars).toStrictEqual([ 1, 1, 1, 0.5, 0 ]);
    });
    const req = httpTestingController.expectOne(`${environment.url}/movies`);
    req.flush(actualMovies);
    flush();
  }));

  it.only('should have a updateWatchlist method', () => {
    const param: MovieToPatch = {
      imdbID: 'tt0083658',
      saved: true,
      watched: true,
    } as MovieToPatch;
    service.updateWatchlist(param).subscribe();
    const req = httpTestingController.expectOne(`${environment.url}/movies/id/${param.imdbID}`);
    expect(req.request.method).toEqual('PUT');
  });

  it.only('should have a getMovieDetail method', () => {
    const imdbID =  'tt0083658';
    service.getMovieDetail(imdbID).subscribe();
    const req = httpTestingController.expectOne(`${environment.url}/movies/id/${imdbID}`);
    expect(req.request.method).toEqual('GET');
  });

  it.only('movie should have background equal to #EEC907', fakeAsync(() => {
    const imdbID =  'tt0083658';
    service.getMovieDetail(imdbID).subscribe((newMovie) => {
      expect(newMovie[0].background).toStrictEqual('#EEC907');
    });
    const req = httpTestingController.expectOne(`${environment.url}/movies/id/${imdbID}`);
    req.flush(newMovie);
    flush();
  }));

  it.only('movie should have background equal to #ED6606', fakeAsync(() => {
    newMovie[0].Saved = 'True';
    newMovie[0].Watched = 'False';
    const imdbID =  'tt0083658';
    service.getMovieDetail(imdbID).subscribe((newMovie) => {
      expect(newMovie[0].background).toStrictEqual('#ED6606');
    });
    const req = httpTestingController.expectOne(`${environment.url}/movies/id/${imdbID}`);
    req.flush(newMovie);
    flush();
  }));

  it.only('movie should have background equal to #049452', fakeAsync(() => {
    newMovie[0].Saved = 'True';
    newMovie[0].Watched = 'True';
    const imdbID =  'tt0083658';
    service.getMovieDetail(imdbID).subscribe((newMovie) => {
      expect(newMovie[0].background).toStrictEqual('#049452');
    });
    const req = httpTestingController.expectOne(`${environment.url}/movies/id/${imdbID}`);
    req.flush(newMovie);
    flush();
  }));

  it.only('seventh movie should have background equal to #FFF', fakeAsync(() => {
    newMovie[0].Saved = 'False';
    newMovie[0].Watched = 'False';
    const imdbID =  'tt0083658';
    service.getMovieDetail(imdbID).subscribe((newMovie) => {
      expect(newMovie[0].background).toStrictEqual('#FFF');
    });
    const req = httpTestingController.expectOne(`${environment.url}/movies/id/${imdbID}`);
    req.flush(newMovie);
    flush();
  }));
});