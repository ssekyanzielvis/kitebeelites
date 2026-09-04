'use client';

import { useEffect } from 'react';
import { useHydratedTheme } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useHydratedTheme();

  useEffect(() => {
    // Fetch the theme for visitors directly from the database on mount
    let mounted = true;
    void (async () => {
      try {
        const { data, error } = await supabase
          .from('theme_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (mounted && data) {
          const themeData = data as any;
          setTheme({
            backgroundColor: themeData.background_color ?? '#FFFFFF',
            textColor: themeData.text_color ?? '#000000',
            primaryColor: themeData.primary_color ?? '#1B5E20',
            fontFamily: themeData.font_family ?? 'system-ui',
          });
        }
      } catch (err) {
        console.error('Failed to load global theme:', err);
      }
    })();
    return () => { mounted = false; };
  }, [setTheme]);

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
