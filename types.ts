export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  channelTitle: string;
  thumbnailUrl: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
}

export interface Note {
  id: string;
  videoId: string;
  videoTitle: string;
  content: string;
  lastUpdated: number;
}

export interface Flashcard {
  id: string;
  videoId: string;
  front: string;
  back: string;
  status: 'new' | 'learning' | 'mastered';
}

export interface SearchResult {
  videos: Video[];
}

export interface UserProfile {
  name: string;
  totalMinutesLearned: number;
  topicsCompleted: number;
  streakDays: number;
}