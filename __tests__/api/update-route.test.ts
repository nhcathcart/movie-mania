import {
  generateValidMoviesGrid,
} from "../../src/app/api/update/route";
import { jest, test, expect } from "@jest/globals";

describe("update route", () => {
  test("generateValidMoviesGrid", () => {
    const actors = [
      {
        adult: false,
        backdrop_path: "/qr4Bv2JPFHiTGbYIf3NaNtX68w8.jpg",
        genre_ids: [18, 10749],
        id: 719495,
        original_language: "ja",
        original_title: "佐藤家の朝食、鈴木家の夕食",
        overview:
          "High school student Takumi lives with his two mothers in a beautiful house in Tokyo. Moving into a house across the street is Sora and her two fathers. One day Takumi and Sora begin a quest to seek answers long hidden and silent in their unconventional families. Takumi sets out to determine the identity of his father, and Sora devises a plan to integrate herself fully into her family. The ordeals of these households stretch the traditional notions of family, convention and tradition.",
        popularity: 3.519,
        poster_path: "/3PUstoQiSKv3RF6tCdH6L9ieN05.jpg",
        release_date: "2013-01-28",
        title: "Breakfast and Dinner",
        video: false,
        vote_average: 5.2,
        vote_count: 3,
        character: "Sato Takumi",
        credit_id: "5fafe1a3e24e3a0040e5ec79",
        order: 0,
      },
      {
        adult: false,
        backdrop_path: "/1Ju8s25F6l1K1cQRU2mHaODQvzj.jpg",
        genre_ids: [28, 12, 10752],
        id: 961420,
        original_language: "ja",
        original_title: "キングダム2 遥かなる大地へ",
        overview:
          "It follows a young man who dreams of becoming a general and Ying Zheng, whose goal is unification.",
        popularity: 23.898,
        poster_path: "/wE4NqJosSPjiyqStBEv67mQbR1b.jpg",
        release_date: "2022-07-15",
        title: "Kingdom 2: Far and Away",
        video: false,
        vote_average: 7.131,
        vote_count: 84,
        character: "Li Xin",
        credit_id: "6254849a79b3d40069775540",
        order: 0,
      },
      {
        adult: false,
        backdrop_path: "/9ZlGiEKmcYrrxmiQEJDhjeT2kEW.jpg",
        genre_ids: [28, 12, 10752],
        id: 1061181,
        original_language: "ja",
        original_title: "キングダム 運命の炎",
        overview:
          "To defend their kingdom against a sudden invasion, a mighty general returns to the battlefield alongside a war orphan, now grown up, who dreams of glory.",
        popularity: 36.204,
        poster_path: "/7cIqNt2YPK1nCf904NFISEScCzk.jpg",
        release_date: "2023-07-28",
        title: "Kingdom III: The Flame of Destiny",
        video: false,
        vote_average: 7.552,
        vote_count: 106,
        character: "Li Xin",
        credit_id: "6399713dce9e9100e694b6b8",
        order: 0,
      },
      {
        adult: false,
        backdrop_path: "/jaRoloTuVFYYvBH5VlRBQnf2egx.jpg",
        genre_ids: [28, 12, 35],
        id: 1171462,
        original_language: "ja",
        original_title: "ゴールデンカムイ",
        overview:
          "On the Hokkaido frontier, a war veteran and Ainu girl race against misfits and military renegades to find treasure mapped out on tattooed outlaws.",
        popularity: 180.187,
        poster_path: "/sLcRGIJqlJeoGGk88CtA8Ida5aq.jpg",
        release_date: "2024-01-19",
        title: "Golden Kamuy",
        video: false,
        vote_average: 6.7,
        vote_count: 30,
        character: "Saichi Sugimoto",
        credit_id: "64ee8e7e4b0c6300abaa148d",
        order: 0,
      },
    ];
    const selectedValidators: any = [];

    const validMoviesGrid = generateValidMoviesGrid(actors, selectedValidators);

    expect(validMoviesGrid).toEqual([
      [new Set(["Movie 1"]), new Set(["Movie 2"]), new Set(["Movie 3"])],
      [new Set(), new Set(["Movie 2"]), new Set(["Movie 3"])],
      [new Set(), new Set(), new Set(["Movie 3"])],
    ]);
  });
});
