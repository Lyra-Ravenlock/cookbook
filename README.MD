MY COOKBOOK
============
*Currently setting up for deployment*


## DISTINCTIVENESS AND COMPLEXITY
This project is based on the material taught in this course. 
But it satisfies the distinctiveness and complexity requirements mentioned: 

Most of the previous projects focused on working with a lot of Models and combining strings, numbers and booleans from various DB tables

This project focuses on one model, apart from User. The complexity here lies in working with lists of dictionaries, using Json to move data between the DB, the server and tha JS, creating dynamic forms, recieving Query Dictionaries  whith list values, and performing simple calculations dynamically, by sending data to the server via Ajax and back to update the page, seamlessly.


#### DISTINCTIVENESS REQUIREMENTS
* The app has no social aspect or any other characteristic of such an app, it's **not** a social network app in any way.
* It's not an e-commerce either, nor does it share any of the mechanics of one.
* it's not based on the old Pizza Project, which was a kind of e-commerce itself.
* It's not similar in nature or purpose to any of the previous projects.
* It required approximately more than 3 times the time previous projects took. A lot of that time was spent searching for ways to achieve things I hadn't done before such as working with queryDicts with lists instead of items, or setting up Django's User model.

#### COMPLEXITY
Below is a list of things that are new to this project and / or more complex than similar actions in previous projects.


1. Setting up a project from the start and learning about details such as having to set up Django's model *class User(AbstractUser)* in settings.py **before** the first migration. 
2. Working with JSON to store and retrieve more complex data structures, such as dictionaries, to and from the database
3. Iterating queryDicts and finding how I can form the needed data structure to match the one I need for my model and HTML.
4. Iterating queryDicts where *value* is a **list of values**.
5. Converting queryDicts to python Dicts when necessary
6. Using **Ajax** to **retrieve information**, send it to the **server for calculations**, according to case, then form the required **dictionary**, **JSON** it, and send it back to JS. Then **parse** it in JS to retrieve the dictionary data, and **iterate** them to print the page with the right information without refreshing it.  
7. Working with user feedback, complete with a message and coordinating color for error or success. 
8. Following Django documentation to send a **csrf token** with Ajax.
9. Creating a **separate menu for mobile** with CSS and JavaScript
10. Having calculators on the page do simple calculations in JavaScript to **interactively return results onkeyup**, without the need to submit anything
11. Create a **form** where the user can **dynamically create as many input rows as needed**, and then iterate it and form the values into the **list of dictionaries** that should be stored in the DB.
12. New input fields have autofocus upon creation


## WHAT'S CONTAINED IN EACH FILE
#### Python
* *settings.py* - Added setting for Django's model *class User(AbstractUser)
* *urls.py* - 9 paths for the *cookbook* app: index, edit, recipe, new-recipe, check-title, calculate, and login, logout, register
* *models.py* - Django's abstract user and the Recipe model
* *views.py* - Functions: index, login_view, logout_view, register, recipe, edit, new_recipe, check, calculate

#### HTML
* *login.html* - Login form and a message to log out if they've already logged in or register if they haven't already. Saves to user model
* *register.html* Register form saves to the abstract user model.
* *index.html* - The Index view is where logged-in users can view all of their recipes as tiles. Saves to Recipe Model
* *layout.html* - The basic HTML layout containing mainly the navigation bar and the messages and the JS function that controls the mobile menu 
* *new-recipe.html* - A page rendering a form where the user can input a custom recipe, check name availability, and add input fields dynamically. Saves to Recipe Model
* *recipe.html* - A view of the recipe in detail, listing all of its information and images. Options to edit the recipe or to make calculations in recipes that are already edited from string into dictionary. 
* *helpers.py* - 2 functions that are used by multiple views, one to get recipe from logged in user by title, and one to get recipe from logged in user by id

#### JavaScript
* *recipe.js* - The functions that toggle various elements visible or not. Also it has the event listeners and functions for the calulators and the deleting alert window, and the **Ajax** function that send the data from the **calculate** form to the server and then updates the values on the recipe page accordingly. 
* *new-form.js* - All the functions for the new-recipe page: addField() and checkTitle() which is Ajax.
* Both files also include the getCookie() function which is copied from Django's documentation 

#### CSS
* Styling


## HOW TO RUN THE APP
1. **Register** for an account
2. **Log in**
3. *Import* a recipe (Some test links below)
4. *View* the recipe
5. **Input** Metric Conversions and **save** them. Use the **calculators** on the right for assistance with the conversions
6. **Calculate** quantities based on one inredient's quantity as basis. I.e. 
7. Select the basis ingredient and input quantity available
8. Click *Calculate*
9. Manually input new recipe
10. Delete a recipe

```bash
python manage.py runserver
```

