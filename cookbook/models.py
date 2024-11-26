from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class User(AbstractUser):
    pass
    
    def __str__(self):
        return self.username
       

    
class Recipe(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='User')
    title = models.TextField()
    image = models.TextField()
    ingredients_json = models.TextField()
    instructions = models.TextField()
    yields = models.TextField()
    nutrients_json = models.TextField()
    
    # Flags
    ingredients_is_object = models.BooleanField()

    def __str__(self):
        return f'{self.title} from {self.user.username}'

