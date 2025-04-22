from django.db import models
from django.conf import settings

# Stock model
class Stock(models.Model):
    symbol = models.CharField(max_length=16, unique=True)
    company_name = models.CharField(max_length=128)
    purchase = models.DecimalField(max_digits=18, decimal_places=2)
    last_div = models.DecimalField(max_digits=18, decimal_places=2)
    industry = models.CharField(max_length=64)
    market_cap = models.BigIntegerField()

    class Meta:
        db_table="stocks"

    def __str__(self):
        return f"{self.symbol} - {self.company_name}"

# Portfolio model: links a user to a stock (many-to-many through model)

class Portfolio(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='portfolios', on_delete=models.CASCADE)
    stock = models.ForeignKey('Stock', related_name='portfolios', on_delete=models.CASCADE)

    class Meta:
        db_table="portfolios"

    def __str__(self):
        return f"{self.user.username} - {self.stock.symbol}"

# Comment model: linked to a user and (optionally) a stock
class Comment(models.Model):
    title = models.CharField(max_length=128)
    content = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)
    stock = models.ForeignKey('Stock', related_name='comments', null=True, blank=True, on_delete=models.SET_NULL)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='comments', on_delete=models.CASCADE)

    class Meta:
        db_table="comments"

    def __str__(self):
        return f"Comment by {self.user.username} on {self.created_on.strftime('%Y-%m-%d')}"

