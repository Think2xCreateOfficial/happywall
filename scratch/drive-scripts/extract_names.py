import re
import json

files_by_cat = {
    'Anime': 'drive_anime.html',
    'Games': 'drive_games.html',
    'Split Poster': 'drive_split_poster.html'
}

catalog = {}

for cat, html_file in files_by_cat.items():
    with open(html_file, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # In Google Drive list/grid, names are often in:
    # data-tooltip="FILENAME" or aria-label="FILENAME" or inside <div class="...">FILENAME</div>
    # Let's find matches around each data-id
    # Look for patterns: data-id="ID" ... data-tooltip="(?P<name>[^"]+)"
    # Or [ "ID", [ "NAME" ... ] ]
    
    # Also let's extract unique IDs in order:
    raw_ids = re.findall(r'data-id="([a-zA-Z0-9_-]{25,})"', html)
    unique_ids = []
    for fid in raw_ids:
        if fid not in unique_ids:
            unique_ids.append(fid)
    
    cat_items = []
    for fid in unique_ids:
        # find where fid occurs
        # Google Drive has: ["ID", ["FILENAME", ...]] or data-id="ID" ... data-tooltip="FILENAME"
        # Let's search in html for fid
        pos = html.find(f'data-id="{fid}"')
        name = None
        if pos != -1:
            snippet = html[pos:pos+1500]
            # search for data-tooltip
            m = re.search(r'data-tooltip="([^"]+)"', snippet)
            if m:
                name = m.group(1)
            else:
                m2 = re.search(r'aria-label="([^"]+)"', snippet)
                if m2:
                    name = m2.group(1)
                else:
                    m3 = re.search(r'<strong[^>]*>([^<]+)</strong>', snippet)
                    if m3:
                        name = m3.group(1)
        
        # Also check JS array pattern: ["ID",["NAME"
        if not name or name == fid:
            m_js = re.search(rf'\[\"{fid}\",\s*\[\"([^\"]+)\"', html)
            if m_js:
                name = m_js.group(1)

        # Clean name
        if name:
            name = name.replace(' Image', '').replace(' Shared file', '').replace(' shared file', '').strip()
            # remove .jpg, .png, etc. for title
            display_title = re.sub(r'\.(?:jpg|jpeg|png|webp|JPG|PNG)$', '', name).strip()
        else:
            name = f"{cat} Poster"
            display_title = f"{cat} Poster"

        cat_items.append({
            'id': fid,
            'fileName': name,
            'title': display_title,
            'driveUrl': f"https://drive.google.com/file/d/{fid}/view?usp=sharing",
            'imageUrl': f"https://lh3.googleusercontent.com/d/{fid}"
        })
        print(f"[{cat}] {fid} -> {display_title}")

    catalog[cat] = cat_items

with open("drive_catalog_detailed.json", "w", encoding="utf-8") as f:
    json.dump(catalog, f, indent=2)

print("Done! Saved drive_catalog_detailed.json")

