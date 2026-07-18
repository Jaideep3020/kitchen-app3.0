import fs from 'fs';
let code = fs.readFileSync('src/contexts/DataContext.tsx', 'utf8');

const regex = /    };\n    loadFromBackend\(\);\n  }, \[\]\);/m;

const replacement = `    };
    loadFromBackend();
    const intervalId = setInterval(loadFromBackend, 3000);
    return () => clearInterval(intervalId);
  }, []);`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/contexts/DataContext.tsx', code);
    console.log("Successfully patched interval");
} else {
    console.log("Regex didn't match");
}
