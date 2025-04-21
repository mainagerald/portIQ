# Migration & Upgrade Plan: React (Vite + TypeScript) & Django Backend

## Overview
This document outlines a step-by-step workflow for migrating the current CRA React + .NET backend stack to a modern React (Vite + TypeScript) frontend and Django backend. The plan preserves existing business logic and user experience while leveraging the benefits of the new stack.

---

## 1. Preparation
- Review the current business logic summaries for both frontend and backend (see context folder).
- Audit all existing features, workflows, and APIs to ensure nothing is missed during migration.
- Set up a new git branch or repository for the migration.

---

## 2. Frontend Migration: CRA → Vite (React + TypeScript)
### Steps:
1. **Initialize New Vite Project**
   - Run: `npm create vite@latest frontend-vite -- --template react-ts`
2. **Copy Over Assets & Styles**
   - Move `public/`, CSS, and Tailwind config files to the Vite project.
   - Reinstall and configure TailwindCSS for Vite.
3. **Migrate Components & Pages**
   - Copy `src/Components/`, `src/Pages/`, and other logic into the new `src/`.
   - Refactor imports and resolve any CRA-specific code (e.g., service workers, env vars).
4. **Update Routing & Context**
   - Ensure React Router and context providers are set up in Vite's entry point.
5. **API Integration**
   - Refactor API calls to point to Django backend endpoints (to be implemented).
6. **Testing**
   - Run and test the Vite app locally, resolving any build or runtime issues.

---

## 3. Backend Migration: .NET → Django
### Steps:
1. **Initialize Django Project**
   - Run: `django-admin startproject backend_django`
   - Create main app: `python manage.py startapp core`
2. **Model Translation**
   - Translate .NET models to Django ORM models (`AppUser`, `Stock`, `Portfolio`, `Comment`).
   - Set up relationships and constraints in `models.py`.
3. **Authentication**
   - Use Django's built-in auth system for user management.
   - Implement JWT authentication (e.g., with `djangorestframework-simplejwt`).
4. **API Endpoint Migration**
   - Use Django REST Framework to recreate endpoints:
     - `/api/account/` (register, login)
     - `/api/portfolio/` (CRUD)
     - `/api/stock/` (CRUD, search)
     - `/api/comment/` (CRUD)
   - Ensure business logic and validation match the .NET implementation.
5. **External API Integration**
   - Integrate with Financial Modeling Prep API for stock data enrichment in Django services/views.
6. **Testing**
   - Write unit and integration tests for all endpoints and workflows.

---

## 4. Data Migration
- Export data from the .NET backend (e.g., via SQL dumps or custom scripts).
- Write migration scripts to import users, portfolios, stocks, and comments into Django models.
- Validate data integrity post-migration.

---

## 5. Integration & QA
- Update frontend API URLs to point to Django endpoints.
- Test all user flows end-to-end (auth, portfolio, search, comments, etc.).
- Fix any issues with CORS, authentication, or data serialization.

---

## 6. Deployment
- Set up production-ready environments for both Vite frontend and Django backend (Docker, CI/CD, etc.).
- Update documentation and onboarding guides.

---

## 7. Post-Migration Tasks
- Monitor for bugs or regressions.
- Optimize performance and security settings.
- Plan for future enhancements leveraging the new stack.

---

## References
- [Vite + React Docs](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [djangorestframework-simplejwt](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/)
- [Migrating from CRA to Vite](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)

---

This plan ensures a systematic, feature-complete migration to React (Vite + TS) and Django, preserving your current business logic and user experience. For detailed mapping of specific modules or code, refer to the business logic summaries in the context folder.
