import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      full_name,
      email,
      phone_number,
      nationality,
      gender,
      date_of_birth,
      why_join,
      self_description,
      academic_background,
      education_level,
      additional_info,
      policies_accepted,
    } = body;

    // Validate required fields
    if (
      !full_name || !email || !phone_number || !nationality ||
      !gender || !date_of_birth || !why_join || !self_description ||
      !academic_background || !education_level
    ) {
      return NextResponse.json(
        { error: 'All required fields must be filled.' },
        { status: 400 }
      );
    }

    if (!policies_accepted) {
      return NextResponse.json(
        { error: 'You must accept the community policies to apply.' },
        { status: 400 }
      );
    }

    // Check for duplicate application
    const { data: existing } = await supabaseAdmin
      .from('member_applications')
      .select('id, status')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existing) {
      const statusMsg =
        existing.status === 'approved'
          ? 'Your application has already been approved.'
          : existing.status === 'rejected'
          ? 'Your previous application was not accepted. Please contact the administrator.'
          : 'An application with this email is already under review.';
      return NextResponse.json({ error: statusMsg }, { status: 409 });
    }

    // Insert application
    const { data, error } = await supabaseAdmin
      .from('member_applications')
      .insert({
        full_name: full_name.trim(),
        email: email.toLowerCase().trim(),
        phone_number: phone_number.trim(),
        nationality: nationality.trim(),
        gender,
        date_of_birth,
        why_join: why_join.trim(),
        self_description: self_description.trim(),
        academic_background: academic_background.trim(),
        education_level,
        additional_info: additional_info?.trim() || null,
        policies_accepted: true,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Application insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully! We will review it and get back to you.',
      id: data.id,
    });
  } catch (err: any) {
    console.error('Apply API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
