"use server";

const movieCategories = [
  {'Starts with "The"': function isValid(movie: any) { return movie.title.startsWith("The"); }},
  {"3 word title" : function isValid(movie: any) { return movie.title.split(" ").length === 3; }},
  {"2 word title" : function isValid(movie: any) { return movie.title.split(" ").length === 2; }},
  {"1 word title" : function isValid(movie: any) { return movie.title.split(" ").length === 1; }},
  {"Released between 2010-2020" : function isValid(movie: any) { return movie.release_date >= "2010-01-01" && movie.release_date <= "2020-12-31"; }},
  {"released between 2000-2010" : function isValid(movie: any) { return movie.release_date >= "2000-01-01" && movie.release_date <= "2010-12-31"; }},
  {"Released between 1990-2000" : function isValid(movie: any) { return movie.release_date >= "1990-01-01" && movie.release_date <= "2000-12-31"; }},
  {"Genre: Action" : function isValid(movie: any) { return movie.genre_ids.includes(28); }},
  {"Genre: Comedy" : function isValid(movie: any) { return movie.genre_ids.includes(35); }},
  {"Genre: Drama" : function isValid(movie: any) { return movie.genre_ids.includes(18); }},
]
export async function getPopularActors() {
  const API_KEY = process.env.API_KEY;
  const RESULTS_PER_PAGE = 20;
  const TOTAL_RESULTS = 200;
  const TOTAL_PAGES = Math.ceil(TOTAL_RESULTS / RESULTS_PER_PAGE);
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
  //get movie list for random actors
  for (const actor in selectedActors) {
    const url = `https://api.themoviedb.org/3/person/${selectedActors[actor].id}/movie_credits?api_key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    selectedActors[actor].movies = data.cast;
  }
  // console.dir(selectedActors, {depth: null});
  //get genres
  const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
  const genreResponse = await fetch(genreUrl);
  const genreData = await genreResponse.json();

  // Map genre IDs to genre names
  const genreMap: any = {};
  genreData.genres.forEach((genre:any) => {
    genreMap[genre.id] = genre.name;
  });
  console.log(genreMap)
}
