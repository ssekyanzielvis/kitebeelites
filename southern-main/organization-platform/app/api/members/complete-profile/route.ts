import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// GET: Validate token and return applicant info for the profile completion form
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required.' }, { status: 400 });
    }

    const { data: application, error } = await supabaseAdmin
      .from('member_applications')
      .select('id, full_name, email, status, approval_token, profile_completed')
      .eq('approval_token', token)
      .single();

    if (error || !application) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 404 });
    }

    if (application.status !== 'approved') {
      return NextResponse.json({ error: 'This application has not been approved.' }, { status: 403 });
    }

    if (application.profile_completed) {
      return NextResponse.json({ error: 'Profile has already been completed.' }, { status: 409 });
    }

    return NextResponse.json({
      valid: true,
      full_name: application.full_name,
      email: application.email,
      application_id: application.id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Complete profile after approval (upload image URL + extra info)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, profile_image_url, extra_profile_info } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token is required.' }, { status: 400 });
    }

    // Validate token and get application
    const { data: application, error: appError } = await supabaseAdmin
      .from('member_applications')
      .select('*')
      .eq('approval_token', token)
      .single();

    if (appError || !application) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 404 });
    }

    if (application.status !== 'approved') {
      return NextResponse.json({ error: 'Application is not approved.' }, { status: 403 });
    }

    if (application.profile_completed) {
      return NextResponse.json({ error: 'Profile already completed.' }, { status: 409 });
    }

    // Check if member record already exists (idempotency)
    const { data: existingMember } = await supabaseAdmin
      .from('community_members')
      .select('id')
      .eq('email', application.email)
      .single();

    if (!existingMember) {
      // Create community_members record
      const { error: memberError } = await supabaseAdmin
        .from('community_members')
        .insert({
          application_id: application.id,
          full_name: application.full_name,
          email: application.email,
          phone_number: application.phone_number,
          nationality: application.nationality,
          gender: application.gender,
          date_of_birth: application.date_of_birth,
          why_join: application.why_join,
          self_description: application.self_description,
          academic_background: application.academic_background,
          education_level: application.education_level,
          additional_info: application.additional_info,
          profile_image_url: profile_image_url || null,
          extra_profile_info: extra_profile_info?.trim() || null,
          is_active: true,
        });

      if (memberError) {
        console.error('Member insert error:', memberError);
        return NextResponse.json({ error: memberError.message }, { status: 500 });
      }
    } else {
      // Update existing record
      await supabaseAdmin
        .from('community_members')
        .update({
          profile_image_url: profile_image_url || null,
          extra_profile_info: extra_profile_info?.trim() || null,
        })
        .eq('email', application.email);
    }

    // Mark application as profile_completed and clear token for security
    await supabaseAdmin
      .from('member_applications')
      .update({
        profile_completed: true,
        approval_token: null,
      })
      .eq('id', application.id);

    return NextResponse.json({
      success: true,
      message: 'Profile completed! Welcome to the community.',
    });
  } catch (err: any) {
    console.error('Complete profile API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
