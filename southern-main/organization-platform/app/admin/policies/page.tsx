'use client';

import { useEffect, useState } from 'react';
import {
  Plus, Edit3, Trash2, Save, X, Eye, EyeOff, GripVertical,
  Loader2, Shield, CheckCircle, AlertCircle, RefreshCw, FileText
} from 'lucide-react';
import { useNotification } from '@/lib/store';

interface Policy {
  id: string;
  title: string;
  content: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const EMPTY_FORM = { title: '', content: '', display_order: 0, is_active: true };

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Create / Edit form
  const [mode, setMode] = useState<'idle' | 'create' | 'edit'>('idle');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirmation
  const [deleteModal, setDeleteModal] = useState<Policy | null>(null);

  const { showNotification } = useNotification();

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/policies');
      const data = await res.json();
      setPolicies((data.policies || []).sort((a: Policy, b: Policy) => a.display_order - b.display_order));
    } catch {
      showNotification('Failed to load policies', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    const nextOrder = policies.length > 0 ? Math.max(...policies.map(p => p.display_order)) + 1 : 1;
    setForm({ ...EMPTY_FORM, display_order: nextOrder });
    setMode('create');
    setEditingId(null);
    setFormError(null);
  };

  const openEdit = (policy: Policy) => {
    setForm({
      title: policy.title,
      content: policy.content,
      display_order: policy.display_order,
      is_active: policy.is_active,
    });
    setMode('edit');
    setEditingId(policy.id);
    setFormError(null);
  };

  const cancelForm = () => {
    setMode('idle');
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const savePolicy = async () => {
    if (!form.title.trim()) {
      setFormError('Title is required.');
      return;
    }
    if (!form.content.trim()) {
      setFormError('Content is required.');
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      let res: Response;
      if (mode === 'create') {
        res = await fetch('/api/admin/policies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch('/api/admin/policies', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...form }),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');

      showNotification(
        mode === 'create' ? 'Policy created!' : 'Policy updated!',
        'success'
      );
      cancelForm();
      await fetchPolicies();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (policy: Policy) => {
    try {
      const res = await fetch('/api/admin/policies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: policy.id, is_active: !policy.is_active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showNotification(policy.is_active ? 'Policy hidden from public' : 'Policy is now public', 'info');
      await fetchPolicies();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const deletePolicy = async () => {
    if (!deleteModal) return;
    setDeletingId(deleteModal.id);
    try {
      const res = await fetch(`/api/admin/policies?id=${deleteModal.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showNotification('Policy deleted.', 'success');
      setDeleteModal(null);
      await fetchPolicies();
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Policies</h1>
          <p className="text-gray-500 mt-1">Manage policies visible to the public on the website</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchPolicies}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={openCreate}
            disabled={mode !== 'idle'}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-2 rounded-lg font-semibold transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add Policy
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Shield size={18} />
            <span className="text-sm font-semibold">Total Policies</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{policies.length}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Eye size={18} />
            <span className="text-sm font-semibold">Public</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{policies.filter(p => p.is_active).length}</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <EyeOff size={18} />
            <span className="text-sm font-semibold">Hidden</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{policies.filter(p => !p.is_active).length}</p>
        </div>
      </div>

      {/* Create / Edit Form */}
      {mode !== 'idle' && (
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              {mode === 'create' ? <Plus size={18} className="text-blue-600" /> : <Edit3 size={18} className="text-blue-600" />}
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {mode === 'create' ? 'Create New Policy' : 'Edit Policy'}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Policy Title *</label>
              <input
                type="text"
                placeholder="e.g. Code of Conduct"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Policy Content *</label>
              <textarea
                rows={6}
                placeholder="Write the full text of this policy..."
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-y"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Display Order</label>
                <input
                  type="number"
                  min={1}
                  value={form.display_order}
                  onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Visibility</label>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                  className={`w-full flex items-center gap-2 border rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    form.is_active
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                >
                  {form.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                  {form.is_active ? 'Public (Visible)' : 'Hidden'}
                </button>
              </div>
            </div>
          </div>

          {formError && (
            <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle size={16} className="shrink-0" />
              {formError}
            </div>
          )}

          <div className="flex gap-3 mt-5">
            <button
              onClick={cancelForm}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <X size={16} /> Cancel
            </button>
            <button
              onClick={savePolicy}
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {mode === 'create' ? 'Create Policy' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Policies List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={32} className="text-blue-500 animate-spin" />
          </div>
        ) : policies.length === 0 ? (
          <div className="text-center py-16">
            <Shield size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">No Policies Yet</h3>
            <p className="text-gray-400 mb-6">Click "Add Policy" to create your first community policy.</p>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Create First Policy
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Title</div>
              <div className="col-span-3">Last Updated</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {policies.map(policy => (
              <div key={policy.id} className="group grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-blue-50/40 transition-colors">
                <div className="col-span-1">
                  <span className="w-7 h-7 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-500 group-hover:text-blue-600 transition-colors">
                    {policy.display_order}
                  </span>
                </div>
                <div className="col-span-5">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">{policy.title}</p>
                  <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">{policy.content}</p>
                </div>
                <div className="col-span-3 text-sm text-gray-400">
                  {new Date(policy.updated_at).toLocaleDateString()}
                </div>
                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => toggleActive(policy)}
                    title={policy.is_active ? 'Click to hide' : 'Click to publish'}
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full transition-all ${
                      policy.is_active
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {policy.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                    {policy.is_active ? 'Live' : 'Hidden'}
                  </button>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(policy)}
                    disabled={mode !== 'idle'}
                    title="Edit policy"
                    className="p-2 hover:bg-blue-100 text-gray-400 hover:text-blue-600 rounded-lg transition-colors disabled:opacity-40"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteModal(policy)}
                    title="Delete policy"
                    className="p-2 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Public preview note */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <FileText size={18} className="text-blue-500 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-700">
          <strong>Public Page:</strong> Active policies are displayed on{' '}
          <a href="/policies" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-blue-900">
            /policies
          </a>{' '}
          where visitors can read and consent to them before applying for membership.
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Policy?</h3>
            <p className="text-gray-500 text-sm text-center mb-6">
              Are you sure you want to permanently delete{' '}
              <strong className="text-gray-700">"{deleteModal.title}"</strong>?
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deletePolicy}
                disabled={!!deletingId}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {deletingId ? <Loader2 size={16} className="animate-spin" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
