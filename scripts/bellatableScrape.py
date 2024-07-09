import requests
from bs4 import BeautifulSoup
import json

# URL of the blog post
url = 'https://www.bellatable.fi/reseptit/romescoa-ja-paahdettua-purjoa'

# Send a GET request to the blog post
response = requests.get(url)
soup = BeautifulSoup(response.content, 'html.parser')

# Extract the title
title = soup.find('h1', class_='entry-title entry-title--large p-name').text.strip()

# Extract the image URL
image_div = soup.find('div', class_='image-block-wrapper')
image_url = image_div.find('img')['src']

# Extract the <p> elements with style="white-space:pre-wrap;" and <strong> elements within them
content_elements = []

for p in soup.find_all('p', style="white-space:pre-wrap;"):
    text_parts = []
    for part in p.contents:
        if part.name == 'strong':
            text = part.get_text(strip=True)
            if text:
                text_parts.append({'text': text, 'is_bold': True})
        else:
            text = part.string.strip() if part.string else ''
            if text:
                text_parts.append({'text': text})
    content_elements.append(text_parts)

# Save the extracted information into a dictionary
data = {
    'title': title,
    'image_url': image_url,
    'content_elements': content_elements
}

# Save the data to a JSON file for further use
with open('scraped_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)