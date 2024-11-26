from django.shortcuts import render
from django.db import IntegrityError
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.messages import constants as messages
from django.http import JsonResponse
import json
import math
from django import forms

from .models import User, Recipe
from .helpers import user_recipe_title, user_recipe_id

from recipe_scrapers import scrape_me


# Create your views here.

# Login, logout and register are copied from the last project, network
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))

        else:
            print("Invalid credentials.")
            return render(request, "cookbook/login.html", {
                "message": "Invalid credentials.",
                'message-type': 'error'
            })
        
    else:
        return render(request, "cookbook/login.html")
       

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "cookbook/register.html", {
                "message": "Passwords don't match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "cookbook/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "cookbook/register.html")





def index(request):  
    user = request.user
    user_recipes = Recipe.objects.all().filter(user=user.pk)
    

    if request.method == "GET":
        return render(request, "cookbook/index.html", { 
             'recipes': user_recipes    
        })

    #  POST
    else:
        user = request.user
        form = request.POST
        url = form["recipe-url"]
        
        # If url contains recipe
        try:
            scraper = scrape_me(url, wild_mode=True)
            title = scraper.title()
            image = scraper.image()
            yields = scraper.yields()

            # If recipe with this title already exists from current user
            exists = Recipe.objects.filter(title=title)        
            if exists.count() > 0:
                for recipe in exists:
                    if recipe.user == request.user:
                    
                        user_recipes = Recipe.objects.all().filter(user=user.pk)
                        return render(request, "cookbook/index.html", {
                            "message": "Recipe with this title already saved",
                            'message_type': 'error',
                            'recipes': user_recipes,
                        })
               
            # Otherwise, add it
            ingredients = scraper.ingredients()
            ingredients_json = json.dumps(ingredients)

            instructions_list = scraper.instructions_list()
            instructions_json = json.dumps(instructions_list)

            nutrients = scraper.nutrients() 
            nutrients_json = json.dumps(nutrients)

            new_recipe = Recipe(user=user, title=title, image=image, ingredients_json=ingredients_json, instructions=instructions_json, yields=yields, nutrients_json=nutrients_json, ingredients_is_object=False)
            new_recipe.save()

            user_recipes = Recipe.objects.all().filter(user=user.pk)

            return render(request, "cookbook/index.html", {
                'recipes': user_recipes,
                'message': 'Recipe added to your cookbook!',
                'message_type': 'success',          
        })

        # In case of error upon scraping
        except:
            return render(request, "cookbook/index.html", {
                 "message": "No recipe in this url",
                 'message_type': 'error',
                 'recipes': user_recipes,
            })



def recipe(request, username, recipe_title):
    user = request.user
    user_recipes = Recipe.objects.all().filter(user=user.pk)
    
    # Helper Function
    recipe_class =  user_recipe_title(request, recipe_title)
    
    recipe_id = recipe_class.pk
    ingredient_list = json.loads(recipe_class.ingredients_json)
    instructions_list = json.loads(recipe_class.instructions)
    nutrients_list = json.loads(recipe_class.nutrients_json)
    title = recipe_class.title
    image = recipe_class.image
    yields = recipe_class.yields
    ingredients_is_object = recipe_class.ingredients_is_object
    
    recipe = {'id': recipe_id, 'title': title, 'image': image, 'yields': yields, 'ingredients_list': ingredient_list, 'instructions': instructions_list, 'nutrients': nutrients_list, 'ingredients_is_object': ingredients_is_object}

    # Delete Recipe
    if request.method == 'POST':
        if 'delete' in request.POST:
            for recipe in user_recipes:
                if recipe.title == recipe_title:
                    recipe.delete()

            user_recipes = Recipe.objects.all().filter(user=user.pk)
            return render(request, "cookbook/index.html", { 
             'recipes': user_recipes,
             'message': "Recipe deleted",
             'message_type': 'success'
        })
            
        
    # Render the page with the recipe
    return render(request, "cookbook/recipe.html", {
                 "title": title,
                 'recipe': recipe,
                 
                 
        })  




def edit(request, username, recipe_id):
    user = request.user
    user_recipes = Recipe.objects.all().filter(user=user.pk)

    recipe = user_recipe_id(request, recipe_id)
    
    if request.method == "POST":
        form = request.POST
  
        # Converting queryDict to Dict so that iterating I can get all the values and complete strings. I finally found how here: https://stackoverflow.com/questions/13349573/how-to-change-a-django-querydict-to-python-dict
        data = dict(form)

        new_ingredients = []

        for i in range(len(data['quantity'])):
            try:
                quantity = float(data['quantity'][i])
            except:
                quantity = 0
            new_ingredients.append( {'quantity': quantity, 'ingredient': data['ingredient'][i], 'unit': data['unit'][i] } )

        recipe.ingredients_json = json.dumps(new_ingredients)   
        recipe.ingredients_is_object = True
        print(recipe)
        recipe.save()

    return redirect('recipe', username=user.username, recipe_title=recipe.title)




