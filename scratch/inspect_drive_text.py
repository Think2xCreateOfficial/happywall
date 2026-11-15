import re
from html.parser import HTMLParser

with open("scratch/drive_page.html", "r", encoding="utf-8") as f:
    html = f.read()

title_match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
print("Page Title:", title_match.group(1) if title_match else "No title")

body_text = re.sub(r'<[^>]+>', ' ', html)
clean_text = ' '.join(body_text.split())
print("Clean body text snippet:", clean_text[:500])
