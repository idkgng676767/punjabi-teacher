import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
  token: string;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  type: 'unit' | 'lesson';
  letters?: Array<{
    id: number;
    character: string;
    transliteration: string;
    pronunciation: string;
    exampleWord: string;
    exampleMeaning: string;
    audioUrl?: string;
  }>;
  phrases?: Array<{
    id: number;
    punjabi: string;
    transliteration: string;
    english: string;
    pronunciationTip: string;
    audioUrl?: string;
    culturalNote?: string;
  }>;
  numbers?: Array<{
    punjabi: string;
    transliteration: string;
    english: string;
    pronunciation: string;
  }>;
  words?: Array<{
    punjabi: string;
    transliteration: string;
    english: string;
    pronunciation: string;
  }>;
}

interface LeaderboardEntry {
  id: number;
  name: string;
  xp: number;
  level: number;
  streak: number;
  totalLessonsCompleted: number;
}

interface State {
  user: User | null;
  lessons: Lesson[] | null;
  lessonDetail: Lesson | null;
  leaderboard: LeaderboardEntry[] | null;
  profile: User | null; // We'll reuse User for profile, but it might have extra fields
  isLoading: boolean;
  error: string | null;
}

interface Actions {
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchLessons: () => Promise<void>;
  fetchLesson: (id: number) => Promise<void>;
  completeLesson: (lessonId: number) => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  clearError: () => void;
}

export const useStore = create<State & Actions>((set, get) => ({
  user: null,
  lessons: null,
  lessonDetail: null,
  leaderboard: null,
  profile: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      // Assuming the backend returns { user: { id, name, email }, token }
      const user = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        token: data.token,
      };
      set({ user, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      const user = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        token: data.token,
      };
      set({ user, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({ user: null, lessons: null, lessonDetail: null, leaderboard: null, profile: null });
  },

  fetchLessons: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5001/api/lessons');
      if (!response.ok) {
        throw new Error('Failed to fetch lessons');
      }
      const data: Lesson[] = await response.json();
      set({ lessons: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchLesson: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:5001/api/lessons/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch lesson');
      }
      const data: Lesson = await response.json();
      set({ lessonDetail: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  completeLesson: async (lessonId: number) => {
    const { user } = get();
    if (!user) throw new Error('User not logged in');

    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5001/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: *** ${user.token}`,
        },
        body: JSON.stringify({ lessonId: lessonId, xpEarned: 10, lessonCompleted: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to complete lesson');
      }

      set({ isLoading: false });
      // Optionally, we could refetch the lesson to update its state, but we'll just rely on the component to show success and go back.
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5001/api/leaderboard', {
        headers: {
          Authorization: *** ${get().user?.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const data: LeaderboardEntry[] = await response.json();
      set({ leaderboard: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) throw new Error('User not logged in');

    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5001/api/profile', {
        headers: {
          Authorization: *** ${user.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data: User = await response.json(); // Assuming the backend returns the user object
      set({ profile: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));