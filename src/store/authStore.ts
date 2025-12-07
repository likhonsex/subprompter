import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  credibilityScore: number;
  followerCount: number;
  followingCount: number;
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  handle: string;
}

const USERS_STORAGE_KEY = 'subprompter_users';

const getStoredUsers = (): Record<string, { user: AuthUser; password: string }> => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveUser = (email: string, password: string, user: AuthUser) => {
  const users = getStoredUsers();
  users[email.toLowerCase()] = { user, password };
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const generateId = () => Math.random().toString(36).substring(2, 15);

const generateAvatar = (name: string) => {
  const colors = ['3b82f6', '8b5cf6', 'ec4899', '10b981', 'f59e0b', 'ef4444'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=128`;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        await new Promise(resolve => setTimeout(resolve, 800));
        const users = getStoredUsers();
        const userData = users[email.toLowerCase()];
        if (!userData) {
          set({ isLoading: false, error: 'No account found with this email' });
          return false;
        }
        if (userData.password !== password) {
          set({ isLoading: false, error: 'Incorrect password' });
          return false;
        }
        set({ user: userData.user, isAuthenticated: true, isLoading: false, error: null });
        return true;
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        await new Promise(resolve => setTimeout(resolve, 1000));
        const users = getStoredUsers();
        if (users[data.email.toLowerCase()]) {
          set({ isLoading: false, error: 'An account with this email already exists' });
          return false;
        }
        const handleTaken = Object.values(users).some(
          u => u.user.handle.toLowerCase() === data.handle.toLowerCase()
        );
        if (handleTaken) {
          set({ isLoading: false, error: 'This handle is already taken' });
          return false;
        }
        const newUser: AuthUser = {
          id: generateId(),
          email: data.email,
          name: data.name,
          handle: data.handle,
          avatar: generateAvatar(data.name),
          bio: '',
          credibilityScore: 50,
          followerCount: 0,
          followingCount: 0,
          createdAt: new Date().toISOString()
        };
        saveUser(data.email, data.password, newUser);
        set({ user: newUser, isAuthenticated: true, isLoading: false, error: null });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      clearError: () => {
        set({ error: null });
      },

      updateProfile: (data: Partial<AuthUser>) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...data };
          set({ user: updatedUser });
          const users = getStoredUsers();
          if (users[user.email.toLowerCase()]) {
            users[user.email.toLowerCase()].user = updatedUser;
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
          }
        }
      }
    }),
    {
      name: 'subprompter-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
