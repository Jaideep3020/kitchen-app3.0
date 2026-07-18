const fs = require('fs');
let code = fs.readFileSync('src/api.ts', 'utf8');

const newApi = `
export const updateSupplier = async (supplier: any): Promise<void> => {
  let id = supplier.id;
  if (typeof id === 'string' && id.startsWith('sup_')) {
     id = id.replace('sup_', '');
  }
  const res = await fetch(\`/api/suppliers/\${id}\`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(supplier)
  });
  if (!res.ok) throw new Error('Failed to update supplier');
};
`;

code += newApi;
fs.writeFileSync('src/api.ts', code);
