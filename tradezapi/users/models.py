from django.db import models
from django.contrib.auth.models import AbstractUser

# Custom user model extending AbstractUser
class User(AbstractUser):
    email_verified = models.BooleanField(default=False, help_text='Has the user verified their email?')
    # Relationships to Portfolio and Comment will be defined via related_name in those models

    class Meta:
        db_table="users"

    def __str__(self):
        return self.username

