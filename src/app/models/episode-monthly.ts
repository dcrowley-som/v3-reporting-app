export interface EpisodeMonthlyCategory {
  category: string;
  anMinutes: number;
  inRoomMinutes: number;
  episodes: number;
}

export interface EpisodeMonthly {
  _id: {
    year: number;
    month: number;
  };
  anMinutes: number;
  inRoomMinutes: number;
  episodes: number;
  categories: EpisodeMonthlyCategory[];
}

export interface EpisodeMonthlyResult {
  result: EpisodeMonthly[];
}
