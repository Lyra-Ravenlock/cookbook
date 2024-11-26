from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    # views
    path('', views.index, name="index"),
    path('login', views.login_view, name='login'),
    path("logout", views.logout_view, name="logout"),
    path('register', views.register, name='register'),
    path('recipe/<str:username>/<str:recipe_title>', views.recipe, name="recipe"),
    path('edit/<str:username>/<int:recipe_id>', views.edit, name="edit"),
    path('new-recipe', views.new_recipe, name="new-recipe"),
    
    # Ajax Utilities
    path('check-title', views.check, name="check-title"),
    path('calculate/<str:username>/<int:recipe_id>', views.calculate, name="calculate"),
    
]

