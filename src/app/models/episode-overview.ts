export interface EpisodeOverviewCategory {
  category: string;
  anMinutes: number;
  inRoomMinutes: number;
  episodes: number;
}

export interface EpisodeOverview {
  _id: {
    year: number;
    month: number;
  };
  anMinutes: number;
  inRoomMinutes: number;
  episodes: number;
  categories: EpisodeOverviewCategory[];
}

export interface EpisodeOverviewResult {
  result: EpisodeOverview[];
}

export interface EpisodeTableMonth {
  year: number,
  month: number
  anMinutes: number;
  inRoomMinutes: number;
  episodes: number;
}

export interface EpisodeOverviewTable {
  _id: {
    category: string,
  };
  anMinutes: number;
  inRoomMinutes: number;
  episodes: number;
  year: number;
  month: number;
  months: EpisodeOverview[];
}
