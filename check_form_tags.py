import os, glob, re

def find_inputs(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Find all input/textarea/select tags
    tags = re.findall(r'<input[^>]*>', content)
    tags += re.findall(r'<textarea[^>]*>', content)
    tags += re.findall(r'<select[^>]*>', content)

    for tag in tags:
        if 'value=' in tag and 'onChange=' not in tag and 'readOnly' not in tag and 'defaultValue=' not in tag:
            print(f"File: {file_path}")
            print(f"Tag: {tag}")
            print("-" * 20)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx'):
            find_inputs(os.path.join(root, file))
