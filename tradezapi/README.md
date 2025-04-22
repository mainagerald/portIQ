# Tradez API Backend

A robust Django REST Framework backend for the Tradez platform, featuring JWT authentication, email verification, Google OAuth login, and integration with Financial Modeling Prep (FMP) for stock data.

---

## Features

- **Custom User Model:** Extends Django's `AbstractUser` with `email_verified` field.
- **Authentication:**
  - JWT login (username/password) with custom claims.
  - Google OAuth2 login (auto-registers new users).
  - Email verification required before login.
- **Registration:**
  - `/api/auth/register/` endpoint creates new users and sends verification emails.
- **Email Verification:**
  - Users must verify their email via a unique link before accessing protected endpoints.
- **Stock, Portfolio, Comment APIs:**
  - CRUD endpoints for business logic, all protected by JWT.
- **FMP Integration:**
  - Utility functions for fetching real-time stock data from FMP API.
- **Comprehensive Testing:**
  - Pytest-based suite covers registration, authentication, permissions, and FMP integration.

---

## Setup & Configuration

1. **Clone the repository and install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

2. **Environment Variables:**
   Create a `.env` file in `tradezapi/` with the following:
   ```env
   FMP_KEY=your_fmp_api_key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=your_email@gmail.com
   EMAIL_HOST_PASSWORD=your_app_password
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

3. **Apply migrations:**
   ```sh
   python manage.py migrate
   ```

4. **Run the server:**
   ```sh
   python manage.py runserver
   ```

---

## API Endpoints

### Authentication & User
- `POST /api/auth/register/` — Register new user (triggers email verification)
- `POST /api/auth/token/` — Obtain JWT (requires verified email)
- `POST /api/auth/token/refresh/` — Refresh JWT
- `GET /api/auth/verify-email/<uidb64>/<token>/` — Verify email
- `POST /api/auth/google-login/` — Google OAuth2 login

### Business Logic
- `GET/POST /api/stocks/` — List or create stocks
- `GET/PUT/DELETE /api/stocks/<id>/` — Retrieve, update, delete stock
- `GET/POST /api/portfolios/` — List or create portfolios
- `GET/PUT/DELETE /api/portfolios/<id>/` — Retrieve, update, delete portfolio
- `GET/POST /api/comments/` — List or create comments
- `GET/PUT/DELETE /api/comments/<id>/` — Retrieve, update, delete comment

---

## Registration & Email Verification Flow

1. **User Registration:**
   - User submits username, email, password to `/api/auth/register/`.
   - Backend creates user with `email_verified=False` and sends a verification email.

2. **Email Verification:**
   - User clicks the verification link in their email (`/api/auth/verify-email/<uidb64>/<token>/`).
   - Backend sets `email_verified=True` if the link is valid.

3. **Login:**
   - Only users with `email_verified=True` can obtain JWT tokens and access protected endpoints.

---

## Testing

- Run all tests using:
  ```sh
  pytest
  ```
- Tests mock email sending and cover registration, verification, authentication, and permissions.

---

## Google OAuth2 Login

- Obtain a Google ID token on the frontend.
- Send it to `POST /api/auth/google-login/`.
- Backend verifies the token, logs in or creates the user, and returns JWT tokens.

---

## Environment Variables

- All sensitive credentials (API keys, SMTP, OAuth) are loaded from `.env`.
- Django settings are configured to read these automatically.

---

## Contributing & Extending

- Code is well-commented and modular.
- Add more endpoints or business logic as needed.
- For questions or feature requests, open an issue or PR.

---

## License

MIT License
