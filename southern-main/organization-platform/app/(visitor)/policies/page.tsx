'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, ChevronDown, ChevronUp, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface Policy {
  id: string;
  title: string;
  content: string;
  display_order: number;
}

export default function PoliciesPage() {
  const theme = useAppStore((state) => state.theme);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [consented, setConsented] = useState(false);
  const [justConsented, setJustConsented] = useState(false);

  useEffect(() => {
    // Check localStorage for consent
    const saved = localStorage.getItem('kitebe_policies_consented');
    if (saved === 'true') setConsented(true);
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await fetch('/api/members/policies');
      const data = await res.json();
      setPolicies(data.policies || []);
      // Auto-expand first policy
      if (data.policies?.length > 0) {
        setExpanded(data.policies[0].id);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const handleConsent = () => {
    localStorage.setItem('kitebe_policies_consented', 'true');
    setConsented(true);
    setJustConsented(true);
    setTimeout(() => setJustConsented(false), 3000);
  };

  const toggleExpanded = (id: string) => {
    setExpanded(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen py-20 px-4">
      {/* Hero */}
      <div className="relative text-center mb-16">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            style={{ backgroundColor: theme.primaryColor, color: '#fff' }}
          >
            <Shield size={40} />
          </div>
          <span 
            className="inline-block border text-sm font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase"
            style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
          >
            Community Guidelines
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Our Community Policies
          </h1>
          <p className="text-xl leading-relaxed max-w-2xl mx-auto opacity-80">
            These policies govern our community and ensure a safe, respectful, and productive environment for all members.
            Please read them carefully before applying to join.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto pb-20">
        {/* Consent Banner */}
        {consented && (
          <div className="border rounded-2xl p-4 mb-8 flex items-center gap-3 bg-green-50/10 border-green-500 text-green-700">
            <CheckCircle2 size={20} className="shrink-0" />
            <p>
              <strong>You have accepted these policies.</strong>{' '}
              {justConsented
                ? 'Thank you! You may proceed to apply for membership.'
                : 'You can return to the application form anytime.'}
            </p>
            {justConsented && (
              <Link
                href="/membership"
                className="ml-auto shrink-0 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Apply Now →
              </Link>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={40} className="animate-spin opacity-50" />
          </div>
        ) : policies.length === 0 ? (
          <div className="text-center py-24">
            <AlertCircle size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg opacity-50">No policies published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {policies.map((policy, idx) => (
              <div
                key={policy.id}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  expanded === policy.id
                    ? 'shadow-lg border-opacity-100'
                    : 'border-opacity-30 hover:border-opacity-50'
                }`}
                style={{ borderColor: expanded === policy.id ? theme.primaryColor : 'inherit' }}
              >
                <button
                  onClick={() => toggleExpanded(policy.id)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                      style={{ 
                        backgroundColor: expanded === policy.id ? theme.primaryColor : 'transparent',
                        color: expanded === policy.id ? '#fff' : 'inherit',
                        border: expanded === policy.id ? 'none' : '1px solid currentColor'
                      }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <h3 className={`text-lg font-bold transition-colors ${expanded !== policy.id && 'opacity-80'}`}>
                      {policy.title}
                    </h3>
                  </div>
                  <div className="shrink-0 transition-colors" style={{ color: expanded === policy.id ? theme.primaryColor : 'inherit', opacity: expanded === policy.id ? 1 : 0.4 }}>
                    {expanded === policy.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {expanded === policy.id && (
                  <div className="px-6 pb-6">
                    <div className="border-t pt-4 opacity-90">
                      <p className="leading-relaxed whitespace-pre-line">
                        {policy.content}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Consent Action */}
        {!loading && policies.length > 0 && (
          <div className="mt-12 border rounded-3xl p-8 text-center shadow-sm">
            <Shield size={40} className="mx-auto mb-4" style={{ color: theme.primaryColor }} />
            <h2 className="text-2xl font-bold mb-3">Acknowledge These Policies</h2>
            <p className="opacity-70 mb-8 max-w-md mx-auto">
              By acknowledging these policies, you confirm that you have read and understood all the guidelines above.
            </p>

            {consented ? (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 border px-6 py-3 rounded-xl font-semibold bg-green-50/10 border-green-500 text-green-700">
                  <CheckCircle2 size={20} />
                  Policies Accepted
                </div>
                <div className="block">
                  <Link
                    href="/membership"
                    className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-xl transition-all shadow-md mt-4"
                    style={{ backgroundColor: theme.primaryColor, color: '#fff' }}
                  >
                    Proceed to Membership Application →
                  </Link>
                </div>
              </div>
            ) : (
              <button
                onClick={handleConsent}
                className="font-bold px-10 py-4 rounded-xl transition-all shadow-md"
                style={{ backgroundColor: theme.primaryColor, color: '#fff' }}
              >
                I Accept These Policies
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
