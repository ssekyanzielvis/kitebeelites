import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const NEXT_PUBLIC_SUPABASE_URL = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1] || '';
const SUPABASE_SERVICE_ROLE_KEY = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1] || '';

const supabaseAdmin = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

async function testSelectTheme() {
  const { data, error } = await supabaseAdmin.from('theme_settings').select('*');
  console.log('Error:', error);
  console.log('Data:', data);
}

testSelectTheme();
