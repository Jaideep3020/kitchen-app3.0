const fs = require('fs');
let lines = fs.readFileSync('server.ts', 'utf8').split('\n');
lines = lines.filter(line => !line.includes("import expressimport"));
lines.unshift("import express from 'express';\nimport bcrypt from 'bcrypt';");
fs.writeFileSync('server.ts', lines.join('\n'));
