export function adminDb(table: string) {
  return {
    insert: async (data: any) => {
      const res = await fetch('/api/admin/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, action: 'insert', data }),
      });
      return res.json();
    },
    update: (data: any) => ({
      eq: async (col: string, val: any) => {
        const res = await fetch('/api/admin/crud', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ table, action: 'update', data, match: { [col]: val } }),
        });
        return res.json();
      },
    }),
    delete: () => ({
      eq: async (col: string, val: any) => {
        const res = await fetch('/api/admin/crud', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ table, action: 'delete', match: { [col]: val } }),
        });
        return res.json();
      },
    }),
  };
}
