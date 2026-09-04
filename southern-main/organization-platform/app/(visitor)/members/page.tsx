'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, UserCheck, UserPlus, Search, Loader2 } from 'lucide-react';
import { useAppStore, useHydratedTheme } from '@/lib/store';

interface CommunityMember {
  id: string;
  full_name: string;
  profile_image_url: string | null;
  nationality: string | null;
  joined_at: string;
}

export default function MembersPage() {
  const { theme } = useHydratedTheme();
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/admin/members?view=members');
      const data = await res.json();
      // Only show active members with public fields
      const active = (data.members || []).filter((m: any) => m.is_active);
      setMembers(active);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  const filtered = members.filter(m =>
    m.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name: string) =>
    name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();

  const avatarColors = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-red-500',
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative py-20 px-4 text-center overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <span 
            className="inline-block border text-sm font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase opacity-80"
            style={{ borderColor: 'currentColor' }}
          >
            Our Community
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Meet Our
            <span className="block" style={{ color: theme.primaryColor }}>
              Community Members
            </span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-10 opacity-80">
            A proud family of individuals united by excellence, passion, and purpose.
          </p>

          {/* Stats */}
          {!loading && (
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="border rounded-2xl px-8 py-5 flex items-center gap-4 opacity-90" style={{ borderColor: 'currentColor', borderWidth: '1px' }}>
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center border"
                  style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
                >
                  <Users size={24} />
                </div>
                <div className="text-left">
                  <p className="text-4xl font-extrabold">{members.length}</p>
                  <p className="text-sm font-medium opacity-70">Total Members</p>
                </div>
              </div>
              <div className="border rounded-2xl px-8 py-5 flex items-center gap-4 opacity-90" style={{ borderColor: 'currentColor', borderWidth: '1px' }}>
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center border"
                  style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
                >
                  <UserCheck size={24} />
                </div>
                <div className="text-left">
                  <p className="text-4xl font-extrabold">
                    {members.filter(m => m.profile_image_url).length}
                  </p>
                  <p className="text-sm font-medium opacity-70">With Profiles</p>
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              type="text"
              placeholder="Search members by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-transparent border rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              style={{ borderColor: 'currentColor' }}
            />
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={40} className="animate-spin opacity-50" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 border rounded-full flex items-center justify-center mx-auto mb-6" style={{ borderColor: 'currentColor', opacity: 0.2 }}>
              <Users size={36} />
            </div>
            <h3 className="text-2xl font-bold mb-3">
              {search ? 'No members found' : 'No members yet'}
            </h3>
            <p className="opacity-60 mb-8">
              {search
                ? `No member matches "${search}". Try a different search.`
                : 'Be the first to join the Kitebe Elites FC community!'}
            </p>
            {!search && (
              <Link
                href="/membership"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all shadow-lg text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <UserPlus size={20} />
                Apply to Join
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filtered.map((member, idx) => (
              <div
                key={member.id}
                className="group border rounded-2xl p-5 text-center transition-all duration-300 cursor-default opacity-80 hover:opacity-100"
                style={{ borderColor: 'currentColor', borderWidth: '1px' }}
              >
                {/* Avatar */}
                <div className="relative w-20 h-20 mx-auto mb-4">
                  {member.profile_image_url ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 transition-all">
                      <Image
                        src={member.profile_image_url}
                        alt={member.full_name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center ring-2 ring-transparent transition-all text-2xl font-bold text-white`}
                    >
                      {getInitials(member.full_name)}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 rounded-full" style={{ borderColor: theme.backgroundColor }} title="Active Member" />
                </div>

                {/* Name */}
                <p className="font-semibold text-sm leading-tight transition-colors line-clamp-2" style={{ color: theme.primaryColor }}>
                  {member.full_name}
                </p>
                {member.nationality && (
                  <p className="text-xs mt-1 opacity-60">{member.nationality}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Join CTA */}
        {!loading && members.length > 0 && (
          <div className="mt-16 text-center">
            <div className="border rounded-3xl p-10 shadow-sm">
              <h2 className="text-3xl font-bold mb-4">Want to Join Us?</h2>
              <p className="opacity-70 mb-8 max-w-lg mx-auto">
                Applications are open. Join our growing community of passionate members today.
              </p>
              <Link
                href="/membership"
                className="inline-flex items-center gap-3 font-bold px-10 py-4 rounded-xl transition-all shadow-md text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <UserPlus size={20} />
                Apply to Become a Member
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
