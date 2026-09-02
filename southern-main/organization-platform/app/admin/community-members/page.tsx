'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Users, UserCheck, UserX, Clock, Eye, CheckCircle, XCircle, ChevronDown,
  ChevronUp, Copy, ExternalLink, Loader2, Search, Filter, Calendar,
  Mail, Phone, Globe, GraduationCap, BookOpen, Heart, FileText, Info,
  ToggleLeft, ToggleRight, RefreshCw
} from 'lucide-react';
import { useNotification } from '@/lib/store';

type Tab = 'pending' | 'approved' | 'rejected' | 'members';

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  nationality: string;
  gender: string;
  date_of_birth: string;
  why_join: string;
  self_description: string;
  academic_background: string;
  education_level: string;
  additional_info: string | null;
  policies_accepted: boolean;
  status: string;
  rejection_reason: string | null;
  approval_token: string | null;
  profile_completed: boolean;
  admin_notes: string | null;
  created_at: string;
}

interface Member {
  id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  nationality: string | null;
  gender: string | null;
  date_of_birth: string | null;
  why_join: string | null;
  self_description: string | null;
  academic_background: string | null;
  education_level: string | null;
  additional_info: string | null;
  profile_image_url: string | null;
  extra_profile_info: string | null;
  is_active: boolean;
  joined_at: string;
}

const InfoRow = ({ label, value }: { label: string; value?: string | null }) => {
  if (!value) return null;
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</dt>
      <dd className="text-gray-800 text-sm leading-relaxed">{value}</dd>
    </div>
  );
};

