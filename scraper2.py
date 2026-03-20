import urllib.request
import json
import re

game_id = '430343' # Super Mario 64
types = [35, 3, 4] # 35: Box 3D, 3: Cartridge Front, 4: Screenshot
for t in types:
    url = f'https://gamesdb.launchbox-app.com/games/images/{game_id}?typeId={t}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        links = re.findall(r'href="(https://images.launchbox-app.com[^\"]+)"', html)
        print(f"Type {t}: Fetched {len(links)} links. Sample: {links[:4]}")
    except Exception as e:
        print(f"Error {t}:", e)
