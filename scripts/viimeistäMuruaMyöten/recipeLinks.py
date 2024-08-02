import requests
from bs4 import BeautifulSoup

base_url = "https://viimeistamuruamyoten.com"

category_paths = [
    "/aamiainen-ja-brunssi/",
    "/sormisyotavaa/",
    "/kevyesti/",
    "/paaruoka/",
    "/street-food/",
    "/suolainen-leivonta-ja-leivat/",
    "/makeasti/",
    "/arjen-nopeat/",
    "/vegaani/",
]

unique_recipe_urls = set()


def is_link_inside_navigation(link):
    parent = link.parent
    while parent:
        if 'menu-item' in parent.get('class', []):
            return True
        parent = parent.parent
    return False

def is_page_url(url):
    return 'page=' in url

def scrape_category(category_path, page=1):
    full_url = f"{base_url}{category_path}page/{page}/" if page > 1 else f"{base_url}{category_path}"
    response = requests.get(full_url)
    if response.status_code != 200:
        return

    soup = BeautifulSoup(response.text, 'html.parser')
    recipe_links = soup.find_all('a', href=True)

    for link in recipe_links:
        if is_link_inside_navigation(link):
            continue
        href = link.get('href')
        if href and href.startswith(base_url) and "/category/" not in href and not is_page_url(href):
            unique_recipe_urls.add(href)


for path in category_paths:
    scrape_category(path)

for recipe_url in unique_recipe_urls:
    print(f'"{recipe_url}",')

print(f"Total unique recipe URLs found: {len(unique_recipe_urls)}")
