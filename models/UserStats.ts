export interface UserStats {
  id: string;
  user_id: string;
  streaks: number;
  total_exp: number;
  current_league: string;
  top_finishes: number;
  created_at: string;
  updated_at: string;
}

export interface UserStatsUpdate {
  streaks?: number;
  total_exp?: number;
  current_league?: string;
  top_finishes?: number;
}
