import urllib.request

url = 'https://drive.google.com/drive/folders/1N3GF-p4HRpOLxQULoDpRQk5iJazO-58K?usp=sharing'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})

class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        print(f"Redirected with code {code} to: {newurl}")
        return super().redirect_request(req, fp, code, msg, headers, newurl)

opener = urllib.request.build_opener(NoRedirectHandler)
try:
    with opener.open(req) as resp:
        print("Final URL:", resp.geturl())
        print("HTTP Status:", resp.getcode())
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code} - {e.reason}")
    if 'Location' in e.headers:
        print("Location header:", e.headers['Location'])
except Exception as e:
    print("Error:", e)

