export interface EpisodeOverviewCategory {
  _id: string;
  anMinutes: number;
  inRoomMinutes: number;
  episodes: number;
}

export interface EpisodeOverview {
  _id: string;
  anMinutes: number;
  inRoomMinutes: number;
  episodes: number;
  categories: EpisodeOverviewCategory[];
}

export interface EpisodeOverviewResult {
  result: EpisodeOverview;
}
