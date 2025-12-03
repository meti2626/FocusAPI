import { Note, Flashcard, Video, UserProfile } from '../types';

const STORAGE_KEYS = {
  NOTES: 'focuslearn_notes',
  FLASHCARDS: 'focuslearn_flashcards',
  SAVED_VIDEOS: 'focuslearn_saved_videos',
  PROFILE: 'focuslearn_profile'
};

// Initial Mock Profile
const DEFAULT_PROFILE: UserProfile = {
  name: "Learner",
  totalMinutesLearned: 120,
  topicsCompleted: 5,
  streakDays: 3
};

export const StorageService = {
  // --- Profile ---
  getProfile: (): UserProfile => {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : DEFAULT_PROFILE;
  },

  updateProfile: (updates: Partial<UserProfile>) => {
    const current = StorageService.getProfile();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    return updated;
  },

  // --- Notes ---
  getNotes: (videoId?: string): Note[] => {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    const notes: Note[] = data ? JSON.parse(data) : [];
    if (videoId) {
      return notes.filter(n => n.videoId === videoId);
    }
    return notes;
  },

  saveNote: (note: Note) => {
    const notes = StorageService.getNotes();
    const index = notes.findIndex(n => n.id === note.id);
    if (index >= 0) {
      notes[index] = note;
    } else {
      notes.push(note);
    }
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  deleteNote: (id: string) => {
    const notes = StorageService.getNotes();
    const filtered = notes.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(filtered));
  },

  // --- Saved Videos (Library) ---
  getSavedVideos: (): Video[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_VIDEOS);
    return data ? JSON.parse(data) : [];
  },

  toggleSaveVideo: (video: Video) => {
    const saved = StorageService.getSavedVideos();
    const exists = saved.find(v => v.youtubeId === video.youtubeId);
    let newSaved;
    if (exists) {
      newSaved = saved.filter(v => v.youtubeId !== video.youtubeId);
    } else {
      newSaved = [video, ...saved];
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_VIDEOS, JSON.stringify(newSaved));
    return !exists;
  },

  isVideoSaved: (youtubeId: string): boolean => {
    const saved = StorageService.getSavedVideos();
    return saved.some(v => v.youtubeId === youtubeId);
  },

  // --- Flashcards ---
  getFlashcards: (videoId?: string): Flashcard[] => {
    const data = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    const cards: Flashcard[] = data ? JSON.parse(data) : [];
    if (videoId) {
      return cards.filter(c => c.videoId === videoId);
    }
    return cards;
  },

  saveFlashcards: (newCards: Flashcard[]) => {
    const current = StorageService.getFlashcards();
    const updated = [...current, ...newCards];
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(updated));
  }
};