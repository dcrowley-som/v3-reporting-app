export interface EpisodeCountCategory {
  _id: string;
  anMinutes: number;
  inRoomMinutes: number;
  episodes: number;
}

export interface EpisodeCount {
  _id: string;
  anMinutes: number;
  inRoomMinutes: number;
  episodes: number;
  categories: EpisodeCountCategory[];
}

export interface EpisodeCountResult {
  result: EpisodeCount[];
}
