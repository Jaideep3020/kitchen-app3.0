import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Add import
if "import { Pressable }" not in text:
    text = text.replace("import { triggerHaptic } from './lib/haptics';", "import { triggerHaptic } from './lib/haptics';\nimport { Pressable } from './components/Pressable';")

# Nav buttons
def replace_button(match):
    full_tag = match.group(0)
    # Don't replace if it's already Pressable
    if full_tag.startswith('<Pressable'):
        return full_tag
        
    # We'll determine glowColor based on the content or className
    glowColor = "gray"
    
    # We must remove triggerHaptic from onClick because Pressable handles it onPointerDown
    # But wait, triggerHaptic might be 'medium' or 'success' in some places.
    # The prompt says: "trigger a light haptic (e.g. triggerHaptic('light')) on press-start, not on release, so it feels instant."
    # Pressable does this. So we can just remove triggerHaptic('light') from onClick.
    full_tag = full_tag.replace("triggerHaptic('light'); ", "")
    
    return full_tag.replace("<button", "<Pressable glowColor=\"" + glowColor + "\"").replace("</button>", "</Pressable>")

# We need to replace all <button ...> ... </button> recursively but python re doesn't do nested very well.
# Since App.tsx has simple buttons, we can just replace `<button` with `<Pressable` and `</button>` with `</Pressable>`.
# But wait, some buttons are active and have a different color. Let's just do a naive replacement.
# Let's write a smarter Python script.

text = text.replace('<button', '<Pressable')
text = text.replace('</button>', '</Pressable>')

# Remove triggerHaptic('light'); from all inside App.tsx since Pressable does it.
text = text.replace("triggerHaptic('light'); ", "")
text = text.replace("triggerHaptic('light');", "")

with open('src/App.tsx', 'w') as f:
    f.write(text)
