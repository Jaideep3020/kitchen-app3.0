with open('src/contexts/ToastContext.tsx', 'r') as f:
    content = f.read()

import re

# Update the container: bottom-center instead of bottom-right
content = re.sub(
    r'<div className="fixed bottom-20 md:bottom-6 right-4 z-\[9999\] flex flex-col gap-2 pointer-events-none">',
    '<div className="fixed bottom-[calc(env(safe-area-inset-bottom)+5rem)] md:bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none items-center w-full max-w-sm px-4">',
    content
)

# Replace the motion.div attributes and className
# Using #16321F as background and #D9E96B as accent/icon
toast_render = """
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="pointer-events-auto w-full md:w-auto min-w-[280px] px-4 py-3 rounded-2xl shadow-xl border border-[#D9E96B]/20 bg-[#16321F] text-white flex items-center gap-3"
            >
              <div className="flex-shrink-0">
                {toast.type === 'success' && <svg className="w-5 h-5 text-[#D9E96B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                {toast.type === 'error' && <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>}
                {toast.type === 'info' && <svg className="w-5 h-5 text-[#D9E96B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              </div>
              <div className="text-sm font-bold tracking-tight">{toast.message}</div>
            </motion.div>
"""

content = re.sub(
    r'<motion\.div\s+key=\{toast\.id\}[\s\S]*?</motion\.div>',
    toast_render.strip(),
    content
)

with open('src/contexts/ToastContext.tsx', 'w') as f:
    f.write(content)
