'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User, Mail, Phone, Globe, Calendar, BookOpen,
  GraduationCap, Heart, FileText, CheckSquare, Send, ArrowRight,
  ChevronDown, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useAppStore, useHydratedTheme } from '@/lib/store';

const EDUCATION_LEVELS = [
  'High School / O-Level',
  'A-Level / Pre-University',
  'Diploma / Certificate',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD / Doctorate',
  'Professional Qualification',
  'Other',
];

const GENDERS = ['Male', 'Female', 'Prefer not to say'];

interface FormData {
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
  additional_info: string;
  policies_accepted: boolean;
}

const INITIAL: FormData = {
  full_name: '',
  email: '',
  phone_number: '',
  nationality: '',
  gender: '',
  date_of_birth: '',
  why_join: '',
  self_description: '',
  academic_background: '',
  education_level: '',
  additional_info: '',
  policies_accepted: false,
};

export default function MembershipPage() {
  const { theme } = useHydratedTheme();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const update = (field: keyof FormData, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
    setError(null);
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.full_name.trim()) errs.full_name = 'Full name is required.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'A valid email is required.';
    if (!form.phone_number.trim()) errs.phone_number = 'Phone number is required.';
    if (!form.nationality.trim()) errs.nationality = 'Nationality is required.';
    if (!form.gender) errs.gender = 'Please select your gender.';
    if (!form.date_of_birth) errs.date_of_birth = 'Date of birth is required.';
    if (!form.why_join.trim()) errs.why_join = 'Please tell us why you want to join.';
    if (!form.self_description.trim()) errs.self_description = 'Please describe yourself.';
    if (!form.academic_background.trim()) errs.academic_background = 'Academic background is required.';
    if (!form.education_level) errs.education_level = 'Please select your education level.';
    if (!form.policies_accepted) errs.policies_accepted = 'You must accept the community policies.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/members/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Submission failed. Please try again.');
        return;
      }

      setSubmitted(true);
    } catch (err: any) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="relative mb-8">
            <div 
              className="w-28 h-28 rounded-full flex items-center justify-center mx-auto shadow-2xl"
              style={{ backgroundColor: theme.primaryColor, color: '#fff' }}
            >
              <CheckCircle2 size={56} />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Application Submitted!</h1>
          <p className="text-lg mb-8 leading-relaxed opacity-80">
            Thank you for applying to join the <strong>Kitebe Elites FC</strong> community. 
            Your application is under review. The administrator will contact you once a decision has been made.
          </p>
          <div className="border border-current rounded-2xl p-6 mb-8 text-left opacity-90 border-opacity-20">
            <p className="text-sm">
              📧 <strong>What happens next?</strong><br />
              Our admin team will review your application and all the details you provided. 
              If approved, you will receive a link to complete your profile — including uploading your photo 
              and adding any additional information.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all shadow-lg"
            style={{ backgroundColor: theme.primaryColor, color: '#fff' }}
          >
            Back to Home <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const inputCls = (field: keyof FormData) =>
    `w-full border rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
      fieldErrors[field]
        ? 'border-red-400/70 focus:ring-red-400/50'
        : 'border-current opacity-70 focus:opacity-100'
    }`;

  const labelCls = 'block text-sm font-semibold opacity-90 mb-2';
  const errorCls = 'mt-1.5 text-xs text-red-500 flex items-center gap-1';

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative py-20 px-4 text-center overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <span 
            className="inline-block border text-sm font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase opacity-80"
            style={{ borderColor: 'currentColor' }}
          >
            Join Our Community
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Become a Member of
            <span className="block" style={{ color: theme.primaryColor }}>
              Kitebe Elites FC
            </span>
          </h1>
          <p className="text-xl leading-relaxed max-w-2xl mx-auto opacity-80">
            Join a vibrant community of passionate individuals dedicated to excellence, growth, and community development.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {['Excellence', 'Community', 'Growth', 'Unity'].map(tag => (
              <span key={tag} className="border px-3 py-1 rounded-full text-sm opacity-70 border-current border-opacity-30">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 pb-20">
        {/* Policy notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-amber-800 text-sm">
            Before filling this form, please read our{' '}
            <Link href="/policies" className="text-amber-900 underline underline-offset-2 font-semibold hover:text-amber-700">
              Community Policies
            </Link>
            . You will be asked to accept them before submitting.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-8">

          {/* ── Section: Personal Information ── */}
          <div className="border border-current border-opacity-10 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 border rounded-xl flex items-center justify-center"
                style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
              >
                <User size={20} />
              </div>
              <h2 className="text-xl font-bold">Personal Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className={labelCls}>Full Name *</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="text"
                    placeholder="Enter your full legal name"
                    value={form.full_name}
                    onChange={e => update('full_name', e.target.value)}
                    className={`${inputCls('full_name')} pl-10`}
                  />
                </div>
                {fieldErrors.full_name && <p className={errorCls}><AlertCircle size={12} />{fieldErrors.full_name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className={labelCls}>Email Address *</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    className={`${inputCls('email')} pl-10`}
                  />
                </div>
                {fieldErrors.email && <p className={errorCls}><AlertCircle size={12} />{fieldErrors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className={labelCls}>Phone Number *</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="tel"
                    placeholder="+256 700 000 000"
                    value={form.phone_number}
                    onChange={e => update('phone_number', e.target.value)}
                    className={`${inputCls('phone_number')} pl-10`}
                  />
                </div>
                {fieldErrors.phone_number && <p className={errorCls}><AlertCircle size={12} />{fieldErrors.phone_number}</p>}
              </div>

              {/* Nationality */}
              <div>
                <label className={labelCls}>Nationality *</label>
                <div className="relative">
                  <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="text"
                    placeholder="e.g. Ugandan"
                    value={form.nationality}
                    onChange={e => update('nationality', e.target.value)}
                    className={`${inputCls('nationality')} pl-10`}
                  />
                </div>
                {fieldErrors.nationality && <p className={errorCls}><AlertCircle size={12} />{fieldErrors.nationality}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className={labelCls}>Gender *</label>
                <div className="relative">
                  <select
                    value={form.gender}
                    onChange={e => update('gender', e.target.value)}
                    className={`${inputCls('gender')} appearance-none pr-10`}
                  >
                    <option value="" className="bg-transparent text-gray-500">Select gender</option>
                    {GENDERS.map(g => (
                      <option key={g} value={g} className="text-gray-900 bg-white">{g}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                </div>
                {fieldErrors.gender && <p className={errorCls}><AlertCircle size={12} />{fieldErrors.gender}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <label className={labelCls}>Date of Birth *</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="date"
                    value={form.date_of_birth}
                    onChange={e => update('date_of_birth', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className={`${inputCls('date_of_birth')} pl-10`}
                  />
                </div>
                {fieldErrors.date_of_birth && <p className={errorCls}><AlertCircle size={12} />{fieldErrors.date_of_birth}</p>}
              </div>
            </div>
          </div>

          {/* ── Section: About You ── */}
          <div className="border border-current border-opacity-10 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 border rounded-xl flex items-center justify-center"
                style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
              >
                <Heart size={20} />
              </div>
              <h2 className="text-xl font-bold">About You</h2>
            </div>

            <div className="space-y-6">
              {/* Why Join */}
              <div>
                <label className={labelCls}>Why do you want to join this community? *</label>
                <textarea
                  rows={4}
                  placeholder="Tell us what motivates you to join Kitebe Elites FC community and what you hope to contribute..."
                  value={form.why_join}
                  onChange={e => update('why_join', e.target.value)}
                  className={`${inputCls('why_join')} resize-none`}
                />
                {fieldErrors.why_join && <p className={errorCls}><AlertCircle size={12} />{fieldErrors.why_join}</p>}
              </div>

              {/* Self Description */}
              <div>
                <label className={labelCls}>Describe Yourself *</label>
                <textarea
                  rows={4}
                  placeholder="Share a brief description of who you are — your personality, interests, values, and what makes you unique..."
                  value={form.self_description}
                  onChange={e => update('self_description', e.target.value)}
                  className={`${inputCls('self_description')} resize-none`}
                />
                {fieldErrors.self_description && <p className={errorCls}><AlertCircle size={12} />{fieldErrors.self_description}</p>}
              </div>
            </div>
          </div>

          {/* ── Section: Academics ── */}
          <div className="border border-current border-opacity-10 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 border rounded-xl flex items-center justify-center"
                style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
              >
                <GraduationCap size={20} />
              </div>
              <h2 className="text-xl font-bold">Academic Background</h2>
            </div>

            <div className="space-y-6">
              {/* Level of Education */}
              <div>
                <label className={labelCls}>Level of Education *</label>
                <div className="relative">
                  <select
                    value={form.education_level}
                    onChange={e => update('education_level', e.target.value)}
                    className={`${inputCls('education_level')} appearance-none pr-10`}
                  >
                    <option value="" className="text-gray-500 bg-transparent">Select your highest level of education</option>
                    {EDUCATION_LEVELS.map(level => (
                      <option key={level} value={level} className="text-gray-900 bg-white">{level}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                </div>
                {fieldErrors.education_level && <p className={errorCls}><AlertCircle size={12} />{fieldErrors.education_level}</p>}
              </div>

              {/* Academic Background */}
              <div>
                <label className={labelCls}>Academic Background & Field of Study *</label>
                <div className="relative">
                  <BookOpen size={16} className="absolute left-4 top-4 opacity-50" />
                  <textarea
                    rows={4}
                    placeholder="Describe your academic journey — subjects studied, institutions attended, qualifications earned, etc."
                    value={form.academic_background}
                    onChange={e => update('academic_background', e.target.value)}
                    className={`${inputCls('academic_background')} pl-10 resize-none`}
                  />
                </div>
                {fieldErrors.academic_background && <p className={errorCls}><AlertCircle size={12} />{fieldErrors.academic_background}</p>}
              </div>
            </div>
          </div>

          {/* ── Section: Additional Info ── */}
          <div className="border border-current border-opacity-10 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 border rounded-xl flex items-center justify-center"
                style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
              >
                <FileText size={20} />
              </div>
              <h2 className="text-xl font-bold">Additional Information</h2>
              <span className="opacity-50 text-sm">(Optional)</span>
            </div>

            <div>
              <label className={labelCls}>Anything else you'd like us to know?</label>
              <textarea
                rows={4}
                placeholder="Any skills, experiences, achievements, or other relevant information you'd like to share with us..."
                value={form.additional_info}
                onChange={e => update('additional_info', e.target.value)}
                className={`${inputCls('additional_info')} resize-none`}
              />
            </div>
          </div>

          {/* ── Policy Consent ── */}
          <div className={`rounded-2xl p-6 border ${fieldErrors.policies_accepted ? 'bg-red-50 border-red-200' : 'border-current border-opacity-20'}`}>
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={form.policies_accepted}
                  onChange={e => update('policies_accepted', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                  form.policies_accepted
                    ? 'border-transparent'
                    : 'border-current opacity-40 group-hover:opacity-70'
                }`}
                style={{ backgroundColor: form.policies_accepted ? theme.primaryColor : 'transparent' }}>
                  {form.policies_accepted && <CheckSquare size={14} className="text-white" />}
                </div>
              </div>
              <div>
                <p className="font-medium leading-relaxed">
                  I have read and agree to the{' '}
                  <Link
                    href="/policies"
                    target="_blank"
                    className="underline underline-offset-2 font-semibold"
                    style={{ color: theme.primaryColor }}
                  >
                    Community Policies
                  </Link>{' '}
                  of Kitebe Elites FC. I understand my responsibilities as a member and agree to abide by them.
                </p>
                <p className="opacity-60 text-sm mt-1">
                  Your personal information will be handled in accordance with our privacy policy.
                </p>
              </div>
            </label>
            {fieldErrors.policies_accepted && (
               <p className="mt-3 text-sm text-red-500 flex items-center gap-2 ml-10">
                <AlertCircle size={14} /> {fieldErrors.policies_accepted}
              </p>
            )}
          </div>

          {/* Global error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full text-white font-bold text-lg py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl disabled:opacity-60"
            style={{ backgroundColor: theme.primaryColor }}
          >
            {submitting ? (
              <>
                <Loader2 size={22} className="animate-spin" />
                Submitting Application...
              </>
            ) : (
              <>
                <Send size={22} />
                Submit My Application
              </>
            )}
          </button>

          <p className="text-center opacity-60 text-sm">
            Already a member?{' '}
            <Link href="/members" className="hover:underline font-medium" style={{ color: theme.primaryColor }}>
              View the community →
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
