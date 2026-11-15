import re
import json

with open("scratch/drive_page.html", "r", encoding="utf-8") as f:
    content = f.read()

print("File size:", len(content))

# Look for JavaScript strings that contain folder or file data
# Often in Google Drive, file lists are in:
# `window['_DRIVE_BOOTSTRAP_DATA']` or `AF_initDataCallback`
af_data = re.findall(r'AF_initDataCallback\s*\(\s*({.*?})\s*\)\s*;', content, re.DOTALL)
print(f"AF_initDataCallback blocks found: {len(af_data)}")

for i, block in enumerate(af_data):
    print(f"\n--- Block {i} (len {len(block)}) ---")
    # check if key 'data' is inside
    match_key = re.search(r'key:\s*[\'"]([^\'"]+)[\'"]', block)
    if match_key:
        print("Key:", match_key.group(1))
    # look for any strings with extensions or names
    names = re.findall(r'\"([^\"]+\.(?:jpg|jpeg|png|webp|JPG|PNG))\"', block)
    if names:
        print("Images in block:", names)

# Search for any Google Drive file ID pattern [ "1...33chars...", ... ]
id_candidates = set(re.findall(r'[\'"](1[a-zA-Z0-9_-]{32})[\'"]', content))
print(f"\nPotential Google Drive File/Folder IDs ({len(id_candidates)}):")
for cid in id_candidates:
    print("  ID:", cid)
    # Find context around this ID
    pos = content.find(cid)
    context = content[max(0, pos-80):min(len(content), pos+150)]
    print("   Context:", repr(context))

