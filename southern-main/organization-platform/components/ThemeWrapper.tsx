'use client';

import { useAppStore } from '@/lib/store';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((state) => state.theme);

  return (
    <div 
      className="flex flex-col min-h-screen transition-colors duration-300 w-full"
      style={{ 
        backgroundColor: theme.backgroundColor, 
        color: theme.textColor,
        fontFamily: theme.fontFamily 
      }}
    >
      {children}
    </div>
  );
}
