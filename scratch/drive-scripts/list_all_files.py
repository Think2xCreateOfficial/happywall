import re

for cat, fname in [('Anime', 'drive_anime.html'), ('Games', 'drive_games.html'), ('Split Poster', 'drive_split_poster.html')]:
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # In each <tr> block:
    # <tr ... data-id="ID" ...
    # ... <div class="JxSEve" aria-label="FILENAME ...
    # Let's split by '<tr data-selectable'
    blocks = html.split('<tr data-selectable')
    print(f"\n=================== {cat} ===================")
    seen = set()
    for block in blocks[1:]:
        m_id = re.search(r'data-id="([a-zA-Z0-9_-]{25,})"', block)
        m_name = re.search(r'class="JxSEve"[^>]*?aria-label="([^"]+)"', block)
        if m_id and m_name:
            fid = m_id.group(1)
            name = m_name.group(1)
            if fid not in seen:
                seen.add(fid)
                clean_name = name.replace(' Image', '').replace(' Shared file', '').strip()
                print(f"'{fid}': '{clean_name}',")

