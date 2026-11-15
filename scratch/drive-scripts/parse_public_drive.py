import re
import json

with open('drive_public.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's search for keywords: Anime, Games, Split
keywords = ['Anime', 'anime', 'Games', 'games', 'Split', 'split', 'Poster', 'poster']
for kw in keywords:
    matches = [m.start() for m in re.finditer(kw, html)]
    print(f'Keyword {kw}: {len(matches)} occurrences')
    for pos in matches[:3]:
        snippet = html[max(0, pos-80):min(len(html), pos+120)]
        print('  Snippet:', repr(snippet))

# Find 33-char alphanumeric Google Drive IDs
id_matches = set(re.findall(r'[\'\"\/](1[a-zA-Z0-9_-]{32})[\'\"\/]', html))
print(f'Total potential IDs found: {len(id_matches)}')
for i in list(id_matches)[:25]:
    pos = html.find(i)
    snippet = html[max(0, pos-40):min(len(html), pos+80)]
    print(f'  {i}: {repr(snippet)}')

