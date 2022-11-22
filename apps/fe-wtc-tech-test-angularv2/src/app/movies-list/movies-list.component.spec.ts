import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MovieService } from '../shared/services/movie.service';
import { MoviesListComponent } from './movies-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockMovieService } from '../shared/services/mock-movie.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MoviesListComponent', () => {
  
  let component: MoviesListComponent;
  let fixture: ComponentFixture<MoviesListComponent>;

  const mockAPIService = {
    getMovies: jest.fn()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ 
        MoviesListComponent,
      ],
      providers: [ 
        { provide: MovieService, useValue: mockAPIService }
      ],
      schemas: [ NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(MoviesListComponent);
    component = fixture.componentInstance;
  }));

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
    mockAPIService.getMovies.mockReset();
  });

  it('should create', () => {
    mockAPIService.getMovies.mockImplementationOnce(() => of([]));
    expect(component).toBeTruthy();
  });

  it('should call onInit', () => {
    mockAPIService.getMovies.mockImplementationOnce(() => of([]));
    jest.spyOn(component, 'ngOnInit');
    fixture.detectChanges();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should have 0 movies', () => {
    mockAPIService.getMovies.mockImplementationOnce(() => of([]));
    expect(component.movies).toEqual([]);
    expect(component.movies.length).toEqual(0);
  });

  it('should have 22 movies', fakeAsync(() => {
    mockAPIService.getMovies.mockImplementationOnce(() => of(MockMovieService));
    tick();
    fixture.detectChanges();
    expect(component.movies).toEqual(MockMovieService);
    expect(component.movies.length).toEqual(MockMovieService.length);
  }));

  it('should have 0 movies when error thrown', fakeAsync(() => {
    mockAPIService.getMovies.mockImplementationOnce(() => throwError(null));
    tick();
    fixture.detectChanges();
    expect(component.movies).toEqual([]);
    expect(component.movies.length).toEqual(0);
  }));

});