# Granular Migration Guide: CRA/.NET → Vite (React+TS) & Django

This guide provides a detailed mapping and step-by-step instructions for migrating all endpoints, models, components, and business logic from your current stack to the new stack.

---

## 1. Models Mapping (.NET → Django)

### .NET Models → Django Models
| .NET Model   | Django Model Example |
|--------------|---------------------|
| AppUser      | class User (Django's built-in) |
| Stock        | class Stock(models.Model): ... |
| Portfolio    | class Portfolio(models.Model): ... |
| Comment      | class Comment(models.Model): ... |

#### Example: Stock Model
```python
class Stock(models.Model):
    symbol = models.CharField(max_length=16, unique=True)
    company_name = models.CharField(max_length=255)
    purchase = models.DecimalField(max_digits=18, decimal_places=2)
    last_div = models.DecimalField(max_digits=18, decimal_places=2)
    industry = models.CharField(max_length=255)
    market_cap = models.BigIntegerField()
```

#### Example: Portfolio Model
```python
class Portfolio(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    class Meta:
        unique_together = ('user', 'stock')
```

#### Example: Comment Model
```python
class Comment(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
```

---

## 2. API Endpoints Mapping

### .NET Endpoints → Django REST Framework Views
| .NET Endpoint           | Django Endpoint (View/Serializer)       | Method(s)        |
|------------------------|-----------------------------------------|------------------|
| /api/account/register  | /api/account/register/ (RegisterView)   | POST             |
| /api/account/login     | /api/account/login/ (TokenObtainPair)   | POST             |
| /api/portfolio         | /api/portfolio/ (PortfolioViewSet)      | GET, POST, DELETE|
| /api/stock             | /api/stock/ (StockViewSet)              | GET, POST, PUT, DELETE |
| /api/comment           | /api/comment/ (CommentViewSet)          | GET, POST, DELETE|

#### Example: Portfolio ViewSet
```python
from rest_framework import viewsets, permissions
from .models import Portfolio
from .serializers import PortfolioSerializer

class PortfolioViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Portfolio.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
```

---

## 3. Serializers (Django REST Framework)
- Create serializers for all models to handle validation and data transformation.

#### Example: StockSerializer
```python
from rest_framework import serializers
from .models import Stock

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'
```

---

## 4. Authentication
- Use Django's built-in auth for registration and login.
- Use `djangorestframework-simplejwt` for JWT authentication.
- Protect endpoints with `IsAuthenticated` permissions.

---

## 5. Business Logic Mapping
- Move all business rules (e.g., no duplicate stocks in portfolio, stock existence checks) into Django model methods or DRF viewsets.
- Integrate Financial Modeling Prep API calls in Django services (e.g., using `requests` library in custom service modules).

---

## 6. Frontend Component Mapping (CRA → Vite)

### Components/Pages
| CRA/React Component/Page | Vite (React+TS) Equivalent | Notes |
|-------------------------|----------------------------|-------|
| App.tsx                 | App.tsx (entry point)      | Update imports, context providers |
| src/Pages/*             | src/pages/*                | Copy and refactor as needed |
| src/Components/*        | src/components/*           | Copy and refactor as needed |
| src/Context/useAuth.tsx | src/context/useAuth.tsx    | Update API URLs, adapt to Django JWT |
| src/api.tsx             | src/api.ts                 | Update endpoints, error handling |

### Key Changes
- Update all API URLs to Django backend endpoints.
- Update authentication logic to use JWT from Django.
- Adapt error handling and data shape as needed (based on DRF responses).
- Ensure TailwindCSS is configured for Vite.

---

## 7. Example API Call (Frontend)
```typescript
// Example: Fetch user portfolio
import axios from 'axios';

export const getPortfolio = async (token: string) => {
  return axios.get('/api/portfolio/', {
    headers: { Authorization: `Bearer ${token}` }
  });
};
```

---

## 8. Data Migration
- Export data from .NET SQL database (CSV or JSON).
- Write Django management commands or scripts to import data into Django models.
- Validate relationships and integrity.

---

## 9. Testing
- Write unit tests for Django models, serializers, and views.
- Write integration tests for major user flows.
- Test all frontend flows against the new Django backend.

---

## 10. Deployment
- Use Docker or virtual environments for Django.
- Use Vite build for frontend static assets.
- Configure CORS and environment variables.

---

## 11. References
- [Django REST Framework Docs](https://www.django-rest-framework.org/)
- [Vite + React Docs](https://vitejs.dev/guide/)
- [SimpleJWT Docs](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/)

---

This guide provides detailed mapping and code examples for migrating every major part of your stack. For specific code samples or migration scripts, request a focused example.
