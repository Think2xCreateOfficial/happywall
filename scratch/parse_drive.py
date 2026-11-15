import re
import json

with open("scratch/drive_page.html", "r", encoding="utf-8") as f:
    html = f.read()

# Look for bootstrap data or JSON patterns
# Often Google Drive stores folder items in a JS variable like _DRIVE_BOOTSTRAP_DATA or similar
patterns = [
    r'window\[\'_DRIVE_BOOTSTRAP_DATA\'\]\s*=\s*({.*?});',
    r'var _DRIVE_BOOTSTRAP_DATA\s*=\s*({.*?});',
    r'data-params="([^"]+)"',
]

print("Searching for patterns...")

# Find all occurrences of file-like or folder-like structures:
# In Google Drive HTML, item IDs are 33-char alphanumeric strings like 1...
# Also look for names like Anime, Games, Split or image extensions .jpg, .png, .webp
found_names = re.findall(r'\"([^\"]+\.(?:jpg|jpeg|png|webp|JPG|PNG))\"', html)
print(f"Direct image filenames found ({len(found_names)}):", found_names[:30])

# Find folder names:
folder_matches = re.findall(r'\[\"([a-zA-Z0-9_-]{28,45})\",\[\"([^\"]+)\"', html)
print(f"Folder/item id matches ({len(folder_matches)}):")
for fid, name in folder_matches[:30]:
    print(f"  {fid} : {name}")

# Also search for "Anime", "Games", "Split" in the HTML context
for keyword in ["Anime", "anime", "Games", "games", "Split", "split"]:
    matches = [m.start() for m in re.finditer(keyword, html)]
    print(f"Keyword '{keyword}' found {len(matches)} times")
    for idx in matches[:5]:
        snippet = html[max(0, idx-100):min(len(html), idx+150)]
        print(f"   Snippet near {idx}: {repr(snippet)}")

