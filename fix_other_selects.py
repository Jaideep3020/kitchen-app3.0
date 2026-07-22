import re
import glob

for filename in glob.glob('src/components/*.tsx'):
    with open(filename, 'r') as f:
        text = f.read()
    
    # We want to add touch-manipulation and maybe min-h-[44px] to select tags if they don't have it
    # We'll just naively add touch-manipulation to any <select that doesn't have it
    def add_touch_manipulation(match):
        tag = match.group(0)
        if 'touch-manipulation' not in tag:
            if 'className="' in tag:
                return tag.replace('className="', 'className="touch-manipulation min-h-[44px] ')
        return tag

    text = re.sub(r'<select[^>]*>', add_touch_manipulation, text)
    
    with open(filename, 'w') as f:
        f.write(text)

