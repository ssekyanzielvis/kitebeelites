const SUPABASE_URL = 'https://qffnrkhkgxjeforrubne.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmZm5ya2hrZ3hqZWZvcnJ1Ym5lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk4MDIxMiwiZXhwIjoyMTAyNTU2MjEyfQ.cTvor6iV8MNorVHyYiFRDC__hUGq5xPCwngKlbIqU-s';

const tables = [
  'hello_slides','about_us','vision','mission','objectives',
  'programs','achievements','core_values','news','gallery','leadership'
];

async function clearUnsplash(table) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?image_url=ilike.*unsplash*`;
  const r = await fetch(url, {
    method: 'PATCH',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ image_url: null })
  });
  const text = await r.text();
  let count = 0;
  try { count = JSON.parse(text).length || 0; } catch(_) {}
  console.log(`${table}: cleared ${count} (status ${r.status})`);
}

(async () => {
  for (const table of tables) {
    await clearUnsplash(table);
  }
  console.log('Done.');
})();
