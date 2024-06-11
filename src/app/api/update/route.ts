import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.API_KEY;

const movieCategoryValidators: { label: string; validator: Function }[] = [
  {
    label: "Starts with 'The'",
    validator: (movie: any) => movie.title.startsWith("The "),
  },
  {
    label: "3 word title",
    validator: (movie: any) => movie.title.trim().split(" ").length === 3,
  },
  {
    label: "2 word title",
    validator: (movie: any) => movie.title.trim().split(" ").length === 2,
  },
  {
    label: "1 word title",
    validator: (movie: any) => movie.title.trim().split(" ").length === 1,
  },
  {
    label: "Released between 2010-2020",
    validator: (movie: any) =>
      new Date(movie.release_date) >= new Date("2010-01-01") &&
      new Date(movie.release_date) <= new Date("2020-12-31"),
  },
  {
    label: "released between 2000-2010",
    validator: (movie: any) =>
      new Date(movie.release_date) >= new Date("2000-01-01") &&
      new Date(movie.release_date) <= new Date("2010-12-31"),
  },
  {
    label: "Released between 1990-2000",
    validator: (movie: any) =>
      new Date(movie.release_date) >= new Date("1990-01-01") &&
      new Date(movie.release_date) <= new Date("2000-12-31"),
  },
  {
    label: "Genre: Action",
    validator: (movie: any) => movie.genre_ids.includes(28),
  },
  {
    label: "Genre: Comedy",
    validator: (movie: any) => movie.genre_ids.includes(35),
  },
  {
    label: "Genre: Drama",
    validator: (movie: any) => movie.genre_ids.includes(18),
  },
];

const genreMap = {
  "12": "Adventure",
  "14": "Fantasy",
  "16": "Animation",
  "18": "Drama",
  "27": "Horror",
  "28": "Action",
  "35": "Comedy",
  "36": "History",
  "37": "Western",
  "53": "Thriller",
  "80": "Crime",
  "99": "Documentary",
  "878": "Science Fiction",
  "9648": "Mystery",
  "10402": "Music",
  "10749": "Romance",
  "10751": "Family",
  "10752": "War",
  "10770": "TV Movie",
};

export async function POST() {

  let actors;
  try {
    actors = await getNewActorData();
  } catch (error) {
    console.error("Failed to get new actor data:", error);
    return new Response("Failed to get new actor data", { status: 500 });
  }

  const selectedValidators = selectValidators(movieCategoryValidators);
  const validMoviesGrid = generateValidMoviesGrid(actors, selectedValidators);
  console.log("validMoviesGrid", validMoviesGrid)
  return new Response(JSON.stringify({ message: "Success", validMoviesGrid }), { status: 200 });
}

async function getNewActorData() {
  const RESULTS_PER_PAGE = 20;
  const TOTAL_RESULTS = 200;
  const TOTAL_PAGES = Math.ceil(TOTAL_RESULTS / RESULTS_PER_PAGE);
  //fetch 200 most popular actors
  let allActors: any[] = [];
  try {
    for (let page = 1; page <= TOTAL_PAGES; page++) {
      const url = `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&page=${page}`;
      const response = await fetch(url);
      const data = await response.json();
      allActors = allActors.concat(data.results);
    }
  } catch (error) {
    console.error("Error fetching data from TMDB", error);
    return new Error("Error fetching data from TMDB");
  }
  //choose three random actorrs
  const selectedActors: any = {};
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * allActors.length);
    selectedActors[allActors[randomIndex].name] = {
      id: allActors[randomIndex].id,
      profile_path: allActors[randomIndex].profile_path,
    };
  }
  //get movie list for selected actors
  for (const actor in selectedActors) {
    const url = `https://api.themoviedb.org/3/person/${selectedActors[actor].id}/movie_credits?api_key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    selectedActors[actor].movies = data.cast;
  }

  return selectedActors;
}


function selectValidators(
  movieCategoryValidators: { label: string; validator: Function }[]
) {
  const selectedValidators: Function[] = [];
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(
      Math.random() * movieCategoryValidators.length
    );
    selectedValidators.push(movieCategoryValidators[randomIndex].validator);
  }
  return selectedValidators;
}

function generateValidMoviesGrid(actors: any, selectedValidators: Function[]) {
  const actorArray = Object.keys(actors);
  const validMoviesGrid = new Array(3);
  for (let i = 0; i < 3; i++) {
    validMoviesGrid[i] = new Array(3);
    for (let j = 0; j < 3; j++) {
      validMoviesGrid[i][j] = new Set(
        actors[actorArray[i]].movies.filter((movie: any) =>
          selectedValidators[j](movie)
        )
      );
    }
  }
  return validMoviesGrid;
}
