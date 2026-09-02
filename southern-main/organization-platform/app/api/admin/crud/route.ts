import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(req: Request) {
  try {
    const { table, action, data, match } = await req.json();

    if (!table || !action) {
      return NextResponse.json({ error: { message: 'Missing table or action' } }, { status: 400 });
    }

    let query: any;
    
    if (action === 'insert') {
      query = supabaseAdmin.from(table).insert(data);
    } else if (action === 'update') {
      query = supabaseAdmin.from(table).update(data);
    } else if (action === 'delete') {
      query = supabaseAdmin.from(table).delete();
    } else {
      return NextResponse.json({ error: { message: 'Invalid action' } }, { status: 400 });
    }

    if (match && (action === 'update' || action === 'delete')) {
      for (const [key, value] of Object.entries(match)) {
        query = query.eq(key, value);
      }
    }

    const { data: result, error } = await query;

    if (error) {
      return NextResponse.json({ error });
    }

    return NextResponse.json({ data: result, error: null });
  } catch (err: any) {
    return NextResponse.json({ error: { message: err.message } }, { status: 500 });
  }
}
