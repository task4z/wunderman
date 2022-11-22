import { Router } from 'express';
import {
  METASCORE,
  MOVIES_TITLES,
  MOVIES_IDS,
} from '@mono-nx-test-with-nextjs/api/constants';
import * as validate from 'validate.js';
import * as upperFirst from 'lodash.upperfirst';
import { MOVIE_TYPE, SERIES_TYPE } from '@mono-nx-test-with-nextjs/api/assets';
import {
  MapOfArtistsHistory,
  MapOfMoviesTitles,
} from '@mono-nx-test-with-nextjs/api/utils';

const router = Router();

export const VALID_MOVIES_TYPES_STRINGS = [MOVIE_TYPE, SERIES_TYPE];

export const LOWER_CASE_TRUE = 'true';
export const LOWER_CASE_FALSE = 'false';
export const VALID_BOOLEAN_STRINGS = [LOWER_CASE_TRUE, LOWER_CASE_FALSE];

type Request = {
  query: {
    type: string;
    year: string;
    metascore: string;
    actor: string;
    director: string;
    genre: string;
    watched: string;
    saved: string;
  };
};

/**
 * It converts a string of elements into an array:
 * "element" => [element]
 * "elem1, elem2, elem3" => [elem1, elem2, elem3]
 * @param {string} str - This can be something like "element" or "elem1, elem2, elem3" etc.
 * @returns {array} - An array with the elements in the original string
 */
const convertStringToArray = (str: string): string[] => [
  ...new Set(str.split(',').map((elem) => elem.trim())),
];

/**
 * It gets the list of movies per single actor/director
 * @param {MapOfArtistsHistory} mapOfPeople - Map of either actors or directors
 * @param {MapOfMoviesTitles} mapOfMovies - Map of movies
 * @param {string} name - Name or either the actor or director
 * @returns {array} -
 */
const getListOfMoviesPerSinglePerson = (
  mapOfPeople: MapOfArtistsHistory,
  mapOfMovies: MapOfMoviesTitles,
  name: string
) => {
  const person = mapOfPeople.get(name.toLowerCase());
  if (person) {
    const { movies } = person;
    if (movies) {
      return movies.reduce((acc, { title }) => {
        const movie = mapOfMovies.get(title.toLowerCase());
        return [...acc, [title, movie]];
      }, []);
    }
  }

  return [];
};

/**
 * It gets the entire list of movies of all the actors/directors
 * @param mapOfPeople - Map of either actors or directors
 * @param mapOfMovies - Map of movies
 * @param people - Array of names of either actors or directors
 */
const getList = (
  mapOfPeople: MapOfArtistsHistory,
  mapOfMovies: MapOfMoviesTitles,
  people: string[]
) => {
  const tempMap = new Map();
  people.forEach((actor) => {
    [
      ...getListOfMoviesPerSinglePerson(mapOfPeople, mapOfMovies, actor),
    ].forEach((elem) => {
      const key = elem[0];
      if (!tempMap.has(key)) {
        tempMap.set(key, elem);
      }
    });
  }, []);

  return [...tempMap].map(([, movie]) => movie);
};

/**
 * It filters the data based on boolean values
 * @param {array} data - The array of data
 * @param {string} value - The value sent to filter by
 * @param {string} property - The name of the property to filter by
 */
const filterBooleanValue = (data, value: string, property: string) => {
  return data.filter(([, movie]) => {
    const paramValue = upperFirst(value);
    const movieValue = movie[property];
    return (
      movieValue === paramValue ||
      (paramValue === 'False' && movieValue === 'undefined')
    );
  });
};

const updateMovieState = (
  mapOfMovies,
  movieId: string,
  propertyName: string,
  propertyValue: string
) => {
  const capitalizedProperty = upperFirst(propertyName);
  const listOfMovies = mapOfMovies.get(MOVIES_TITLES);
  const listOfIds = mapOfMovies.get(MOVIES_IDS);
  const movieTitle = listOfIds.get(movieId);
  const movie = listOfMovies.get(movieTitle);

  if (movie) {
    const updatedMovie = {
      ...movie,
      [capitalizedProperty]: upperFirst(propertyValue),
    };
    listOfMovies.set(movieTitle, updatedMovie);
    return true;
  }

  return false;
};

