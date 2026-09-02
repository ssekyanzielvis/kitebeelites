'use client';

import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';

interface FooterData {
  organization_name: string | null;
  location: string | null;
  director: string | null;
  email: string | null;
  phone: string | null;
  organization_type: string | null;
  primary_focus: string | null;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  website_url: string | null;
}

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const { data, error } = await supabase
          .from('footer_info')
          .select('*')
          .limit(1)
          .maybeSingle();
        if (!mounted) return;
        if (error) { console.error('Footer fetch error:', error); return; }
        if (data) setFooterData(data as FooterData);
      } catch (err: unknown) {
        console.error('Failed to fetch footer data:', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full mt-auto"
      style={{ backgroundColor: theme.primaryColor }}
    >
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-white">

          {/* Organization Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {footerData?.organization_name || 'Kitebe Elites FC'}
            </h3>
            <div className="space-y-2">
              {footerData?.organization_type && (
                <div className="flex items-start space-x-2">
                  <Building2 size={18} className="mt-1 flex-shrink-0" />
                  <span className="text-sm">{footerData.organization_type}</span>
                </div>
              )}
              {footerData?.primary_focus && (
                <p className="text-sm opacity-90">{footerData.primary_focus}</p>
              )}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold mb-3">Community</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/policies" className="text-sm hover:underline opacity-90 hover:opacity-100 flex items-center gap-2">
                    Community Policies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              {footerData?.email && (
                <div className="flex items-center space-x-2">
                  <Mail size={18} className="flex-shrink-0" />
                  <a
                    href={`mailto:${footerData.email}`}
                    className="text-sm hover:underline"
                  >
                    {footerData.email}
                  </a>
                </div>
              )}
              {footerData?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone size={18} className="flex-shrink-0" />
                  <a
                    href={`tel:${footerData.phone}`}
                    className="text-sm hover:underline"
                  >
                    {footerData.phone}
                  </a>
                </div>
              )}
              {footerData?.location && (
                <div className="flex items-start space-x-2">
                  <MapPin size={18} className="mt-1 flex-shrink-0" />
                  <span className="text-sm">{footerData.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Leadership */}
          <div>
            <h3 className="text-xl font-bold mb-4">Leadership</h3>
            {footerData?.director && (
              <div>
                <p className="text-sm font-semibold">Chairman</p>
                <p className="text-sm opacity-90">{footerData.director}</p>
              </div>
            )}
          </div>

          {/* Quick Links + Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 mb-5">
              <li><a href="/about"        className="text-sm hover:underline">About Us</a></li>
              <li><a href="/programs"     className="text-sm hover:underline">Programs</a></li>
              <li><a href="/leagues"      className="text-sm hover:underline">Leagues</a></li>
              <li><a href="/achievements" className="text-sm hover:underline">Achievements</a></li>
              <li><a href="/gallery"      className="text-sm hover:underline">Gallery</a></li>
              <li><a href="/news"         className="text-sm hover:underline">News</a></li>
              <li><a href="/leadership"   className="text-sm hover:underline">Leadership</a></li>
              <li><a href="/core-values"  className="text-sm hover:underline">Core Values</a></li>
              <li><a href="/donate"       className="text-sm hover:underline font-semibold">Donate Now</a></li>
            </ul>

            {/* Social Media */}
            {(footerData?.instagram_handle || footerData?.tiktok_handle || footerData?.website_url) && (
              <div className="mb-4">
                <h4 className="text-sm font-bold mb-2 opacity-80">Follow Us</h4>
                <div className="flex flex-col gap-1">
                  {footerData?.instagram_handle && (
                    <a
                      href={`https://instagram.com/${footerData.instagram_handle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                    >
                      📸 {footerData.instagram_handle} (Instagram)
                    </a>
                  )}
                  {footerData?.tiktok_handle && (
                    <a
                      href={`https://tiktok.com/@${footerData.tiktok_handle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                    >
                      🎵 {footerData.tiktok_handle} (TikTok)
                    </a>
                  )}
                  {footerData?.website_url && (
                    <a
                      href={footerData.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                    >
                      🌐 {footerData.website_url}
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <a href="/apply/staff"     className="bg-blue-600   text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700   transition-colors text-center">Become a Staff Member</a>
              <a href="/apply/volunteer" className="bg-green-600  text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700  transition-colors text-center">Become a Volunteer</a>
              <a href="/apply/partner"   className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors text-center">Become a Partner</a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center text-white">
          <p className="text-sm opacity-90">
            © {currentYear} {footerData?.organization_name || 'Kitebe Elites FC'}. All rights reserved. | Tethered Together.
          </p>
        </div>
      </div>
    </footer>
  );
}
