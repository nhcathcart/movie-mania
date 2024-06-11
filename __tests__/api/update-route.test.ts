import {
  fetchData,
  fetchPopularActors,
  selectRandomActors,
  fetchMovieCreditsForActors,
  getNewActorData,
  selectValidators,
  generateValidMoviesGrid,
  movieCategoryValidators
} from "../../src/app/api/update/route";
import { jest, test, expect } from "@jest/globals";


describe("update route", () => {
  test("generateValidMoviesGrid", () => {
    const actors = {
      'Actor 1': { movies: ['Movie 1', 'Movie 2', 'Movie 3'] },
      'Actor 2': { movies: ['Movie 2', 'Movie 3', 'Movie 4'] },
      'Actor 3': { movies: ['Movie 3', 'Movie 4', 'Movie 5'] },
    };
    const selectedValidators = [
      
    ];

    const validMoviesGrid = generateValidMoviesGrid(actors, selectedValidators);

    expect(validMoviesGrid).toEqual([
      [new Set(['Movie 1']), new Set(['Movie 2']), new Set(['Movie 3'])],
      [new Set(), new Set(['Movie 2']), new Set(['Movie 3'])],
      [new Set(), new Set(), new Set(['Movie 3'])],
    ]);
  });
});
