import os, glob

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            if 'value=' in content and '<input' in content:
                print(f"File: {filepath}")
