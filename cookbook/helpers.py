import string
from .models import User, Recipe

# Get the recipe from the request user by title
def user_recipe_title(request, recipe_title):
    user = request.user
    user_recipes = Recipe.objects.all().filter(user=user.pk)

    # Get the recipe from current user
    for recipe in user_recipes:
        if recipe.title.strip(' ') == recipe_title.strip(' '):
            recipe = recipe
            return recipe

# Get the recipe from the request user by id
def user_recipe_id(request, recipe_id):
    user = request.user
    user_recipes = Recipe.objects.all().filter(user=user.pk)

    # Get the recipe from current user
    for recipe in user_recipes:
        if recipe.pk == recipe_id:
            recipe = recipe
            return recipe

    