/**
 * @swagger
 * name: Update Movie's State
 * path:
 *  /api/movies/id/{imdbID}:
 *    put:
 *      summary: Update movie's state for watched and saved
 *      produces: application/json
 *      tags: [Update Movie's State]
 *      parameters:
 *        - in: path
 *          name: imdbID
 *          required: true
 *          description: movie's imdbID
 *          schema:
 *            type: string
 *            example: tt0083658
 *      requestBody:
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              properties:
 *                saved:
 *                  type: string
 *                  enum: [true, false]
 *                  example: "true"
 *                  description: Whether the user has already seen the movie
 *                watched:
 *                  type: string
 *                  enum: [true, false]
 *                  example: "false"
 *                  description: Whether the user has saved the movie in the watch list
 *      responses:
 *        "200":
 *          description: Movie's updated successfully
 *        "412":
 *          description: Precondition failed
 */
router.put('/id/:imdbID', (req, res) => {
  let result = false;
  const { mapOfMovies } = req['context'].maps;

  const { watched, saved } = req.body;
  const { imdbID } = req.params;

  if (
    !validate.isEmpty(saved) &&
    validate({ saved }, { saved: { inclusion: VALID_BOOLEAN_STRINGS } }) == null
  ) {
    result = updateMovieState(mapOfMovies, imdbID, 'saved', saved);
  }

  if (
    !validate.isEmpty(watched) &&
    validate({ watched }, { watched: { inclusion: VALID_BOOLEAN_STRINGS } }) ==
      null
  ) {
    result = updateMovieState(mapOfMovies, imdbID, 'watched', watched);
  }

  return result ? res.sendStatus(200) : res.sendStatus(412);
});

/**
 * @swagger
 * name: Movies
 * path:
 *  /api/movies/:
 *    get:
 *      summary: Get list of all movies
 *      tags: [Movies]
 *      parameters:
 *        - in: query
 *          name: type
 *          schema:
 *            type: string
 *            example: movie
 *          description: Type of movie - (SINGLE 1982 OR MULTIPLE movie,series)
 *        - in: query
 *          name: year
 *          schema:
 *            type: string
 *            example: 1982,1989
 *          description: year of production - (SINGLE 1982 OR MULTIPLE 1982,1989)
 *        - in: query
 *          name: metascore
 *          schema:
 *            type: string
 *            example: 2
 *          description: Metascore value - (SINGLE 2 OR MULTIPLE 0,1,2,3)
 *                       (0 = < 60)
 *                       (1 = Between 60 & 80)
 *                       (2 = Between 80 & 90)
 *                       (3 = > 90)
 *        - in: query
 *          name: actor
 *          schema:
 *            type: string
 *            example: Harrison Ford
 *          description: The actor's name - (SINGLE Harrison Ford OR MULTIPLE Harrison Ford, Michael Parks, Rutger Hauer)
 *        - in: query
 *          name: director
 *          schema:
 *            type: string
 *            example: Ridley Scott
 *          description: The director's name (SINGLE Ridley Scott OR MULTIPLE Akira Kurosawa, Quentin Tarantino)
 *        - in: query
 *          name: genre
 *          schema:
 *            type: string
 *            example: Action
 *          description: The movie's genre (SINGLE Action OR MULTIPLE Action, Thriller, Drama)
 *        - in: query
 *          name: watched
 *          schema:
 *            type: string
 *            enum: [true,false]
 *            example: true
 *          description: Whether the movie has been already seen by the user
 *        - in: query
 *          name: saved
 *          schema:
 *            type: string
 *            enum: [true,false]
 *            example: 'false'
 *          description: Whether the movie has been added to the wishlist
 *      responses:
 *        "200":
 *          description: Movies schema
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *
 */

