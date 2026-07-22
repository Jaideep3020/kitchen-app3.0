const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    // We match the tag opening. We need to be careful with nested things, but regex is usually fine for simple JSX tags.
    // Match <tag ... >
    const regex = /<(button|a|input|select|textarea)([\s\S]*?)>/g;
    
    content = content.replace(regex, (match, tag, attrs) => {
        // Skip closing tags or self-closing if it's just `/>` without spaces (handled by \s\S but let's be safe)
        if (match.startsWith('</')) return match;
        
        // If it already has ANY focus state (focus:ring, focus:border, focus:outline, focus-visible)
        if (attrs.includes('focus:') || attrs.includes('focus-visible:')) {
            return match;
        }
        
        const focusClasses = 'focus-visible:ring-2 focus-visible:ring-[#D9E96B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EAF5E4] dark:focus-visible:ring-offset-[#121212] focus-visible:outline-none';
        
        // Let's find className
        // It could be className="...", className={'...'}, className={`...`}
        const classNameRegex = /className=(?:(["'])([\s\S]*?)\1|\{`([\s\S]*?)`\}|\{([\s\S]*?)\})/;
        
        if (classNameRegex.test(attrs)) {
            const newAttrs = attrs.replace(classNameRegex, (clsMatch, q, strVal, backtickVal, exprVal) => {
                if (strVal !== undefined) {
                    return `className=${q}${strVal} ${focusClasses}${q}`;
                } else if (backtickVal !== undefined) {
                    return `className={\`${backtickVal} ${focusClasses}\`}`;
                } else {
                    return clsMatch;
                }
            });
            if (newAttrs !== attrs) {
                changed = true;
                return `<${tag}${newAttrs}>`;
            }
        } else {
            // Add className before the first > or />
            changed = true;
            if (attrs.endsWith('/')) {
                return `<${tag} className="${focusClasses}" ${attrs.slice(0, -1)}/>`;
            } else {
                return `<${tag} className="${focusClasses}"${attrs}>`;
            }
        }
        
        return match;
    });
    
    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
    }
});
console.log("Done");
