import fs from 'fs';
let code = fs.readFileSync('src/contexts/DataContext.tsx', 'utf8');

const regex = /    loadFromBackend\(\);\n    const intervalId = setInterval\(loadFromBackend, 3000\);\n    return \(\) => clearInterval\(intervalId\);/m;
const replacement = `    loadFromBackend();`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/contexts/DataContext.tsx', code);
    console.log("Successfully removed interval");
} else {
    console.log("Regex didn't match");
}
