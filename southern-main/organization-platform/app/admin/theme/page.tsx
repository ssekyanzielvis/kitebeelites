'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { adminDb } from '@/lib/supabase/adminDb';
import { Database } from '@/lib/supabase/types';
import { Save, RefreshCw, AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useNotification, useTheme } from '@/lib/store';
import { formatDistanceToNow } from 'date-fns';

type ThemeSettings = Database['public']['Tables']['theme_settings']['Row'];

export default function ThemeCustomization() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutMessage, setLockoutMessage] = useState('');
  
  const { showNotification } = useNotification();
  const { setTheme: updateTheme } = useTheme();

  const [formData, setFormData] = useState({
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    primaryColor: '#1E40AF',
    fontFamily: 'system-ui',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setCurrentUserEmail(user.email);

      const { data, error } = await (supabase as any).from('theme_settings').select('*').limit(1).single();

      if (data) {
        const themeData = data as any;
        setTheme(themeData);
        setFormData({
          backgroundColor: themeData.background_color ?? '#FFFFFF',
          textColor: themeData.text_color ?? '#000000',
          primaryColor: themeData.primary_color ?? '#1B5E20',
          fontFamily: themeData.font_family ?? 'system-ui',
        });

        // Apply theme to store
        updateTheme({
          backgroundColor: themeData.background_color ?? '#FFFFFF',
          textColor: themeData.text_color ?? '#000000',
          primaryColor: themeData.primary_color ?? '#1B5E20',
          fontFamily: themeData.font_family ?? 'system-ui',
        });

        // Lockout logic
        const lastUpdated = new Date(themeData.updated_at);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

        if (hoursDiff < 24 && themeData.updated_by && themeData.updated_by !== user?.email) {
          setIsLocked(true);
          const timeAgo = formatDistanceToNow(lastUpdated, { addSuffix: true });
          setLockoutMessage(`Theme was modified by ${themeData.updated_by} ${timeAgo}. You must wait 24 hours from their change to modify the theme.`);
        } else {
          setIsLocked(false);
          setLockoutMessage('');
        }
      }
    } catch (error: any) {
      console.error('Failed to load theme', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (theme) {
        const { error } = await adminDb('theme_settings').update({
            background_color: formData.backgroundColor,
            text_color: formData.textColor,
            primary_color: formData.primaryColor,
            font_family: formData.fontFamily,
            updated_at: new Date().toISOString(),
            updated_by: currentUserEmail,
          }).eq('id', theme.id);

        if (error) throw error;
      } else {
        const { error } = await adminDb('theme_settings').insert({
          background_color: formData.backgroundColor,
          text_color: formData.textColor,
          primary_color: formData.primaryColor,
          font_family: formData.fontFamily,
          updated_by: currentUserEmail,
        });

        if (error) throw error;
      }

      updateTheme(formData);
      showNotification('Theme updated successfully', 'success');
      fetchData();
    } catch (error: any) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      primaryColor: '#1E40AF',
      fontFamily: 'system-ui',
    });
  };

  const fontOptions = [
    'system-ui',
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Courier New',
    'Verdana',
    'Trebuchet MS',
  ];

  if (loading && !theme) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Theme Customization</h1>

      {isLocked && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
          <p className="text-sm text-yellow-800">{lockoutMessage}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Color Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color (Header/Footer)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  disabled={isLocked}
                  className="w-16 h-10 border rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  disabled={isLocked}
                  className="flex-1 border rounded-lg px-3 py-2 font-mono text-sm disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Background Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.backgroundColor}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  disabled={isLocked}
                  className="w-16 h-10 border rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <input
                  type="text"
                  value={formData.backgroundColor}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  disabled={isLocked}
                  className="flex-1 border rounded-lg px-3 py-2 font-mono text-sm disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Text Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.textColor}
                  onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  disabled={isLocked}
                  className="w-16 h-10 border rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <input
                  type="text"
                  value={formData.textColor}
                  onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  disabled={isLocked}
                  className="flex-1 border rounded-lg px-3 py-2 font-mono text-sm disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Font Family</label>
              <select
                value={formData.fontFamily}
                onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value })}
                disabled={isLocked}
                className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100"
              >
                {fontOptions.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSave}
                disabled={loading || isLocked}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Save Theme
              </button>
              <button
                onClick={handleReset}
                disabled={isLocked}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-4 h-4" />
                Reset to Default
              </button>
            </div>
          </div>
        </div>

        <div
          className="border rounded-lg p-6"
          style={{
            backgroundColor: formData.backgroundColor,
            color: formData.textColor,
            fontFamily: formData.fontFamily,
          }}
        >
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          
          <div
            className="p-4 rounded-lg mb-4"
            style={{ backgroundColor: formData.primaryColor, color: '#FFFFFF' }}
          >
            <h3 className="text-lg font-bold">Header/Footer Preview</h3>
            <p>This is how your header and footer will look</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Sample Heading</h3>
            <p>
              This is sample paragraph text showing how your content will appear with the selected
              color scheme and font family. Make sure the contrast is readable.
            </p>
            <button
              className="px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: formData.primaryColor }}
            >
              Sample Button
            </button>
          </div>

          <div className="mt-6 p-4 rounded-lg opacity-80" style={{ backgroundColor: 'rgba(128,128,128,0.1)' }}>
            <p className="text-sm">
              <strong>Note:</strong> Changes will be applied across the entire website after saving.
              Make sure to test readability and contrast before finalizing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
