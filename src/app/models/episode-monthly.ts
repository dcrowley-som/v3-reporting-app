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

export interface EpisodeTableMonth {
  year: number,
  month: number
  anMinutes: number;
  inRoomMinutes: number;
  episodes: number;
}

export interface EpisodeTable {
  _id: {
    category: string,
  };
  anMinutes: number;
  inRoomMinutes: number;
  episodes: number;
  year: number;
  month: number;
  months: EpisodeMonthly[];
}