To scrape a recipe, recipe-scrapers 14.53.0 uses this link as an example
```bash 
https://www.allrecipes.com/recipe/158968/spinach-and-feta-turkey-burgers/
```

Or this one for wild mode
```bash 
https://www.feastingathome.com/tomato-risotto/
```
This one's only 3 ingredients, easier to check functionality with
```bash 
https://www.loveandlemons.com/homemade-pasta-recipe/
```
Or any other recipe link! 


##DOCUMENTATION
### WHAT THE APP DOES - SHORT
This app can store the user's recipes and calculate the quantities of the ingredients in a recipe based on the desired quantity of one ingredient. 


### WHAT PROBLEM DOES THIS APP SOLVE - TARGET GROUP & EXAMPLE
Trying to make a division with 
1 tablespoon plus one teaspoon of butter / 2 
seems less convenient than dividing 
19 gr / 2.

This app may be useful for Europeans and other people that use the metric system, or for people that use imperial units but would still like to convert to metric so that simple calculations are easier to perform, in the context of a recipe book. 

*I have 80 grams of butter. I want to make cookies with it. But the recipe online asks for 130 grams of butter.* If the recipe is in metric, it's simple math. Otherwise, it's usually a conversion and then simple math. This app allows the user to do both.


### FEATURES
* **Index**
  * The user can paste a url of a page that contains a **Google Schema with a recipe**, and the app will **import** and **save** the recipe in the user's account. 
  * If the user tries to import a recipe with the same exact title as another one of the user's recipes, the page will message the user to choose a different recipe.
  * The user can see all of their saved recipes with title and image, in a grid.
* **View Recipe** 
  * The user can **view** one of their recipes: **Title, image, servings, ingredients, nutrients (where available), and Instructions (walkthrough)**
  * The user can choose to **input metric conversions** for the ingredients. 
    * When editing the recipe, the user can **use on-screen calculators** for volume and weight conversions. The calculations are handled as the user types without the need for submitting a value.
    * The original string which was scraped, is shown as value in the ingredient string input field, for convinience
    * The user can choose **volume or weight units, ml & gr**, or they can choose "item"
    * When saving the edit, the data are saved in a **dictionary**, so that the quantities can be used for calculations.
  * Calculations
    * Once the ingredients have been edited from string, the user has the **option to use them for calculations**
    * When clicking the calculations button, the user can **chose one of the ingredients as the base**, and input the **desired value** for it
    * Clicking "calculate", the recipe will print the values of all of the ingredients, *proportionally* to the desired quantity of the base ingredient.
    * If "egg" or "yolk" is present in the ingredient title string, the calculation will return the closest integer
    * If "dough" is present in the ingredient title string, the calculation will return the original value (usually 1).
    * This calculation is printed on screen but not saved in the DB, keeping the original recipe intact.
  * Delete
    * The user can choose to delete their recipe 
    * When they click the delete button, at the bottom of the recipe, they're presented with a confirmation window. if they click "delete" again, the recipe is deleted from the database, and the use is redirected to the index
    * If they click "cancel", the window is closed and the recipe remains.
* New Recipe - The user can input a recipe manually here
  * There's a button **checking the availability** of the recipe title
  * There are buttons allowing the user to **dynamically add new input fields** for ingredients, Walkthough steps and nutrients
  * If the title of the recipe is already being used by another one of the user's recipes, the page will feedback that the new recipe needs to have a new title not in use.
  * Upon saving the recipe, the ingredients are saved as a dictionary directly and are available for calculations. 
* Log in, Log out, Registration 



### DETAILS
* The app uses feedback messages in the following cases:
  * When the user attempts to scrape a URL that contains no (scrapable) recipe
  * When the user attempts to scrape a recipe with a title that already exists in the DB
  * When the user attempts to input a new-recipe with a title that already exists in the DB, it throws an error
  * When the user successfully scrapes the recipe
  * When the user successfully deletes a recipe
* Users can register and use the app, but every user can only interact with their own recipes.
* The app is responsive for mobile devices, using flexboxes, media queries and some JS.
* If the string "egg" or "yolk" is in the string of the ingredient, the calculation will round the number to the closest integer.
* If the string "dough" is in the string of the ingredient, the calculation will keep the quantity unchanged. (usually 1)


### CREDIT
* Scraper tool is **recipe-scrapers 14.53.0** from  *https://pypi.org/project/recipe-scrapers/*. 
* All code was written by myself. Some recipes have been scraped from public websites on the internet, along with their images and information. 
* Background images, icons and logos are from **envato elements**, registered for *CS50 Web* using my subscription.
* **Bootstrap** is being used for some CSS, apart from the custom CSS file.
* The view functions for *register*, *login* and *logout* are used as found in previous projects, especially from *Network*.
* *Some* of the HTML for the navbar is from Project *Network*, edited.
* The getCookie() function is copied from Django's documentation 

