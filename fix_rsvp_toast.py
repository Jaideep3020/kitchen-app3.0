import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

old_onClick = """onClick={async () => {
       const nextExempted = !sharedConfig?.config?.cutoffExempted;
       const nextConfig = { ...sharedConfig?.config, cutoffExempted: nextExempted };
       await updateSharedConfig(nextConfig, 'admin');
     }}"""

new_onClick = """onClick={async () => {
       const nextExempted = !sharedConfig?.config?.cutoffExempted;
       const nextConfig = { ...sharedConfig?.config, cutoffExempted: nextExempted };
       const success = await updateSharedConfig(nextConfig, 'admin');
       if (success) {
         addToast(nextExempted ? "RSVP blocked" : "RSVP opened", "success");
       } else {
         addToast("Failed to update RSVP status", "error");
       }
     }}"""

text = text.replace(old_onClick, new_onClick)

with open('src/App.tsx', 'w') as f:
    f.write(text)
