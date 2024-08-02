import os
import json
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Function to save recipe details to Supabase
def save_to_supabase(recipe, creator):
    # Store the data directly without using json.dumps
    recipe_data_to_save = {
        'url': recipe['url'],
        'title': recipe['title'],
        'image': recipe['image'],
        'content': recipe['content'],   # Store list directly
        'times': recipe['times'],       # Store dictionary directly
        'servings': recipe['servings'],
        'ingredients': recipe['ingredients'],  # Store list directly
        'instructions': recipe['instructions'], # Store list directly
        'creator': creator
    }
    
    try:
        # Insert the recipe data into the 'scraped_recipes' table
        response = supabase.table('Scraped_recipes').insert(recipe_data_to_save).execute()
        
        if response.data:
            print("Recipe saved successfully")
        else:
            print(f"Failed to save recipe: {response}")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

# Load recipes from JSON file
def load_recipes_from_json(json_file):
    with open(json_file, 'r', encoding='utf-8') as f:
        recipes = json.load(f)
    return recipes

# Main function to load JSON and save to Supabase
def main():
    json_file = 'recipes.json'  # Replace with your JSON file path
    recipes = load_recipes_from_json(json_file)
    creator = "Pasta et Al"  # Set the creator name
    for recipe in recipes:
        save_to_supabase(recipe, creator)

if __name__ == '__main__':
    main()