export default function AdminCommunityMembersPage() {
  const [tab, setTab] = useState<Tab>('pending');
  const [applications, setApplications] = useState<Application[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [completionLink, setCompletionLink] = useState<{ id: string; link: string } | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [appsRes, membersRes] = await Promise.all([
        fetch('/api/admin/members?view=applications'),
        fetch('/api/admin/members?view=members'),
      ]);
      const appsData = await appsRes.json();
      const membersData = await membersRes.json();
      setApplications(appsData.applications || []);
      setMembers(membersData.members || []);
    } catch {
      showNotification('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const approve = async (appId: string) => {
    setProcessing(appId);
    try {
      const res = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', application_id: appId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showNotification('Application approved! Share the profile completion link.', 'success');
      setCompletionLink({ id: appId, link: data.completion_link });
      await fetchAll();
      setTab('approved');
    } catch (err: any) {
      showNotification(err.message || 'Failed to approve', 'error');
    } finally {
      setProcessing(null);
    }
  };

  const reject = async () => {
    if (!rejectModal) return;
    setProcessing(rejectModal.id);
    try {
      const res = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          application_id: rejectModal.id,
          rejection_reason: rejectReason.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showNotification('Application rejected.', 'info');
      setRejectModal(null);
      setRejectReason('');
      await fetchAll();
    } catch (err: any) {
      showNotification(err.message || 'Failed to reject', 'error');
    } finally {
      setProcessing(null);
    }
  };

  const toggleMemberActive = async (member: Member) => {
    const action = member.is_active ? 'deactivate_member' : 'activate_member';
    setProcessing(member.id);
    try {
      const res = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, application_id: member.id, member_id: member.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showNotification(data.message, 'success');
      await fetchAll();
    } catch (err: any) {
      showNotification(err.message || 'Action failed', 'error');
    } finally {
      setProcessing(null);
    }
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    showNotification('Link copied to clipboard!', 'success');
  };

  const getInitials = (name: string) =>
    name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

  const pending = applications.filter(a => a.status === 'pending');
  const approved = applications.filter(a => a.status === 'approved');
  const rejected = applications.filter(a => a.status === 'rejected');

  const filterApps = (list: Application[]) =>
    list.filter(a =>
      search ? a.full_name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()) : true
    );

  const filterMembers = (list: Member[]) =>
    list.filter(m =>
      search ? m.full_name.toLowerCase().includes(search.toLowerCase()) ||
        (m.email || '').toLowerCase().includes(search.toLowerCase()) : true
    );

  const tabs: { key: Tab; label: string; count: number; color: string }[] = [
    { key: 'pending', label: 'Pending', count: pending.length, color: 'amber' },
    { key: 'approved', label: 'Approved', count: approved.length, color: 'blue' },
    { key: 'rejected', label: 'Rejected', count: rejected.length, color: 'red' },
    { key: 'members', label: 'Active Members', count: members.filter(m => m.is_active).length, color: 'emerald' },
  ];

  const tabColors: Record<string, string> = {
    amber: 'border-amber-500 text-amber-700 bg-amber-50',
    blue: 'border-blue-500 text-blue-700 bg-blue-50',
    red: 'border-red-500 text-red-700 bg-red-50',
    emerald: 'border-emerald-500 text-emerald-700 bg-emerald-50',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Members</h1>
          <p className="text-gray-500 mt-1">Manage membership applications and active members</p>
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', value: applications.length, icon: Users, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
          { label: 'Pending Review', value: pending.length, icon: Clock, bg: 'bg-amber-50', iconColor: 'text-amber-600' },
          { label: 'Active Members', value: members.filter(m => m.is_active).length, icon: UserCheck, bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
          { label: 'Rejected', value: rejected.length, icon: UserX, bg: 'bg-red-50', iconColor: 'text-red-600' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-4 border border-black/5`}>
            <div className="flex items-center gap-3">
              <stat.icon size={20} className={stat.iconColor} />
              <span className="text-sm text-gray-600 font-medium">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Completion link banner */}
      {completionLink && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-emerald-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-emerald-800 mb-1">Application Approved — Share this link</p>
              <p className="text-sm text-emerald-700 mb-3">Copy and share this link with the approved member so they can complete their profile:</p>
              <div className="flex gap-2">
                <code className="flex-1 bg-white border border-emerald-200 rounded-lg px-3 py-2 text-xs text-gray-700 font-mono break-all">
                  {completionLink.link}
                </code>
                <button
                  onClick={() => copyLink(completionLink.link)}
                  className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <Copy size={16} />
                </button>
                <a
                  href={completionLink.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
            <button onClick={() => setCompletionLink(null)} className="text-emerald-400 hover:text-emerald-600">×</button>
          </div>
        </div>
      )}

      {/* Tabs + Search */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-4 pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => { setTab(t.key); setSearch(''); setExpandedId(null); }}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all border ${
                    tab === t.key
                      ? tabColors[t.color]
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t.label}
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                    tab === t.key ? 'bg-white/60' : 'bg-gray-100'
                  }`}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative sm:ml-auto sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={32} className="text-blue-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* ── Applications Tabs ── */}
              {(tab === 'pending' || tab === 'approved' || tab === 'rejected') && (() => {
                const list = filterApps(
                  tab === 'pending' ? pending : tab === 'approved' ? approved : rejected
                );

                if (list.length === 0) {
                  return (
                    <div className="text-center py-16">
                      <Users size={40} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-400">No {tab} applications.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {list.map(app => (
                      <div key={app.id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-200 transition-colors">
                        {/* Row header */}
                        <div className="flex items-center gap-4 p-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {getInitials(app.full_name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{app.full_name}</p>
                            <p className="text-sm text-gray-500">{app.email} · {app.nationality} · {app.gender}</p>
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            <span className="hidden sm:block text-xs text-gray-400">
                              {new Date(app.created_at).toLocaleDateString()}
                            </span>
                            {tab === 'pending' && (
                              <>
                                <button
                                  onClick={() => approve(app.id)}
                                  disabled={processing === app.id}
                                  className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                >
                                  {processing === app.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                  Approve
                                </button>
                                <button
                                  onClick={() => setRejectModal({ id: app.id, name: app.full_name })}
                                  disabled={processing === app.id}
                                  className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                >
                                  <XCircle size={14} />
                                  Reject
                                </button>
                              </>
                            )}
                            {tab === 'approved' && app.approval_token && !app.profile_completed && (
                              <button
                                onClick={() => {
                                  const baseUrl = window.location.origin;
                                  const link = `${baseUrl}/members/complete-profile?token=${app.approval_token}`;
                                  copyLink(link);
                                }}
                                className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                              >
                                <Copy size={14} />
                                Copy Link
                              </button>
                            )}
                            {tab === 'approved' && app.profile_completed && (
                              <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">
                                <CheckCircle size={12} /> Profile Done
                              </span>
                            )}
                            <button
                              onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {expandedId === app.id ? <ChevronUp size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        {/* Expanded detail panel */}
                        {expandedId === app.id && (
                          <div className="border-t border-gray-100 bg-gray-50 p-5">
                            <div className="grid md:grid-cols-2 gap-x-8">
                              <dl>
                                <InfoRow label="Full Name" value={app.full_name} />
                                <InfoRow label="Email" value={app.email} />
                                <InfoRow label="Phone" value={app.phone_number} />
                                <InfoRow label="Nationality" value={app.nationality} />
                                <InfoRow label="Gender" value={app.gender} />
                                <InfoRow label="Date of Birth" value={app.date_of_birth ? new Date(app.date_of_birth).toLocaleDateString() : null} />
                                <InfoRow label="Education Level" value={app.education_level} />
                                <InfoRow label="Policies Accepted" value={app.policies_accepted ? 'Yes' : 'No'} />
                                <InfoRow label="Applied On" value={new Date(app.created_at).toLocaleString()} />
                                {app.rejection_reason && (
                                  <InfoRow label="Rejection Reason" value={app.rejection_reason} />
                                )}
                              </dl>
                              <dl>
                                <InfoRow label="Why They Want to Join" value={app.why_join} />
                                <InfoRow label="Self Description" value={app.self_description} />
                                <InfoRow label="Academic Background" value={app.academic_background} />
                                <InfoRow label="Additional Information" value={app.additional_info} />
                                <InfoRow label="Admin Notes" value={app.admin_notes} />
                              </dl>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* ── Active Members Tab ── */}
              {tab === 'members' && (() => {
                const list = filterMembers(members);
                if (list.length === 0) {
                  return (
                    <div className="text-center py-16">
                      <UserCheck size={40} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-400">No active members yet.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {list.map(member => (
                      <div key={member.id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-4 p-4">
                          {/* Avatar */}
                          {member.profile_image_url ? (
                            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-200 shrink-0">
                              <Image
                                src={member.profile_image_url}
                                alt={member.full_name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                              {getInitials(member.full_name)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{member.full_name}</p>
                            <p className="text-sm text-gray-500">{member.email} · {member.nationality} · {member.gender}</p>
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              member.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {member.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <button
                              onClick={() => toggleMemberActive(member)}
                              disabled={processing === member.id}
                              title={member.is_active ? 'Deactivate member' : 'Activate member'}
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {processing === member.id ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : member.is_active ? (
                                <ToggleRight size={18} className="text-emerald-500" />
                              ) : (
                                <ToggleLeft size={18} />
                              )}
                            </button>
                            <button
                              onClick={() => setExpandedId(expandedId === member.id ? null : member.id)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {expandedId === member.id ? <ChevronUp size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        {/* Expanded member details */}
                        {expandedId === member.id && (
                          <div className="border-t border-gray-100 bg-gray-50 p-5">
                            <div className="flex flex-col sm:flex-row gap-5">
                              {/* Profile image */}
                              {member.profile_image_url && (
                                <div className="shrink-0">
                                  <div className="w-28 h-28 rounded-xl overflow-hidden ring-2 ring-blue-200">
                                    <Image
                                      src={member.profile_image_url}
                                      alt={member.full_name}
                                      width={112}
                                      height={112}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="flex-1 grid md:grid-cols-2 gap-x-8">
                                <dl>
                                  <InfoRow label="Full Name" value={member.full_name} />
                                  <InfoRow label="Email" value={member.email} />
                                  <InfoRow label="Phone" value={member.phone_number} />
                                  <InfoRow label="Nationality" value={member.nationality} />
                                  <InfoRow label="Gender" value={member.gender} />
                                  <InfoRow label="Date of Birth" value={member.date_of_birth ? new Date(member.date_of_birth).toLocaleDateString() : null} />
                                  <InfoRow label="Education Level" value={member.education_level} />
                                  <InfoRow label="Joined" value={new Date(member.joined_at).toLocaleDateString()} />
                                </dl>
                                <dl>
                                  <InfoRow label="Why They Joined" value={member.why_join} />
                                  <InfoRow label="About Themselves" value={member.self_description} />
                                  <InfoRow label="Academic Background" value={member.academic_background} />
                                  <InfoRow label="Additional Info (Application)" value={member.additional_info} />
                                  <InfoRow label="Extra Profile Info" value={member.extra_profile_info} />
                                </dl>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Application</h3>
            <p className="text-gray-500 text-sm mb-4">
              Rejecting <strong className="text-gray-700">{rejectModal.name}</strong>'s application. You may optionally provide a reason.
            </p>
            <textarea
              rows={3}
              placeholder="Reason for rejection (optional)..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/50 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setRejectModal(null); setRejectReason(''); }}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={reject}
                disabled={!!processing}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? <Loader2 size={16} className="animate-spin" /> : null}
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
