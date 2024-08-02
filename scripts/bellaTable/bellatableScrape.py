import requests
from bs4 import BeautifulSoup
import json

# URL of the blog post
url = 'https://www.bellatable.fi/reseptit/kesakakku2024'

# Send a GET request to the blog post
response = requests.get(url)
soup = BeautifulSoup(response.content, 'html.parser')

# Extract the title
title = soup.find('h1', class_='entry-title entry-title--large p-name').text.strip()

# Extract the image URL
image_div = soup.find('div', class_='image-block-wrapper')
image_url = image_div.find('img')['src']

# Function to process text and identify ingredients
def process_text_and_identify_ingredients(tag):
    text_parts = []
    is_ingredient_section = False
    ingredients = []
    other_text = ""

    # Split the content of the tag by <br> to identify ingredients
    parts = str(tag).split('<br/>')
    for part in parts:
        soup_part = BeautifulSoup(part, 'html.parser')
        if soup_part.find('strong'):
            # Process the bold text as section title
            if ingredients:
                text_parts.append({'ingredients': ingredients})
                ingredients = []
            if other_text.strip():
                text_parts.append({'text': other_text.strip()})
                other_text = ""
            text = soup_part.get_text(strip=True)
            if text:
                text_parts.append({'text': text, 'is_bold': True})
                is_ingredient_section = True
        else:
            text = soup_part.get_text(strip=True)
            if text:
                if is_ingredient_section:
                    if len(text) <= 100:
                        ingredients.append(text)
                    else:
                        if ingredients:
                            text_parts.append({'ingredients': ingredients})
                            ingredients = []
                        text_parts.append({'text': text.strip()})
                        is_ingredient_section = False
                else:
                    other_text += text + " "
    
    if ingredients:
        text_parts.append({'ingredients': ingredients})
    if other_text.strip():
        text_parts.append({'text': other_text.strip()})
    
    return text_parts

# Process all paragraphs
content_elements = []
for p in soup.find_all('p', style="white-space:pre-wrap;"):
    content_elements.extend(process_text_and_identify_ingredients(p))

# Save the extracted information into a dictionary
data = {
    'title': title,
    'image_url': image_url,
    'content_elements': content_elements
}

# Print the final data for debugging
print("Final extracted data:")
print(json.dumps(data, ensure_ascii=False, indent=4))

# Save the data to a JSON file for further use
with open('scraped_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)
