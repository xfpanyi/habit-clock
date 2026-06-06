import { create } from 'zustand';
import type { UserRole, Theme } from '@/types';
import { getUserRole, setUserRole, getTheme, setTheme, getSelectedChildId, setSelectedChildId, getParentPassword, setParentPassword } from '@/utils/storage';
import { hashPassword, verifyPassword } from '@/utils/crypto';
import { DEFAULT_PARENT_PASSWORD } from '@/utils/constants';

interface AppState {
  userRole: UserRole;
  selectedChildId: string | null;
  theme: Theme;
  isAuthenticated: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;

  init: () => void;
  setUserRole: (role: UserRole) => void;
  setSelectedChild: (childId: string | null) => void;
  setTheme: (theme: Theme) => void;
  loginAsParent: (password: string) => boolean;
  logout: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  userRole: null,
  selectedChildId: null,
  theme: 'boy',
  isAuthenticated: false,
  toast: null,

  init: () => {
    const savedRole = getUserRole() as UserRole;
    const savedChildId = getSelectedChildId();
    const savedTheme = getTheme() as Theme;
    const savedPassword = getParentPassword();

    if (!savedPassword) {
      setParentPassword(hashPassword(DEFAULT_PARENT_PASSWORD));
    }

    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'boy');
    }

    set({
      userRole: savedRole,
      selectedChildId: savedChildId,
      theme: savedTheme || 'boy',
      isAuthenticated: false,
    });
  },

  setUserRole: (role) => {
    setUserRole(role || '');
    set({ userRole: role });
  },

  setSelectedChild: (childId) => {
    if (childId) {
      setSelectedChildId(childId);
    } else {
      localStorage.removeItem('selectedChildId');
    }
    set({ selectedChildId: childId });
  },

  setTheme: (theme) => {
    setTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },

  loginAsParent: (password) => {
    const savedPassword = getParentPassword();
    const targetHash = savedPassword || hashPassword(DEFAULT_PARENT_PASSWORD);
    if (verifyPassword(password, targetHash)) {
      set({ isAuthenticated: true, userRole: 'parent' });
      setUserRole('parent');
      return true;
    }
    return false;
  },

  logout: () => {
    set({ userRole: null, isAuthenticated: false, selectedChildId: null });
    localStorage.removeItem('userRole');
    localStorage.removeItem('selectedChildId');
  },

  showToast: (message, type = 'info') => {
    set({ toast: { message, type } });
    setTimeout(() => {
      if (get().toast?.message === message) {
        set({ toast: null });
      }
    }, 2500);
  },

  hideToast: () => {
    set({ toast: null });
  },
}));
