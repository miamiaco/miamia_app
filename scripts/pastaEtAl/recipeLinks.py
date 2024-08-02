import requests
from bs4 import BeautifulSoup

# URL of the recipes category page
url = 'https://pastaetal.com/category/recipes/'

# Function to get HTML content of a page
def get_html(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise HTTPError for bad responses
        print(f"Successfully retrieved the page: {url}")
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error retrieving the page: {e}")
        return None

# Function to parse recipe links from HTML
def parse_recipe_links(html):
    soup = BeautifulSoup(html, 'html.parser')
    recipe_links = []
    for h3 in soup.find_all('h3', class_='entry-title'):
        a_tag = h3.find('a', href=True)
        if a_tag:
            recipe_links.append(a_tag['href'])
    print(f"Found {len(recipe_links)} recipe links on the page")
    return recipe_links

# Get HTML content of the page
html_content = get_html(url)
if html_content:
    # Parse and print recipe links
    recipe_links = parse_recipe_links(html_content)
    if recipe_links:
        for link in recipe_links:
            print(f'"{link}",')
    else:
        print("No recipe links found on the page.")
else:
    print('Failed to retrieve the page')
