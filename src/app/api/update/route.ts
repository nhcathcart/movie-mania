import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
import { createClient } from '@supabase/supabase-js'
import { idText } from "typescript";

// Create a single supabase client for interacting with your database
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export const movieCategoryValidators: { label: string; validator: Function }[] = [
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

export const genreMap = {
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
    return new NextResponse("Failed to get new actor data", { status: 500 });
  }
  if (actors instanceof Error) return new NextResponse(actors.message, { status: 500 });
  const selectedValidators = selectValidators(movieCategoryValidators);
  const validMoviesGrid = generateValidMoviesGrid(actors, selectedValidators);
  let rowLabelsToInsert = actors?.map((actor: any, index: number) => {
    return {
        row_index: index,
        actor_name: actor.name,
        image_url: actor.profile_path
    }
  })
  const columnLabelsToInsert = selectedValidators.map((validator: any, index: number) => {
    return {
        column_index: index,
        description: validator.label
    }
  })

  await supabase.from('movies').delete().neq('id', -1)
  await supabase.from('grid_movies').delete().neq('id', -1)
  await supabase.from('row_labels').delete().neq('id', -1)
  await supabase.from('column_labels').delete().neq('id', -1)
  await supabase.from('row_labels').insert(rowLabelsToInsert)
  await supabase.from('column_labels').insert(columnLabelsToInsert);
  
  for (let i=0; i<validMoviesGrid.length; i++) {
    for (let j=0; j<validMoviesGrid[i].length; j++) {
        
        const movieArrayToInsert = validMoviesGrid[i][j].map((movie: any) => {
            return {
                id: movie.id,
                title: movie.title,
                image_url: movie.poster_path,
                genre: movie.genre_ids
            }
        })
      const {data, error} = await supabase.from('movies').insert(movieArrayToInsert)
      const gridRes = await supabase.from('grid').select('*').eq('row', i).eq('column', j).limit(1)
      .single()
      
      const gridMoviesToInsert = movieArrayToInsert.map((movie: any) => {
        return {
            grid_id: gridRes?.data.id,
            movie_id: movie.id
        }
      })
      const gridMovieRes = await supabase.from('grid_movies').insert(gridMoviesToInsert)
      
    }
  }
  return NextResponse.json({ status: 200 });
}

export async function getNewActorData() {
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
  //limit to actors with works in english
  const englishActors: any[] = [];
  for (const actor of allActors) {
    try {
      const url = `https://api.themoviedb.org/3/person/${actor.id}/movie_credits?api_key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      const knownWorks = data.cast.concat(data.crew); // Combine cast and crew works
      const hasEnglishWork = knownWorks.some((work: any) => work.original_language === 'en');
      
      if (hasEnglishWork) {
        englishActors.push(actor);
      }
    } catch (error) {
      console.error(`Error fetching known works for actor ${actor.id}:`, error);
    }
  }
  
  //choose three random actorrs
  const selectedActors: any[] = [];
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * englishActors.length);
    selectedActors.push({
      name: englishActors[randomIndex].name,
      id: englishActors[randomIndex].id,
      profile_path: englishActors[randomIndex].profile_path,
    });
  }
  
  //get movie list for selected actors
  for (const actor of selectedActors) {
    const url = `https://api.themoviedb.org/3/person/${actor.id}/movie_credits?api_key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    actor.movies = data.cast;
  }
  
  return selectedActors;
}


export function selectValidators(
  movieCategoryValidators: { label: string; validator: Function }[]
) {
  const selectedValidators: {label: string; validator: Function; }[] = [];
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(
      Math.random() * movieCategoryValidators.length
    );
    selectedValidators.push(movieCategoryValidators[randomIndex]);
  }
  return selectedValidators;
}

export function generateValidMoviesGrid(actors: any, selectedValidators: {label: string; validator: Function}[]) {
  
  const validMoviesGrid = new Array(3);
  for (let i = 0; i < 3; i++) {
    validMoviesGrid[i] = new Array(3);
    for (let j = 0; j < 3; j++) {
      validMoviesGrid[i][j] = 
        actors[i].movies.filter((movie: any) =>
          selectedValidators[j].validator(movie)
        )
      ;
    }
  }
  return validMoviesGrid;
}

// export function generateValidMoviesGrid(actors: any) {
//   let selectedValidators;
//   let validMoviesGrid;

//   do {
//     selectedValidators = generateSelectedValidators();

//     validMoviesGrid = new Array(3);
//     for (let i = 0; i < 3; i++) {
//       validMoviesGrid[i] = new Array(3);
//       for (let j = 0; j < 3; j++) {
//         validMoviesGrid[i][j] = actors[i].movies.filter((movie: any) =>
//           selectedValidators[j].validator(movie)
//         );
//       }
//     }
//   } while (!validMoviesGrid.every((row: any) => row.every((cell: any) => cell.length > 0)));

//   return { validMoviesGrid, selectedValidators };
// }