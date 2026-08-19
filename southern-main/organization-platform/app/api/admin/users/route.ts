import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// GET — list all admins
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('admins')
    .select('id, full_name, email, phone_number, image_url, is_active, created_at')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ admins: data });
}

// POST — create new admin
export async function POST(request: NextRequest) {
  try {
    const { full_name, email, phone_number, image_url, password } = await request.json();

    if (!full_name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('admins').insert({
      full_name,
      email,
      phone_number: phone_number || null,
      image_url: image_url || null,
      password_hash: hashPassword(password),
      is_active: true,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH — update admin (full edit or partial, e.g. just is_active toggle)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, full_name, email, phone_number, image_url, password, is_active } = body;

    if (!id) return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });

    const updateData: any = { updated_at: new Date().toISOString() };

    if (typeof is_active === 'boolean') updateData.is_active = is_active;
    if (full_name !== undefined) updateData.full_name = full_name;
    if (email !== undefined) updateData.email = email;
    if (phone_number !== undefined) updateData.phone_number = phone_number || null;
    if (image_url !== undefined) updateData.image_url = image_url || null;
    if (password) updateData.password_hash = hashPassword(password);

    const { error } = await supabaseAdmin.from('admins').update(updateData).eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — remove admin
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });

    const { error } = await supabaseAdmin.from('admins').delete().eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
