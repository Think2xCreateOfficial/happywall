import urllib.request
import re
import json

folders = {
    'Anime': '1NbgUeAddJMc-PsM2op3RcgeZ6JIwujf9',
    'Games': '16LET3GDdQT8ATOxmryT_6m_4jW7SrH0y',
    'Split Poster': '1OXMvpUnMtxVnVN0158DRjD0qOhJAb2qZ',
}

results = {}

for category, folder_id in folders.items():
    url = f"https://drive.google.com/drive/folders/{folder_id}?usp=sharing"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"[{category}] Fetched {len(html)} bytes")
            with open(f"drive_{category.lower().replace(' ', '_')}.html", "w", encoding="utf-8") as f:
                f.write(html)
            
            # Find file IDs and names in the HTML
            # Google Drive rows: data-id="FILE_ID" ... data-tooltip="FILENAME" or aria-label="FILENAME"
            # Look for table rows: <tr data-selectable data-id="(?P<id>[a-zA-Z0-9_-]{28,})" ... aria-label="(?P<name>[^"]+)"
            rows = re.findall(r'data-id="([a-zA-Z0-9_-]{25,})"[^>]*?aria-label="([^"]+)"', html)
            print(f"[{category}] Found {len(rows)} rows with aria-label")
            if not rows:
                # Try finding data-id and nearby text
                ids = re.findall(r'data-id="([a-zA-Z0-9_-]{25,})"', html)
                print(f"[{category}] Found {len(ids)} data-id entries: {ids}")
            
            items = []
            for fid, label in rows:
                # clean up label (sometimes ends with 'Image' or 'Shared file')
                name = label.replace(' Image', '').replace(' Shared file', '').replace(' shared file', '').strip()
                items.append({'id': fid, 'name': name, 'raw_label': label})
                print(f"   {fid} : {name}")
            results[category] = items
    except Exception as e:
        print(f"[{category}] Error: {e}")

with open("drive_catalog.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print("\nSaved drive_catalog.json successfully!")

