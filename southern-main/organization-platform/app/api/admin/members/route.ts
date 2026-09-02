import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// GET: List all applications and approved members (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'applications'; // 'applications' | 'members'

    if (view === 'members') {
      const { data, error } = await supabaseAdmin
        .from('community_members')
        .select('*')
        .order('joined_at', { ascending: false });

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ members: data || [] });
    }

    // Default: return applications
    const { data, error } = await supabaseAdmin
      .from('member_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ applications: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Approve or reject an application (admin action)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, application_id, rejection_reason, admin_notes } = body;

    if (!action || !application_id) {
      return NextResponse.json({ error: 'action and application_id are required' }, { status: 400 });
    }

    // Fetch the application first
    const { data: application, error: fetchError } = await supabaseAdmin
      .from('member_applications')
      .select('*')
      .eq('id', application_id)
      .single();

    if (fetchError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (action === 'approve') {
      const token = randomUUID();

      // Update application status to approved and set approval token
      const { error: updateError } = await supabaseAdmin
        .from('member_applications')
        .update({
          status: 'approved',
          approval_token: token,
          admin_notes: admin_notes || null,
        })
        .eq('id', application_id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      // Build profile completion link
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const completionLink = `${baseUrl}/members/complete-profile?token=${token}`;

      return NextResponse.json({
        success: true,
        message: `Application approved. Share the profile completion link with the member.`,
        completion_link: completionLink,
        token,
      });
    }

    if (action === 'reject') {
      const { error: updateError } = await supabaseAdmin
        .from('member_applications')
        .update({
          status: 'rejected',
          rejection_reason: rejection_reason || null,
          admin_notes: admin_notes || null,
        })
        .eq('id', application_id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Application rejected.' });
    }

    if (action === 'deactivate_member') {
      const { member_id } = body;
      if (!member_id) return NextResponse.json({ error: 'member_id required' }, { status: 400 });

      await supabaseAdmin
        .from('community_members')
        .update({ is_active: false })
        .eq('id', member_id);

      return NextResponse.json({ success: true, message: 'Member deactivated.' });
    }

    if (action === 'activate_member') {
      const { member_id } = body;
      if (!member_id) return NextResponse.json({ error: 'member_id required' }, { status: 400 });

      await supabaseAdmin
        .from('community_members')
        .update({ is_active: true })
        .eq('id', member_id);

      return NextResponse.json({ success: true, message: 'Member activated.' });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    console.error('Admin members API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
