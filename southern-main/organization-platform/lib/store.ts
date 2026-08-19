import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeSettings {
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
  fontFamily: string;
}

interface Admin {
  id: string;
  email: string;
  fullName: string;
  imageUrl?: string;
}

interface AppState {
  // Theme
  theme: ThemeSettings;
  setTheme: (theme: Partial<ThemeSettings>) => void;

  // Admin authentication
  admin: Admin | null;
  setAdmin: (admin: Admin | null) => void;
  isAuthenticated: boolean;

  // UI State
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // Notifications
  notification: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  };
  showNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  hideNotification: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Default theme
      theme: {
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
        primaryColor: '#0000FF',
        fontFamily: 'Inter',
      },
      setTheme: (newTheme) =>
        set((state) => ({
          theme: { ...state.theme, ...newTheme },
        })),

      // Admin state
      admin: null,
      isAuthenticated: false,
      setAdmin: (admin) =>
        set({
          admin,
          isAuthenticated: admin !== null,
        }),

      // UI state
      isSidebarOpen: true,
      toggleSidebar: () =>
        set((state) => ({
          isSidebarOpen: !state.isSidebarOpen,
        })),

      // Notifications
      notification: {
        show: false,
        message: '',
        type: 'info',
      },
      showNotification: (message, type) =>
        set({
          notification: {
            show: true,
            message,
            type,
          },
        }),
      hideNotification: () =>
        set({
          notification: {
            show: false,
            message: '',
            type: 'info',
          },
        }),
    }),
    {
      name: 'southern-org-storage',
      partialize: (state) => ({
        theme: state.theme,
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Export individual selectors for convenience  
export const useNotification = () => {
  const showNotification = useAppStore((state) => state.showNotification);
  const hideNotification = useAppStore((state) => state.hideNotification);
  return { showNotification, hideNotification };
};

export const useTheme = () => {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  return { theme, setTheme };
};