router.get('/', (req: Request, res) => {
  const {
    type,
    year,
    metascore,
    actor,
    director,
    genre,
    watched,
    saved,
  } = req.query;
  const { mapOfMovies, mapOfActors, mapOfDirectors } = req['context'].maps;

  const listOfMovies = mapOfMovies.get(MOVIES_TITLES);
  let data = [...listOfMovies];

  if (!validate.isEmpty(actor) || !validate.isEmpty(director)) {
    let listOfMoviesWithActorsAndDirectors = [];

    if (!validate.isEmpty(actor) && validate.isString(actor)) {
      const actors = convertStringToArray(actor.trim().toLowerCase());

      listOfMoviesWithActorsAndDirectors = getList(
        mapOfActors,
        listOfMovies,
        actors
      );
    }

    if (!validate.isEmpty(director) && validate.isString(director)) {
      const directors = convertStringToArray(director.trim().toLowerCase());
      listOfMoviesWithActorsAndDirectors =
        listOfMoviesWithActorsAndDirectors.length > 0 // if actors have been filtered already
          ? listOfMoviesWithActorsAndDirectors.filter(([, movie]) =>
              movie.Director.split(',').some((
                currentDirector // filter out the one without chosen directors
              ) => director.includes(currentDirector.trim()))
            )
          : getList(mapOfDirectors, listOfMovies, directors);
    }

    data = [...listOfMoviesWithActorsAndDirectors];
  }

  // Filter by type
  if (
    !validate.isEmpty(type) &&
    validate({ type }, { type: { inclusion: VALID_MOVIES_TYPES_STRINGS } }) ==
      null
  ) {
    const types = convertStringToArray(type.trim().toLowerCase());

    data = data.filter(([, movie]) => types.includes(movie.Type));
  }

  // Filter by year
  if (!validate.isEmpty(year) && validate.isString(year)) {
    const years = convertStringToArray(year);

    data = data.filter(([, movie]) => years.includes(movie.Year));
  }

  // Filter by metascore
  if (!validate.isEmpty(metascore) && validate.isString(metascore)) {
    const metascores = convertStringToArray(metascore);

    const areAllValidScores = metascores.every((meta) => {
      return (
        validate({ meta }, { meta: { inclusion: Object.keys(METASCORE) } }) ==
        null
      );
    });

    if (areAllValidScores) {
      data = metascores.reduce((acc, currValue) => {
        const filteredData = data.filter(([, movie]) =>
          METASCORE[currValue].logic(movie.Metascore)
        );

        return [...acc, ...filteredData];
      }, []);
    }
  }

  // Filter by genre
  if (!validate.isEmpty(genre) && validate.isString(genre)) {
    const genres = convertStringToArray(genre.trim().toLowerCase());

    data = data.filter(([, movie]) =>
      movie.Genre.split(',').some(
        (genre) => genres.indexOf(genre.trim().toLowerCase()) !== -1
      )
    );
  }

  // Filter by watched
  if (
    !validate.isEmpty(watched) &&
    validate({ watched }, { watched: { inclusion: VALID_BOOLEAN_STRINGS } }) ==
      null
  ) {
    data = filterBooleanValue(data, watched, 'Watched');
  }

  // Filter by saved
  if (
    !validate.isEmpty(saved) &&
    validate({ saved }, { saved: { inclusion: VALID_BOOLEAN_STRINGS } }) == null
  ) {
    data = filterBooleanValue(data, saved, 'Saved');
  }

  return res.send(data.map(([, movie]) => movie));
});

/**
 * @swagger
 * name: MovieById
 * path:
 *  /api/movies/id/{imdbID}:
 *    get:
 *      summary: Get specific movie by imdbID
 *      tags: [MovieById]
 *      parameters:
 *      - in: path
 *        name: imdbID
 *        required: true
 *        description: movie's imdbID
 *        schema:
 *          type: string
 *          example: tt0083658
 *      responses:
 *        "200":
 *          description: Movies schema
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *
 */
router.get('/id/:imdbID', (req, res) => {
  const { imdbID } = req.params;
  const { mapOfMovies } = req['context'].maps;

  if (!validate.isEmpty(imdbID) && validate.isString(imdbID)) {
    const listOfMovies = mapOfMovies.get(MOVIES_TITLES);
    const listOfIds = mapOfMovies.get(MOVIES_IDS);
    const movieTitle = listOfIds.get(imdbID);
    const movie = listOfMovies.get(movieTitle);

    if (movie) {
      const data = [[imdbID, movie]];

      return res.send(data.map(([, movie]) => movie));
    }
  }

  return res.send([]);
});

/**
 * @swagger
 * name: MovieByName
 * path:
 *  /api/movies/name/{name}:
 *    get:
 *      summary: Get specific movie by name
 *      tags: [MovieByName]
 *      parameters:
 *      - in: path
 *        name: name
 *        required: true
 *        description: movie's name
 *        schema:
 *          type: string
 *          example: Blade Runner
 *      responses:
 *        "200":
 *          description: Movies schema
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *
 */

router.get('/name/:name', (req, res) => {
  const { name } = req.params;
  const { mapOfMovies } = req['context'].maps;

  const listOfMovies = mapOfMovies.get(MOVIES_TITLES);
  const movieNameLowerCase = name.toLowerCase();
  const movie = listOfMovies.get(movieNameLowerCase);
  if (movie) {
    const data = [[name, movie]];

    return res.send(data.map(([, movie]) => movie));
  }

  return res.send([]);
});

export default router;
