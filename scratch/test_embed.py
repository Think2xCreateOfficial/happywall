import urllib.request
import re

url = "https://drive.google.com/embeddedfolderview?id=1N3GF-p4HRpOLxQULoDpRQk5iJazO-58K#grid"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"Embedded view HTML length: {len(html)}")
        with open("scratch/embedded_view.html", "w", encoding="utf-8") as f:
            f.write(html)
        print("Saved scratch/embedded_view.html")
except Exception as e:
    print(f"Error: {e}")

