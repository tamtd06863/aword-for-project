export interface Root {
  id: string;
  root_code: string;
  root_meaning: string;
  word_count: number;
}

export interface RootResponse {
  data: Root[];
}
