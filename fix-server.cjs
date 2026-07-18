const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Ensure rateLimit is imported
if (!content.includes('import rateLimit')) {
  content = content.replace("import compression from 'compression';", "import compression from 'compression';\nimport rateLimit from 'express-rate-limit';");
}

// Ensure express.json() is used
if (!content.includes('app.use(express.json())')) {
  content = content.replace("app.use(cors());", "app.use(cors());\n  app.use(express.json());");
}

// Ensure express.static() is used
if (!content.includes('app.use(express.static(distPath))')) {
  content = content.replace("const distPath = path.join(process.cwd(), 'dist');", "const distPath = path.join(process.cwd(), 'dist');\n    app.use(express.static(distPath));");
}

fs.writeFileSync('server.ts', content);
