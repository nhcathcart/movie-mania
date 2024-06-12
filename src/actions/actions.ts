"use server";

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const API_KEY = process.env.API_KEY;
export async function getGrid() {
  const rowRes = await supabase.from("row_labels").select("*");
  const colRes = await supabase.from("column_labels").select("*");
  if (rowRes.error || colRes.error)
    throw new Error("Failed to fetch grid data");
  const rows = rowRes.data;
  const cols = colRes.data;
  rows.sort((a, b) => a.row_index - b.row_index);
  cols.sort((a, b) => a.column_index - b.column_index);
  return { rows, cols };
}

export async function getSuggestions(queryString: string){
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=${queryString}&page=1`
  );
  const data = await res.json();
  const returnArray: string[] = data.results.map((movie: any) => {
    return (
      movie.title
    )
  })
  const uniqueReturnArray = Array.from(new Set(returnArray));
  return uniqueReturnArray;;
}