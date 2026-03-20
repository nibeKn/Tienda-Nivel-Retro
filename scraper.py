import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import re
import json

games = [
    "Super Mario 64",
    "Diddy Kong Racing",
    "The Legend of Zelda: Ocarina of Time",
    "Mario Kart 64",
    "Banjo-Kazooie",
    "Donkey Kong 64",
    "Star Fox 64",
    "Conker's Bad fur day",
    "Bomberman Hero"
]

results = {}

for name in games:
    search_url = f'https://gamesdb.launchbox-app.com/games/results?Platform=Nintendo+64&Search={urllib.parse.quote(name)}'
    req = urllib.request.Request(search_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        match = re.search(r'/games/details/(\d+)', html)
        if match:
            game_id = match.group(1)
            img_url = f'https://gamesdb.launchbox-app.com/games/images/{game_id}'
            req2 = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
            html2 = urllib.request.urlopen(req2).read().decode('utf-8')
            soup = BeautifulSoup(html2, 'html.parser')
            
            box3d = ""
            cart = ""
            snaps = []
            
            for a in soup.find_all('a'):
                title = a.get('data-title', '') or ''
                href = a.get('href', '') or ''
                if 'Box - 3D' in title and not box3d:
                    box3d = href
                elif 'Cartridge - Front' in title and not cart:
                    cart = href
                elif 'Screenshot - Gameplay' in title and len(snaps) < 4:
                    if href not in snaps:
                        snaps.append(href)
                    
            results[name] = {
                'box3d': box3d,
                'cart': cart,
                'snaps': snaps
            }
            print(f"Done {name}")
        else:
            print(f"ID not found for {name}")
    except Exception as e:
        print(f'Error for {name}:', e)

with open('scraper_results.json', 'w') as f:
    json.dump(results, f, indent=2)
print("Finished")
