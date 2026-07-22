import re

with open('src/components/StaffDashboard.tsx', 'r') as f:
    text = f.read()

# Replace <div onClick=... with <Pressable onClick=... and closing tags.
# This requires some care because we don't want to replace all divs.
# I will just write a script to replace the specific card containers.

text = text.replace('<div \n    onClick={() => { triggerHaptic(\'medium\'); setShowModal(\'diners\'); }}', '<Pressable \n    onClick={() => { setShowModal(\'diners\'); }}')
text = text.replace('<div\n    onClick={() => { setShowModal(\'delivery\'); }}', '<Pressable glowColor="blue"\n    onClick={() => { setShowModal(\'delivery\'); }}')
text = text.replace('<div\n    onClick={() => { setShowModal(\'leftovers\'); }}', '<Pressable glowColor="amber"\n    onClick={() => { setShowModal(\'leftovers\'); }}')
text = text.replace('<div\n    onClick={() => { if (onNavigate) { window.scrollTo(0,0); onNavigate(\'ops\'); } }}', '<Pressable glowColor="emerald"\n    onClick={() => { if (onNavigate) { window.scrollTo(0,0); onNavigate(\'ops\'); } }}')
text = text.replace('<div\n    onClick={() => { setShowModal(\'issue\'); }}', '<Pressable glowColor="rose"\n    onClick={() => { setShowModal(\'issue\'); }}')

# These have a matching closing </div> that we need to change to </Pressable>.
# Since they are exactly the ones I'm modifying, I will use regex to find the matching closing tag.
# Let's just do it manually for these specific blocks since it's easier to find the block structure.
