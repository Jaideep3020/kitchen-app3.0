const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "const id = parseInt(req.params.id);",
  "let id: string | number = parseInt(req.params.id);\n    if (isNaN(id)) id = req.params.id;"
);

// We need to apply this to all parseInt(req.params.id) in server.ts
code = code.replace(/const id = parseInt\(req\.params\.id\);/g, "let id: any = req.params.id; if (!isNaN(parseInt(id))) id = parseInt(id);");

fs.writeFileSync('server.ts', code);
