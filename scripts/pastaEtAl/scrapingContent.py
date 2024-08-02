import requests
from bs4 import BeautifulSoup
import json

def get_html(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error retrieving the page: {e}")
        return None

def extract_recipe_details(url):
    html_content = get_html(url)
    if html_content:
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Extract title
        title_tag = soup.find('h1', class_='entry-title')
        title = title_tag.text.strip() if title_tag else 'No title'

        # Extract first image
        image_tag = soup.find('figure', class_='wp-block-image')
        image_url = image_tag.find('img')['src'] if image_tag and image_tag.find('img') else 'No image'

        # Extract content paragraphs until <div id="recipe">
        content_paragraphs = []
        for element in soup.find_all(['p', 'div']):
            if element.name == 'div' and element.get('id') == 'recipe':
                break
            if element.name == 'p':
                content_paragraphs.append(element.text.strip())

        # Extract times
        times = {}
        time_labels = ["Prep Time", "Cook Time", "Resting Time", "Total Time"]
        for label in time_labels:
            time_tag = soup.find('span', class_=f'wprm-recipe-{label.lower().replace(" ", "-")}-label')
            if time_tag:
                times[label] = time_tag.find_next_sibling('span').text.strip()
            else:
                times[label] = 'N/A'

        # Extract serving size
        serving_tag = soup.find('span', class_='wprm-recipe-servings')
        servings = serving_tag.text.strip() if serving_tag else 'N/A'

        # Extract ingredients
        ingredients = []
        for ingredient_group in soup.find_all('div', class_='wprm-recipe-ingredient-group'):
            group_name = ingredient_group.find('h4').text.strip() if ingredient_group.find('h4') else ''
            group_ingredients = []
            for li in ingredient_group.find_all('li', class_='wprm-recipe-ingredient'):
                ingredient = li.get_text(separator=' ').strip()
                group_ingredients.append(ingredient)
            ingredients.append({'group': group_name, 'ingredients': group_ingredients})

        # Extract instructions
        instructions = []
        for instruction_group in soup.find_all('div', class_='wprm-recipe-instruction-group'):
            group_name = instruction_group.find('h4').text.strip() if instruction_group.find('h4') else ''
            group_instructions = []
            for li in instruction_group.find_all('li', class_='wprm-recipe-instruction'):
                instruction = li.get_text(separator=' ').strip()
                group_instructions.append(instruction)
            instructions.append({'group': group_name, 'instructions': group_instructions})

        # Return extracted details
        return {
            'url': url,
            'title': title,
            'image': image_url,
            'content': content_paragraphs,
            'times': times,
            'servings': servings,
            'ingredients': ingredients,
            'instructions': instructions
        }
    else:
        print(f"Failed to retrieve details for {url}")
        return None

# List of recipe URLs
recipe_links = [
"https://pastaetal.com/recipes/pasta-recipes/fazzoletti-with-pesto/",
"https://pastaetal.com/recipes/pasta-recipes/bitter-greens-pansotti-with-walnut-sauce/",
"https://pastaetal.com/recipes/sauce-recipes/osso-buco/",
"https://pastaetal.com/recipes/pasta-recipes/wholemeal-spelt-gemelli/",
"https://pastaetal.com/recipes/pasta-recipes/squid-ink-and-lemon-linguine-with-whitebait/",
"https://pastaetal.com/recipes/pasta-recipes/baked-tortiglioni/",
"https://pastaetal.com/recipes/sauce-recipes/sausage-ragu/",
"https://pastaetal.com/recipes/pasta-recipes/egg-yolk-pappardelle/",
"https://pastaetal.com/recipes/sauce-recipes/brown-butter-pink-peppercorns/",
"https://pastaetal.com/recipes/pasta-recipes/red-dragonfruit-tortelli/",
"https://pastaetal.com/recipes/sauce-recipes/tomato-and-basil-sauce/",
"https://pastaetal.com/recipes/pasta-recipes/spinach-and-ricotta-ravioli/",
"https://pastaetal.com/recipes/sauce-recipes/slow-cooked-pork-shoulder-ragu/",
"https://pastaetal.com/recipes/pasta-recipes/handmade-paccheri/",
"https://pastaetal.com/recipes/sauce-recipes/meatballs-in-tomato-sauce/",
"https://pastaetal.com/recipes/pasta-recipes/spinach-fettuccine/"
]

recipes = []
for link in recipe_links:
    recipe_details = extract_recipe_details(link)
    if recipe_details:
        recipes.append(recipe_details)

with open('recipes2.json', 'w', encoding='utf-8') as f:
    json.dump(recipes, f, ensure_ascii=False, indent=4)

print("Recipe details saved to recipes2.json")