def new_recipe(request):  
    user = request.user
     
    if request.method == "POST":

        form = request.POST
        print(form)
        dict_form = dict(form)

        title = form['recipe-title'].strip()
        if title == '':
            return render(request, "cookbook/new-recipe.html", {
                "message": "New recipe needs to have a title",
                'message_type': 'error',
                
            })

        # Check that recipe title doesn't already exist from user
        exists = Recipe.objects.filter(title=title)        
        if exists.count() > 0:
            for recipe in exists:
                if recipe.user == request.user:
                   
                    user_recipes = Recipe.objects.all().filter(user=user.pk)
                    return render(request, "cookbook/new-recipe.html", {
                        "message": "Recipe with this title already saved",
                        'message_type': 'error',
                        'recipes': user_recipes,
                    })
                

        else:
            yields = form['yields']
            image_url = form['image_url']
            ingredients = []
            walkthrough = []
            nutrients = {}

            # Iterate Ingredients
            for i in range(len(dict_form['ingredient_name'])):
        
                try:
                    ingredient_quantity = int(dict_form['ingredient_quantity'][i])
                except:
                    ingredient_quantity = 0
        
                ingredients.append( {'quantity': ingredient_quantity, 'ingredient': dict_form['ingredient_name'][i], 'unit': dict_form['ingredient_unit'][i] } )
                
            
            # Nutrition Iteration
            for i in range(len(dict_form['nutrient-key'])):
                key = dict_form['nutrient-key'][i]
                value = dict_form['nutrient-value'][i]
                nutrients[key] = value 

            # Instructions
            for i in range(len(dict_form['instructions'])):
                walkthrough.append(dict_form['instructions'][i])
                

            ingredients_json = json.dumps(ingredients)
            instructions_json = json.dumps(walkthrough)
            nutrients_json = json.dumps(nutrients)
            
            new_recipe = Recipe(user=user, title=title, image=image_url, ingredients_json=ingredients_json, instructions=instructions_json, yields=yields, nutrients_json=nutrients_json, ingredients_is_object=True)
            
            new_recipe.save()

            return redirect('recipe', username=user.username, recipe_title=title)
        
    else:
        return render (request, 'cookbook/new-recipe.html')
    
    
            

def calculate(request, username, recipe_id):

    data = json.loads(request.body)
    base_ingredient = data['base_ingredient']
    base_new = data['value']

    # Helper Function
    recipe =  user_recipe_id(request, recipe_id)

    ingredients = json.loads(recipe.ingredients_json)

    base_old = 0
    standard_value = 0
    changed_value = 0

    calcRecipe = []
    for i in range(len(ingredients)):
        if ingredients[i]['ingredient'] == base_ingredient:
            base_old = ingredients[i]['quantity']
    
    
    for i in range(len(ingredients)):
        if ingredients[i]['ingredient'] == base_ingredient:
            base_old = ingredients[i]['quantity']
            calcRecipe.append({ 'quantity': base_new,  'ingredient': ingredients[i]['ingredient'], 'unit': ingredients[i]['unit'] })

        else: 
            standard_value = ingredients[i]['quantity']
            if 'egg'.lower() in ingredients[i]['ingredient'].lower() == 'egg' or 'eggs'.lower() in ingredients[i]['ingredient'].lower() or'yolk'.lower() in ingredients[i]['ingredient'].lower():
                changed_value = round(standard_value * base_new / base_old, 0)
                if changed_value == 0:
                    changed_value = 1
            elif 'pie crust'.lower() in ingredients[i]['ingredient'].lower() or 'dough'.lower() in ingredients[i]['ingredient'].lower():
                changed_value = standard_value
            else: 
                changed_value = round(standard_value * base_new / base_old, 1)
                
            
            calcRecipe.append({ 'quantity': changed_value,  'ingredient': ingredients[i]['ingredient'], 'unit': ingredients[i]['unit']})

    
    calc_json = json.dumps(calcRecipe)
    recipe.ingredients_json = calc_json
    
 
    return JsonResponse({
            'ingredient_list': calc_json,
            

        }, status=200)




def check(request):
    if request.method == 'POST':
        title = json.loads(request.body)['title']

        try:
            exists = Recipe.objects.filter(title=title.strip())
            
            for recipe in exists:
                if recipe.user == request.user:
                    
                    return JsonResponse({
                    'message': "Title already used",
                    'message-type': 'error',
                }, status=200)


            return JsonResponse({
                'message': 'Title is Free!',
                'message-type': 'success',
            }, status=200)

        except:
            return JsonResponse({
            'message': 'Title is Free!',
            'message-type': 'success',
        }, status=200)
    
    else:
        return redirect('index')
        
